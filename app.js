// Show a specific section and update nav active state
function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === id);
  });

  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-section") === id);
  });
}

// Header nav clicks
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

// Donor form handling
const donorForm = document.getElementById("donor-form");
const donorSuccess = document.getElementById("donor-success");

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
  });
}

// Food bank form handling
const fbForm = document.getElementById("foodbank-form");
const fbSuccess = document.getElementById("foodbank-success");

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
  });
}

// Start on Home
showSection("section-home");
