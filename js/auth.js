/**
 * Authentication system using localStorage.
 * Gates access to all tools - requires login to use any feature.
 */
const Auth = {
  STORAGE_KEY: "datespdf_users",
  SESSION_KEY: "datespdf_session",

  getUsers() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUsers(users) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  },

  getSession() {
    const data = localStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  isLoggedIn() {
    return this.getSession() !== null;
  },

  getCurrentUser() {
    return this.getSession();
  },

  signup(name, email, password) {
    if (!name || !email || !password) {
      return { success: false, message: "All fields are required." };
    }
    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters." };
    }

    const users = this.getUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: "An account with this email already exists." };
    }

    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    this.saveUsers(users);

    const session = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

    return { success: true, user: session };
  },

  login(email, password) {
    if (!email || !password) {
      return { success: false, message: "Email and password are required." };
    }

    const users = this.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, message: "Invalid email or password." };
    }

    const session = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

    return { success: true, user: session };
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  requireAuth(redirectTo) {
    if (!this.isLoggedIn()) {
      const currentPage = window.location.pathname;
      sessionStorage.setItem("datespdf_redirect", currentPage);
      window.location.href = redirectTo || "/login.html";
      return false;
    }
    return true;
  },

  getRedirectUrl() {
    const url = sessionStorage.getItem("datespdf_redirect");
    sessionStorage.removeItem("datespdf_redirect");
    return url || "/index.html";
  },

  updateNavbar() {
    const authNav = document.getElementById("authNav");
    if (!authNav) return;

    if (this.isLoggedIn()) {
      const user = this.getCurrentUser();
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      authNav.innerHTML = `
        <div class="auth-nav">
          <div class="auth-nav__user">
            <span class="auth-nav__avatar">${initials}</span>
            <span class="auth-nav__name">${this.escapeHtml(user.name)}</span>
          </div>
          <button class="auth-nav__logout" id="logoutBtn">Log Out</button>
        </div>
      `;

      document.getElementById("logoutBtn").addEventListener("click", () => {
        this.logout();
        window.location.href = "/login.html";
      });
    } else {
      authNav.innerHTML = `
        <div class="auth-nav">
          <a href="/login.html" class="auth-nav__link">Log In</a>
          <a href="/signup.html" class="auth-nav__btn">Sign Up</a>
        </div>
      `;
    }
  },

  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },
};
