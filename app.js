// ---------- Helpers ----------
function createId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return Date.now() + "-" + Math.random().toString(16).slice(2);
}

// Switch visible section + nav active
function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === id);
  });
  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === id);
  });
}

// Nav + jump buttons
document.addEventListener("click", (e) => {
  const nav = e.target.closest(".nav-link");
  const jump = e.target.closest("[data-section-jump]");
  if (nav) showSection(nav.dataset.section);
  if (jump) showSection(jump.dataset.sectionJump);
});

// =============== DONORS ===============
let editingDonorId = null;

function getDonors() {
  const donors = JSON.parse(localStorage.getItem("sharemeal_donors") || "[]");
  let changed = false;
  donors.forEach((d) => {
    if (!d.id) {
      d.id = createId();
      changed = true;
    }
  });
  if (changed) localStorage.setItem("sharemeal_donors", JSON.stringify(donors));
  return donors;
}

function saveDonors(list) {
  localStorage.setItem("sharemeal_donors", JSON.stringify(list));
}

function loadDonors() {
  const container = document.getElementById("donors-list");
  if (!container) return;

  const donors = getDonors();
  if (!donors.length) {
    container.classList.add("empty-state");
    container.innerHTML = "<p>No entries yet.</p>";
    return;
  }

  container.classList.remove("empty-state");
  container.innerHTML = donors
    .slice()
    .reverse()
    .map(
      (d) => `
      <div class="directory-item">
        <strong>${d.organization || "Unnamed donor"}</strong><br/>
        Contact: ${d.contact || "N/A"}<br/>
        Email: ${d.email || "N/A"}<br/>
        <small>${d.notes || ""}</small>
        <div class="item-actions">
          <button class="btn-small" data-edit-donor="${d.id}">Edit</button>
          <button class="btn-small danger" data-delete-donor="${d.id}">Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

const donorForm = document.getElementById("donor-form");
const donorSubmitBtn = document.getElementById("donor-submit-btn");
if (donorForm) {
  donorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const donors = getDonors();
    const data = {
      organization: document.getElementById("donor-name").value.trim(),
      contact: document.getElementById("donor-contact").value.trim(),
      email: document.getElementById("donor-email").value.trim(),
      notes: document.getElementById("donor-notes").value.trim(),
    };

    if (editingDonorId) {
      const idx = donors.findIndex((d) => d.id === editingDonorId);
      if (idx !== -1) donors[idx] = { ...donors[idx], ...data };
      editingDonorId = null;
      if (donorSubmitBtn) donorSubmitBtn.textContent = "Submit Donor Details";
    } else {
      donors.push({ id: createId(), ...data });
    }

    saveDonors(donors);
    donorForm.reset();
    document.getElementById("donor-success").hidden = false;
    loadDonors();
  });

  // Edit/Delete from directory list
  document.getElementById("donors-list")?.addEventListener("click", (e) => {
    const del = e.target.closest("[data-delete-donor]");
    const edit = e.target.closest("[data-edit-donor]");
    let donors = getDonors();

    if (del) {
      const id = del.dataset.deleteDonor;
      donors = donors.filter((d) => d.id !== id);
      saveDonors(donors);
      loadDonors();
      if (editingDonorId === id) {
        editingDonorId = null;
        donorForm.reset();
        donorSubmitBtn.textContent = "Submit Donor Details";
      }
    }

    if (edit) {
      const id = edit.dataset.editDonor;
      const d = donors.find((x) => x.id === id);
      if (!d) return;
      editingDonorId = id;
      document.getElementById("donor-name").value = d.organization || "";
      document.getElementById("donor-contact").value = d.contact || "";
      document.getElementById("donor-email").value = d.email || "";
      document.getElementById("donor-notes").value = d.notes || "";
      donorSubmitBtn.textContent = "Save Donor Changes";
      showSection("section-donor");
    }
  });
}

// =============== FOOD BANKS ===============
let editingFoodbankId = null;

function getFoodbanks() {
  const fbs = JSON.parse(localStorage.getItem("sharemeal_foodbanks") || "[]");
  let changed = false;
  fbs.forEach((f) => {
    if (!f.id) {
      f.id = createId();
      changed = true;
    }
  });
  if (changed) localStorage.setItem("sharemeal_foodbanks", JSON.stringify(fbs));
  return fbs;
}

function saveFoodbanks(list) {
  localStorage.setItem("sharemeal_foodbanks", JSON.stringify(list));
}

function loadFoodbanks() {
  const container = document.getElementById("foodbanks-list");
  if (!container) return;

  const fbs = getFoodbanks();
  if (!fbs.length) {
    container.classList.add("empty-state");
    container.innerHTML = "<p>No entries yet.</p>";
    return;
  }

  container.classList.remove("empty-state");
  container.innerHTML = fbs
    .slice()
    .reverse()
    .map(
      (f) => `
      <div class="directory-item">
        <strong>${f.name || "Unnamed food bank"}</strong><br/>
        Contact: ${f.contact || "N/A"}<br/>
        Email: ${f.email || "N/A"}<br/>
        <small>${f.address || ""}</small><br/>
        <small>${f.hours || ""}</small>
        <div class="item-actions">
          <button class="btn-small" data-edit-fb="${f.id}">Edit</button>
          <button class="btn-small danger" data-delete-fb="${f.id}">Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

const fbForm = document.getElementById("foodbank-form");
const fbSubmitBtn = document.getElementById("fb-submit-btn");
if (fbForm) {
  fbForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fbs = getFoodbanks();
    const data = {
      name: document.getElementById("fb-name").value.trim(),
      contact: document.getElementById("fb-contact").value.trim(),
      email: document.getElementById("fb-email").value.trim(),
      phone: document.getElementById("fb-phone").value.trim(),
      address: document.getElementById("fb-address").value.trim(),
      hours: document.getElementById("fb-hours").value.trim(),
    };

    if (editingFoodbankId) {
      const idx = fbs.findIndex((f) => f.id === editingFoodbankId);
      if (idx !== -1) fbs[idx] = { ...fbs[idx], ...data };
      editingFoodbankId = null;
      if (fbSubmitBtn) fbSubmitBtn.textContent = "Submit Registration";
    } else {
      fbs.push({ id: createId(), ...data });
    }

    saveFoodbanks(fbs);
    fbForm.reset();
    document.getElementById("foodbank-success").hidden = false;
    loadFoodbanks();
  });

  document.getElementById("foodbanks-list")?.addEventListener("click", (e) => {
    const del = e.target.closest("[data-delete-fb]");
    const edit = e.target.closest("[data-edit-fb]");
    let fbs = getFoodbanks();

    if (del) {
      const id = del.dataset.deleteFb;
      fbs = fbs.filter((f) => f.id !== id);
      saveFoodbanks(fbs);
      loadFoodbanks();
      if (editingFoodbankId === id) {
        editingFoodbankId = null;
        fbForm.reset();
        fbSubmitBtn.textContent = "Submit Registration";
      }
    }

    if (edit) {
      const id = edit.dataset.editFb;
      const f = fbs.find((x) => x.id === id);
      if (!f) return;
      editingFoodbankId = id;
      document.getElementById("fb-name").value = f.name || "";
      document.getElementById("fb-contact").value = f.contact || "";
      document.getElementById("fb-email").value = f.email || "";
      document.getElementById("fb-phone").value = f.phone || "";
      document.getElementById("fb-address").value = f.address || "";
      document.getElementById("fb-hours").value = f.hours || "";
      fbSubmitBtn.textContent = "Save Food Bank Changes";
      showSection("section-foodbank");
    }
  });
}

