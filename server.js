/**
 * GCP OAuth server
 *
 * Handles Google Cloud Platform OAuth 2.0 flow and serves the Observable
 * Framework app.
 *
 * In development (NODE_ENV !== "production"):
 *   - Starts Observable Framework dev server on FRAMEWORK_PORT (default 3001)
 *   - Proxies all non-auth requests to the dev server
 *   - Auth routes are handled directly here
 *
 * In production (NODE_ENV === "production"):
 *   - Serves the pre-built static files from ./dist
 *   - Auth routes are handled directly here
 *
 * Required environment variables (see .env.example):
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET
 *
 * Optional:
 *   PORT            - port this server listens on (default: 3000)
 *   FRAMEWORK_PORT  - port for the Observable Framework dev server (default: 3001)
 *   BASE_URL        - publicly reachable origin, used to build the redirect URI
 *                     (default: http://localhost:<PORT>)
 */

import "dotenv/config";
import {createServer} from "node:http";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {OAuth2Client} from "google-auth-library";
import express from "express";
import session from "express-session";
import {createProxyMiddleware} from "http-proxy-middleware";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

const PORT = parseInt(process.env.PORT ?? "3000", 10);
const FRAMEWORK_PORT = parseInt(process.env.FRAMEWORK_PORT ?? "3001", 10);
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;
const REDIRECT_URI = `${BASE_URL}/auth/callback`;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  console.error("ERROR: SESSION_SECRET environment variable is required.");
  process.exit(1);
}
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("ERROR: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required.");
  process.exit(1);
}

const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

const app = express();

// ── Session middleware ────────────────────────────────────────────────────────
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// ── Auth routes ───────────────────────────────────────────────────────────────

/**
 * GET /auth/login
 * Redirects the browser to Google's OAuth 2.0 consent screen.
 */
app.get("/auth/login", (_req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "consent"
  });
  res.redirect(url);
});

/**
 * GET /auth/callback
 * Google redirects here after the user grants (or denies) consent.
 * Exchanges the authorization code for tokens, verifies the ID token, and
 * stores the user payload in the session.
 */
app.get("/auth/callback", async (req, res) => {
  const {code, error} = req.query;

  if (error) {
    console.error("OAuth error:", error);
    return res.redirect("/?error=" + encodeURIComponent(String(error)));
  }

  if (!code || typeof code !== "string") {
    return res.redirect("/?error=missing_code");
  }

  try {
    const {tokens} = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    req.session.user = {
      sub: payload.sub,
      name: payload.name,
      email: payload.email,
      email_verified: payload.email_verified,
      picture: payload.picture,
      hd: payload.hd ?? null
    };

    res.redirect("/");
  } catch (err) {
    console.error("Token exchange failed:", err);
    res.redirect("/?error=auth_failed");
  }
});

/**
 * GET /auth/logout
 * Destroys the server-side session and redirects to the home page.
 */
app.get("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

/**
 * GET /auth/user
 * Returns the currently authenticated user as JSON, or 401 if not signed in.
 */
app.get("/auth/user", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json(null);
  }
});

// ── Static / proxy ────────────────────────────────────────────────────────────

if (isProd) {
  // Serve the pre-built Observable Framework output.
  app.use(express.static(path.join(__dirname, "dist")));

  // Fall back to index.html for client-side routing.
  app.use((_req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
} else {
  // In development, proxy all remaining requests to the Observable Framework
  // dev server so we get hot-reloading and proper asset serving.
  app.use(
    createProxyMiddleware({
      target: `http://localhost:${FRAMEWORK_PORT}`,
      changeOrigin: true,
      ws: true // proxy WebSocket connections (used by Framework's HMR)
    })
  );
}

// ── Start ─────────────────────────────────────────────────────────────────────

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`GCP OAuth server running on http://localhost:${PORT}`);
  if (!isProd) {
    console.log(`  Proxying to Observable Framework dev server on port ${FRAMEWORK_PORT}`);
    console.log(`  Redirect URI: ${REDIRECT_URI}`);
  }
});
