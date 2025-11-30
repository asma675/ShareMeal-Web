// Simple SPA-style navigation and in-browser storage for the ShareMeal web demo

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((section) => {
    section.classList.toggle("active", section.id === id);
  });
}

// Navigation buttons
document.addEventListener("click", (event) => {
  const navTarget = event.target.closest("[data-nav]");
  const roleSelect = event.target.closest("[data-role-select]");

  if (event.target.id === "btn-intro-start") {
    showScreen("screen-welcome");
  } else if (event.target.id === "btn-welcome-next") {
    showScreen("screen-choose-role");
  } else if (navTarget) {
    const target = navTarget.getAttribute("data-nav");
    if (target === "intro") showScreen("screen-intro");
    if (target === "welcome") showScreen("screen-welcome");
    if (target === "choose-role") showScreen("screen-choose-role");
  } else if (roleSelect) {
    const role = roleSelect.getAttribute("data-role-select");
    if (role === "donor") {
      showScreen("screen-donor");
    } else if (role === "foodbank") {
      showScreen("screen-foodbank");
    }
  }
});

// Handle donor form submission
const donorForm = document.getElementById("donor-form");
const donorSuccess = document.getElementById("donor-success");

if (donorForm) {
  donorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {
      organization: document.getElementById("donor-name").value.trim(),
      contact: document.getElementById("donor-contact").value.trim(),
      email: document.getElementById("donor-email").value.trim(),
      notes: document.getElementById("donor-notes").value.trim(),
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage for this demo
    const existing = JSON.parse(localStorage.getItem("sharemeal_donors") || "[]");
    existing.push(data);
    localStorage.setItem("sharemeal_donors", JSON.stringify(existing));

    donorForm.reset();
    donorSuccess.hidden = false;
  });
}

// Handle food bank form submission
const foodbankForm = document.getElementById("foodbank-form");
const foodbankSuccess = document.getElementById("foodbank-success");

if (foodbankForm) {
  foodbankForm.addEventListener("submit", (event) => {
    event.preventDefault();

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

    foodbankForm.reset();
    foodbankSuccess.hidden = false;
  });
}

// Initial screen
showScreen("screen-intro");