// =============== DISCUSSION BOARD ===============
let editingPostId = null;

function getPosts() {
  const posts = JSON.parse(localStorage.getItem("sharemeal_posts") || "[]");
  let changed = false;
  posts.forEach((p) => {
    if (!p.id) {
      p.id = createId();
      changed = true;
    }
  });
  if (changed) localStorage.setItem("sharemeal_posts", JSON.stringify(posts));
  return posts;
}

function savePosts(list) {
  localStorage.setItem("sharemeal_posts", JSON.stringify(list));
}

function loadPosts() {
  const list = document.getElementById("posts-list");
  if (!list) return;

  const posts = getPosts();
  if (!posts.length) {
    list.classList.add("empty-state");
    list.innerHTML = "<p>No posts yet.</p>";
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
          <span>${p.name || "Anonymous"}</span>
          <span>${p.role || ""} • ${new Date(p.createdAt).toLocaleString()}</span>
        </div>
        <p>${p.message}</p>
        <div class="post-actions">
          <button class="btn-small" data-edit-post="${p.id}">Edit</button>
          <button class="btn-small danger" data-delete-post="${p.id}">Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

const postForm = document.getElementById("post-form");
const postSubmitBtn = document.getElementById("post-submit-btn");

if (postForm) {
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("post-name").value.trim();
    const role = document.getElementById("post-role").value;
    const message = document.getElementById("post-message").value.trim();
    let posts = getPosts();

    if (editingPostId) {
      posts = posts.map((p) =>
        p.id === editingPostId ? { ...p, name, role, message } : p
      );
      editingPostId = null;
      if (postSubmitBtn) postSubmitBtn.textContent = "Post to Board";
    } else {
      posts.push({
        id: createId(),
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

  document.getElementById("posts-list")?.addEventListener("click", (e) => {
    const del = e.target.closest("[data-delete-post]");
    const edit = e.target.closest("[data-edit-post]");
    let posts = getPosts();

    if (del) {
      const id = del.dataset.deletePost;
      posts = posts.filter((p) => p.id !== id);
      savePosts(posts);
      loadPosts();
      if (editingPostId === id) {
        editingPostId = null;
        postForm.reset();
        if (postSubmitBtn) postSubmitBtn.textContent = "Post to Board";
      }
    }

    if (edit) {
      const id = edit.dataset.editPost;
      const p = posts.find((x) => x.id === id);
      if (!p) return;
      editingPostId = id;
      document.getElementById("post-name").value = p.name || "";
      document.getElementById("post-role").value = p.role || "Food Donor";
      document.getElementById("post-message").value = p.message || "";
      if (postSubmitBtn) postSubmitBtn.textContent = "Save Changes";
      showSection("section-board");
    }
  });
}

// INITIAL LOAD
showSection("section-home");
loadDonors();
loadFoodbanks();
loadPosts();
