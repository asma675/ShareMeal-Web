// Show a specific section and update nav active state
function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === id);
  });

  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-section") === id);
  });
}

// Header nav clicks & jump buttons
document.addEventListener("click", (event) => {
  const navBtn = event.target.closest(".nav-link");
  const jumpBtn = event.target.closest("[data-section-jump]");

  if (navBtn) {
    const target = navBtn.getAttribute("data-section");
    showSection(target);
  }

  if (jumpBtn) {
    const target = jumpBtn.getAttribute("data-section-jump");
    showSection(target);
  }
});

// ----- Donor form handling -----
const donorForm = document.getElementById("donor-form");
const donorSuccess = document.getElementById("donor-success");

function loadDonors() {
  const container = document.getElementById("donors-list");
  const donors = JSON.parse(localStorage.getItem("sharemeal_donors") || "[]");

  if (!container) return;

  if (!donors.length) {
    container.classList.add("empty-state");
    container.innerHTML = "<p>No donors registered yet.</p>";
    return;
  }

  container.classList.remove("empty-state");
  container.innerHTML = "";
  donors
    .slice()
    .reverse()
    .forEach((d) => {
      const div = document.createElement("div");
      div.className = "directory-item";
      div.innerHTML = `
        <strong>${d.organization || "Unnamed organization"}</strong><br/>
        Contact: ${d.contact || "N/A"}<br/>
        Email: ${d.email || "N/A"}<br/>
        <small>${d.notes || ""}</small>
      `;
      container.appendChild(div);
    });
}

if (donorForm) {
  donorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      organization: document.getElementById("donor-name").value.trim(),
      contact: document.getElementById("donor-contact").value.trim(),
      email: document.getElementById("donor-email").value.trim(),
      notes: document.getElementById("donor-notes").value.trim(),
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("sharemeal_donors") || "[]");
    existing.push(data);
    localStorage.setItem("sharemeal_donors", JSON.stringify(existing));

    donorForm.reset();
    donorSuccess.hidden = false;
    loadDonors();
  });
}

// ----- Food bank form handling -----
const fbForm = document.getElementById("foodbank-form");
const fbSuccess = document.getElementById("foodbank-success");

function loadFoodbanks() {
  const container = document.getElementById("foodbanks-list");
  const fbs = JSON.parse(localStorage.getItem("sharemeal_foodbanks") || "[]");

  if (!container) return;

  if (!fbs.length) {
    container.classList.add("empty-state");
    container.innerHTML = "<p>No food banks registered yet.</p>";
    return;
  }

  container.classList.remove("empty-state");
  container.innerHTML = "";
  fbs
    .slice()
    .reverse()
    .forEach((f) => {
      const div = document.createElement("div");
      div.className = "directory-item";
      div.innerHTML = `
        <strong>${f.name || "Unnamed food bank"}</strong><br/>
        Contact: ${f.contact || "N/A"}<br/>
        Email: ${f.email || "N/A"}<br/>
        <small>${f.address || ""}</small><br/>
        <small>${f.hours || ""}</small>
      `;
      container.appendChild(div);
    });
}

if (fbForm) {
  fbForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("fb-name").value.trim(),
      contact: document.getElementById("fb-contact").value.trim(),
      email: document.getElementById("fb-email").value.trim(),
      phone: document.getElementById("fb-phone").value.trim(),
      address: document.getElementById("fb-address").value.trim(),
      hours: document.getElementById("fb-hours").value.trim(),
      notes: document.getElementById("fb-notes").value.trim(),
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("sharemeal_foodbanks") || "[]");
    existing.push(data);
    localStorage.setItem("sharemeal_foodbanks", JSON.stringify(existing));

    fbForm.reset();
    fbSuccess.hidden = false;
    loadFoodbanks();
  });
}

// ----- Discussion board handling -----
const postForm = document.getElementById("post-form");
const postsList = document.getElementById("posts-list");

function loadPosts() {
  if (!postsList) return;

  const posts = JSON.parse(localStorage.getItem("sharemeal_posts") || "[]");

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
      `;
      postsList.appendChild(div);
    });
}

if (postForm) {
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("post-name").value.trim(),
      role: document.getElementById("post-role").value,
      message: document.getElementById("post-message").value.trim(),
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("sharemeal_posts") || "[]");
    existing.push(data);
    localStorage.setItem("sharemeal_posts", JSON.stringify(existing));

    postForm.reset();
    loadPosts();
  });
}

// Initial load
showSection("section-home");
loadDonors();
loadFoodbanks();
loadPosts();
