// ----- Discussion board handling -----
const postForm = document.getElementById("post-form");
const postsList = document.getElementById("posts-list");
const submitBtn = postForm ? postForm.querySelector("button[type='submit']") : null;

// keep track of which post (if any) is being edited
let editingPostId = null;

function getPosts() {
  return JSON.parse(localStorage.getItem("sharemeal_posts") || "[]");
}

function savePosts(posts) {
  localStorage.setItem("sharemeal_posts", JSON.stringify(posts));
}

function loadPosts() {
  if (!postsList) return;

  const posts = getPosts();

  if (!posts.length) {
    postsList.classList.add("empty-state");
    postsList.innerHTML = "<p>No posts yet. Be the first to share an update!</p>";
    return;
  }

  postsList.classList.remove("empty-state");
  postsList.innerHTML = "";
  posts
    .slice()
    .reverse()
    .forEach((p) => {
      const div = document.createElement("div");
      div.className = "post-item";
      const date = new Date(p.createdAt);
      div.innerHTML = `
        <div class="post-header">
          <span>${p.name || "Anonymous"}</span>
          <span><span class="post-role">${p.role}</span> • ${date.toLocaleString()}</span>
        </div>
        <p class="post-message">${p.message}</p>
        <div class="post-actions">
          <button class="btn-small" data-edit-post="${p.id}">Edit</button>
          <button class="btn-small danger" data-delete-post="${p.id}">Delete</button>
        </div>
      `;
      postsList.appendChild(div);
    });
}

if (postForm) {
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("post-name").value.trim();
    const role = document.getElementById("post-role").value;
    const message = document.getElementById("post-message").value.trim();

    if (!message) return;

    const posts = getPosts();

    if (editingPostId) {
      // update existing
      const idx = posts.findIndex((p) => p.id === editingPostId);
      if (idx !== -1) {
        posts[idx] = {
          ...posts[idx],
          name,
          role,
          message,
        };
      }
      editingPostId = null;
      if (submitBtn) submitBtn.textContent = "Post to Board";
    } else {
      // create new
      const id =
        (crypto && crypto.randomUUID && crypto.randomUUID()) ||
        `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      posts.push({
        id,
        name,
        role,
        message,
        createdAt: new Date().toISOString(),
      });
    }

    savePosts(posts);
    postForm.reset();
    loadPosts();
  });
}

// click handlers for Edit/Delete buttons on posts
if (postsList) {
  postsList.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest("[data-delete-post]");
    const editBtn = e.target.closest("[data-edit-post]");
    const posts = getPosts();

    if (deleteBtn) {
      const id = deleteBtn.getAttribute("data-delete-post");
      const filtered = posts.filter((p) => p.id !== id);
      savePosts(filtered);
      loadPosts();
      // if we were editing this one, reset form
      if (editingPostId === id) {
        editingPostId = null;
        postForm.reset();
        if (submitBtn) submitBtn.textContent = "Post to Board";
      }
    } else if (editBtn) {
      const id = editBtn.getAttribute("data-edit-post");
      const post = posts.find((p) => p.id === id);
      if (!post) return;

      editingPostId = id;
      document.getElementById("post-name").value = post.name || "";
      document.getElementById("post-role").value = post.role || "Food Donor";
      document.getElementById("post-message").value = post.message || "";
      if (submitBtn) submitBtn.textContent = "Save Changes";

      // jump to the board section if you’re on another tab
      showSection("section-board");
    }
  });
}
