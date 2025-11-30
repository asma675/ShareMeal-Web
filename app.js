// Switch sections
function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) =>
    sec.classList.toggle("active", sec.id === id)
  );
  document.querySelectorAll(".nav-link").forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.section === id)
  );
}

// Header click handlers
document.addEventListener("click", (e) => {
  const nav = e.target.closest(".nav-link");
  const jump = e.target.closest("[data-section-jump]");

  if (nav) showSection(nav.dataset.section);
  if (jump) showSection(jump.dataset.sectionJump);
});

/* ---------------------------
   DONOR FORM LOGIC
---------------------------- */
function loadDonors() {
  const list = document.getElementById("donors-list");
  const donors = JSON.parse(localStorage.getItem("sharemeal_donors") || "[]");

  if (!donors.length) {
    list.innerHTML = "<p>No entries yet.</p>";
    list.classList.add("empty-state");
    return;
  }

  list.classList.remove("empty-state");
  list.innerHTML = donors
    .map(
      (d) => `
      <div class="directory-item">
        <strong>${d.organization}</strong><br>
        Contact: ${d.contact}<br>
        Email: ${d.email}<br>
        <small>${d.notes || ""}</small>
      </div>
    `
    )
    .join("");
}

document.getElementById("donor-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const donors = JSON.parse(localStorage.getItem("sharemeal_donors") || "[]");

  donors.push({
    organization: document.getElementById("donor-name").value,
    contact: document.getElementById("donor-contact").value,
    email: document.getElementById("donor-email").value,
    notes: document.getElementById("donor-notes").value,
  });

  localStorage.setItem("sharemeal_donors", JSON.stringify(donors));

  document.getElementById("donor-success").hidden = false;
  e.target.reset();
  loadDonors();
});

/* ---------------------------
   FOOD BANK FORM LOGIC
---------------------------- */
function loadFoodbanks() {
  const list = document.getElementById("foodbanks-list");
  const banks = JSON.parse(localStorage.getItem("sharemeal_foodbanks") || "[]");

  if (!banks.length) {
    list.innerHTML = "<p>No entries yet.</p>";
    list.classList.add("empty-state");
    return;
  }

  list.classList.remove("empty-state");
  list.innerHTML = banks
    .map(
      (b) => `
      <div class="directory-item">
        <strong>${b.name}</strong><br>
        Contact: ${b.contact}<br>
        Email: ${b.email}<br>
        <small>${b.address || ""}</small>
      </div>
    `
    )
    .join("");
}

document.getElementById("foodbank-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const banks = JSON.parse(
    localStorage.getItem("sharemeal_foodbanks") || "[]"
  );

  banks.push({
    name: document.getElementById("fb-name").value,
    contact: document.getElementById("fb-contact").value,
    email: document.getElementById("fb-email").value,
    phone: document.getElementById("fb-phone").value,
    address: document.getElementById("fb-address").value,
    hours: document.getElementById("fb-hours").value,
  });

  localStorage.setItem("sharemeal_foodbanks", JSON.stringify(banks));

  document.getElementById("foodbank-success").hidden = false;
  e.target.reset();
  loadFoodbanks();
});

/* ---------------------------
   DISCUSSION BOARD
   (Add, Edit, Delete)
---------------------------- */

let editingId = null;

function getPosts() {
  return JSON.parse(localStorage.getItem("sharemeal_posts") || "[]");
}
function savePosts(posts) {
  localStorage.setItem("sharemeal_posts", JSON.stringify(posts));
}

function loadPosts() {
  const list = document.getElementById("posts-list");
  const posts = getPosts();

  if (!posts.length) {
    list.innerHTML = "<p>No posts yet.</p>";
    list.classList.add("empty-state");
    return;
  }

  list.classList.remove("empty-state");
  list.innerHTML = posts
    .slice()
    .reverse()
    .map(
      (p) => `
      <div class="post-item">
        <div class="post-header">
          <span>${p.name}</span>
          <span>${p.role} • ${new Date(p.createdAt).toLocaleString()}</span>
        </div>
        <p>${p.message}</p>

        <div class="post-actions">
          <button class="btn-small" data-edit="${p.id}">Edit</button>
          <button class="btn-small danger" data-delete="${p.id}">Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

// Add/Edit post
document.getElementById("post-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("post-name").value;
  const role = document.getElementById("post-role").value;
  const message = document.getElementById("post-message").value;

  let posts = getPosts();

  if (editingId) {
    posts = posts.map((p) =>
      p.id === editingId ? { ...p, name, role, message } : p
    );
    editingId = null;
  } else {
    posts.push({
      id: crypto.randomUUID(),
      name,
      role,
      message,
      createdAt: new Date().toISOString(),
    });
  }

  savePosts(posts);
  loadPosts();
  e.target.reset();
});

// Delete/Edit click handling
document.getElementById("posts-list")?.addEventListener("click", (e) => {
  const del = e.target.closest("[data-delete]");
  const edit = e.target.closest("[data-edit]");
  let posts = getPosts();

  if (del) {
    const id = del.dataset.delete;
    posts = posts.filter((p) => p.id !== id);
    savePosts(posts);
    loadPosts();
  }

  if (edit) {
    const id = edit.dataset.edit;
    const post = posts.find((p) => p.id === id);
    if (post) {
      editingId = id;
      document.getElementById("post-name").value = post.name;
      document.getElementById("post-role").value = post.role;
      document.getElementById("post-message").value = post.message;
      showSection("section-board");
    }
  }
});

/* ---------------------------
   INITIAL LOAD
---------------------------- */

showSection("section-home");
loadDonors();
loadFoodbanks();
loadPosts();
