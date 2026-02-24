/** @type {import("@observablehq/framework").Config} */
export default {
  title: "GCP OAuth",
  pages: [
    { name: "Home", path: "/" },
    { name: "Profile", path: "/profile" },
    { name: "Terms of Service", path: "/tos" },
    { name: "Privacy Policy", path: "/privacy" }
  ],
  footer: "Built with Observable Framework.",
  root: "src",
  dynamicPaths: [
    "/profile",
    "/site-config.js",
    "/auth/user",
    "/auth/login",
    "/auth/logout",
    "/auth/callback"
  ]
};
