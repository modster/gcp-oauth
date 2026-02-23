---
title: Profile
---

# Profile

```js
const user = await fetch("/auth/user").then((r) => r.json()).catch(() => null);
```

```js
if (!user?.email) {
  display(html`
    <div class="profile-card">
      <p>You are not signed in. <a href="/auth/login">Sign in with Google</a> to view your profile.</p>
    </div>
  `);
} else {
  display(html`
    <div class="profile-card">
      <img src="${user.picture}" alt="Profile picture" width="80" height="80" style="border-radius:50%;display:block;margin:0 auto 1.5rem">
      <table class="profile-table">
        <tr><th>Name</th><td>${user.name}</td></tr>
        <tr><th>Email</th><td>${user.email}</td></tr>
        <tr><th>Email verified</th><td>${user.email_verified ? "✅ Yes" : "❌ No"}</td></tr>
        <tr><th>Google ID</th><td><code>${user.sub}</code></td></tr>
        ${user.hd ? html`<tr><th>Domain</th><td>${user.hd}</td></tr>` : ""}
      </table>
      <div style="margin-top:1.5rem;text-align:center">
        <a href="/" class="btn">Back to Home</a>
        <a href="/auth/logout" class="btn btn-secondary">Sign Out</a>
      </div>
    </div>
  `);
}
```

<style>
.profile-card {
  max-width: 480px;
  margin: 3rem auto;
  padding: 2rem;
  border: 1px solid var(--theme-foreground-faintest);
  border-radius: 8px;
}
.profile-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.profile-table th,
.profile-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--theme-foreground-faintest);
  text-align: left;
}
.profile-table th {
  color: var(--theme-foreground-muted);
  font-weight: 600;
  width: 40%;
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
</style>
