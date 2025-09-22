document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const authContainer = document.getElementById("authContainer");
  const dashboard = document.getElementById("dashboard");
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const userName = document.getElementById("userName");
  const menuItems = document.querySelectorAll(".menu-item");
  const contentSections = document.querySelectorAll(".content-section");
  const createNewBtn = document.getElementById("createNewBtn");
  const postTitle = document.getElementById("postTitle");
  const postExcerpt = document.getElementById("postExcerpt");
  const postContent = document.getElementById("postContent");
  const postImage = document.getElementById("postImage");
  const saveBtn = document.getElementById("saveBtn");
  const publishBtn = document.getElementById("publishBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const blogListDashboard = document.getElementById("recentPosts");
  const blogListAll = document.getElementById("allPosts");
  const searchInput = document.getElementById("searchInput");

  let authToken = localStorage.getItem("authToken");
  let currentUser = null;
  let editingPostId = null;

  // API base URL
  const API_BASE = "/api";

  // Helper: Set auth token
  function setAuthToken(token) {
    authToken = token;
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }

  // Helper: Fetch wrapper with auth
  async function apiFetch(url, options = {}) {
    options.headers = options.headers || {};
    if (authToken) {
      options.headers["Authorization"] = "Bearer " + authToken;
    }
    const res = await fetch(API_BASE + url, options);
    if (res.status === 401) {
      logout();
      throw new Error("Unauthorized");
    }
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "API error");
    }
    return res.json();
  }

  // Show alert
  function showAlert(message) {
    alert(message);
  }

  // Show dashboard and load posts
  async function showDashboard() {
    authContainer.classList.add("hidden");
    dashboard.classList.remove("hidden");
    userName.textContent = currentUser.name;
    await loadPosts();
  }

  // Load posts for dashboard and all blogs
  async function loadPosts() {
    try {
      const posts = await apiFetch("/posts");
      renderPosts(posts);
    } catch (err) {
      showAlert("Failed to load posts: " + err.message);
    }
  }

  // Render posts in dashboard and all blogs sections
  function renderPosts(posts) {
    blogListDashboard.innerHTML = "";
    blogListAll.innerHTML = "";
    posts.forEach((post) => {
      const card = createPostCard(post);
      blogListAll.appendChild(card.cloneNode(true));
      if (post.author._id === currentUser.id) {
        blogListDashboard.appendChild(card);
      }
    });
  }

  // Create a blog post card element
  function createPostCard(post) {
    const card = document.createElement("div");
    card.className = "blog-card";

    const imageDiv = document.createElement("div");
    imageDiv.className = "blog-image";
    if (post.image) {
      imageDiv.innerHTML = `<img src="${post.image}" alt="Post image" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
      imageDiv.innerHTML = '<i class="fas fa-blog"></i>';
    }
    card.appendChild(imageDiv);

    const contentDiv = document.createElement("div");
    contentDiv.className = "blog-content";

    const title = document.createElement("h3");
    title.className = "blog-title";
    title.textContent = post.title;
    contentDiv.appendChild(title);

    const excerpt = document.createElement("p");
    excerpt.className = "blog-excerpt";
    excerpt.textContent = post.excerpt || "";
    contentDiv.appendChild(excerpt);

    const meta = document.createElement("div");
    meta.className = "blog-meta";
    const dateSpan = document.createElement("span");
    dateSpan.textContent = new Date(post.createdAt).toLocaleDateString();
    const statusSpan = document.createElement("span");
    statusSpan.textContent =
      post.status.charAt(0).toUpperCase() + post.status.slice(1);
    meta.appendChild(dateSpan);
    meta.appendChild(statusSpan);
    contentDiv.appendChild(meta);

    // Add edit and delete buttons if author is current user
    if (post.author._id === currentUser.id) {
      const actions = document.createElement("div");
      actions.style.marginTop = "10px";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "btn btn-primary";
      editBtn.style.marginRight = "10px";
      editBtn.addEventListener("click", () => {
        openEditPost(post);
      });
      actions.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "btn btn-danger";
      deleteBtn.addEventListener("click", () => {
        deletePost(post._id);
      });
      actions.appendChild(deleteBtn);

      contentDiv.appendChild(actions);
    }

    card.appendChild(contentDiv);
    return card;
  }

  // Open post in editor for editing
  function openEditPost(post) {
    editingPostId = post._id;
    postTitle.value = post.title;
    postExcerpt.value = post.excerpt || "";
    postContent.value = post.content;
    // Switch to create section
    menuItems.forEach((i) => i.classList.remove("active"));
    document
      .querySelector('[data-section="create-section"]')
      .classList.add("active");
    contentSections.forEach((section) => section.classList.add("hidden"));
    document.getElementById("create-section").classList.remove("hidden");
  }

  // Delete post
  async function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await apiFetch("/posts/" + postId, { method: "DELETE" });
      showAlert("Post deleted");
      await loadPosts();
    } catch (err) {
      showAlert("Failed to delete post: " + err.message);
    }
  }

  // Clear editor fields
  function clearEditor() {
    editingPostId = null;
    postTitle.value = "";
    postExcerpt.value = "";
    postContent.value = "";
    postImage.value = "";
  }

  // Publish or save draft post
  async function savePost(status) {
    const title = postTitle.value.trim();
    const excerpt = postExcerpt.value.trim();
    const content = postContent.value.trim();
    if (!title) {
      showAlert("Title is required");
      return;
    }
    if (!content) {
      showAlert("Content is required");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("status", status);
    if (postImage.files[0]) {
      formData.append("image", postImage.files[0]);
    }
    try {
      const options = {
        method: editingPostId ? "PUT" : "POST",
        headers: {},
        body: formData,
      };
      if (authToken) {
        options.headers["Authorization"] = "Bearer " + authToken;
      }
      const res = await fetch(
        API_BASE + (editingPostId ? "/posts/" + editingPostId : "/posts"),
        options
      );
      if (res.status === 401) {
        logout();
        throw new Error("Unauthorized");
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "API error");
      }
      const data = await res.json();
      showAlert(editingPostId ? "Post updated" : "Post created");
      clearEditor();
      await loadPosts();
      // Switch to dashboard
      menuItems.forEach((i) => i.classList.remove("active"));
      document
        .querySelector('[data-section="dashboard-section"]')
        .classList.add("active");
      contentSections.forEach((section) => section.classList.add("hidden"));
      document.getElementById("dashboard-section").classList.remove("hidden");
    } catch (err) {
      showAlert("Failed to save post: " + err.message);
    }
  }

  // Cancel editing
  function cancelEdit() {
    clearEditor();
    // Switch to dashboard
    menuItems.forEach((i) => i.classList.remove("active"));
    document
      .querySelector('[data-section="dashboard-section"]')
      .classList.add("active");
    contentSections.forEach((section) => section.classList.add("hidden"));
    document.getElementById("dashboard-section").classList.remove("hidden");
  }

  // Search posts
  function searchPosts() {
    const query = searchInput.value.toLowerCase();
    const cards = document
      .getElementById("allPosts")
      .querySelectorAll(".blog-card");
    cards.forEach((card) => {
      const title = card.querySelector(".blog-title").textContent.toLowerCase();
      const excerpt = card
        .querySelector(".blog-excerpt")
        .textContent.toLowerCase();
      if (title.includes(query) || excerpt.includes(query)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Login form submission
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    try {
      const data = await fetch(API_BASE + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then((res) => res.json());
      if (data.token) {
        setAuthToken(data.token);
        currentUser = data.user;
        showDashboard();
      } else {
        showAlert(data.message || "Login failed");
      }
    } catch (err) {
      showAlert("Login error: " + err.message);
    }
  });

  // Register form submission
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById(
      "registerConfirmPassword"
    ).value;
    if (password !== confirmPassword) {
      showAlert("Passwords do not match!");
      return;
    }
    try {
      const data = await fetch(API_BASE + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      }).then((res) => res.json());
      if (data.token) {
        setAuthToken(data.token);
        currentUser = data.user;
        showDashboard();
      } else {
        showAlert(data.message || "Registration failed");
      }
    } catch (err) {
      showAlert("Registration error: " + err.message);
    }
  });

  // Logout
  logoutBtn.addEventListener("click", function () {
    logout();
  });

  function logout() {
    setAuthToken(null);
    currentUser = null;
    authContainer.classList.remove("hidden");
    dashboard.classList.add("hidden");
    loginForm.reset();
    registerForm.reset();
  }

  // Menu navigation
  menuItems.forEach((item) => {
    if (item.id !== "logoutBtn") {
      item.addEventListener("click", function () {
        menuItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
        const sectionId = item.getAttribute("data-section");
        contentSections.forEach((section) => section.classList.add("hidden"));
        document.getElementById(sectionId).classList.remove("hidden");
      });
    }
  });

  // Create new post button
  createNewBtn.addEventListener("click", function () {
    menuItems.forEach((i) => i.classList.remove("active"));
    document
      .querySelector('[data-section="create-section"]')
      .classList.add("active");
    contentSections.forEach((section) => section.classList.add("hidden"));
    document.getElementById("create-section").classList.remove("hidden");
    clearEditor();
  });

  // Editor buttons
  saveBtn.addEventListener("click", () => savePost("draft"));
  publishBtn.addEventListener("click", () => savePost("published"));
  cancelBtn.addEventListener("click", cancelEdit);

  // Search input
  searchInput.addEventListener("input", searchPosts);

  // On load, check if token exists
  if (authToken) {
    // Validate token by fetching user info or posts
    apiFetch("/posts")
      .then((posts) => {
        // Decode token to get user info (simplified)
        const decoded = JSON.parse(atob(authToken.split(".")[1]));
        currentUser = { id: decoded.userId, name: decoded.name };
        showDashboard();
      })
      .catch(() => {
        logout();
      });
  }
});
