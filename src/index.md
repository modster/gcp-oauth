---
title: Home
---

# GCP OAuth

```js
const user = await fetch("/auth/user").then((r) => r.json()).catch(() => null);
```

```js
if (user?.email) {
  display(html`
    <div class="login-card">
      <img src="${user.picture}" alt="Profile picture" width="64" height="64" style="border-radius:50%">
      <h2>Welcome, ${user.name}!</h2>
      <p><strong>Email:</strong> ${user.email}</p>
      <a href="/profile" class="btn">View Profile</a>
      <a href="/auth/logout" class="btn btn-secondary">Sign Out</a>
    </div>
  `);
} else {
  display(html`
    <div class="login-card">
      <h2>Sign in with Google</h2>
      <p>This app uses Google Cloud Platform OAuth to authenticate users securely.</p>
      <a href="/auth/login" class="btn btn-google">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" style="vertical-align:middle;margin-right:8px">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
        Sign in with Google
      </a>
    </div>
  `);
}
```

<style>
.login-card {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border: 1px solid var(--theme-foreground-faintest);
  border-radius: 8px;
  text-align: center;
}
.login-card img {
  display: block;
  margin: 0 auto 1rem;
}
.login-card h2 {
  margin: 0 0 0.5rem;
}
.login-card p {
  color: var(--theme-foreground-muted);
  margin-bottom: 1.5rem;
}
.btn {
  display: inline-block;
  padding: 0.6rem 1.4rem;
  border-radius: 4px;
  background: var(--theme-foreground-focus);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  margin: 0.25rem;
}
.btn-secondary {
  background: var(--theme-foreground-muted);
}
.btn-google {
  background: #fff;
  color: #3c4043;
  border: 1px solid #dadce0;
  box-shadow: 0 1px 3px rgba(0,0,0,.1);
}
.btn-google:hover {
  background: #f8f9fa;
}
</style>
