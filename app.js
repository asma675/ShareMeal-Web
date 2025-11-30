import React, { useState, useEffect } from "react";
import Directory from "./Directory";
// ...other imports

const ACTIVE_PAGE_KEY = "sharemeal_active_page";

export default function App() {
  const [activePage, setActivePage] = useState("home");

  // Load last page from localStorage
  useEffect(() => {
    const saved = window.localStorage.getItem(ACTIVE_PAGE_KEY);
    if (saved) setActivePage(saved);
  }, []);

  // Save whenever page changes
  const handleNavClick = (page) => {
    setActivePage(page);
    window.localStorage.setItem(ACTIVE_PAGE_KEY, page);
  };

  return (
    <div className="app-root">
      <header className="top-nav">
        <div className="logo">ShareMeal</div>
        <nav>
          <button
            className={activePage === "home" ? "nav-btn active" : "nav-btn"}
            onClick={() => handleNavClick("home")}
          >
            Home
          </button>
          <button
            className={activePage === "setup" ? "nav-btn active" : "nav-btn"}
            onClick={() => handleNavClick("setup")}
          >
            Get Set Up
          </button>
          <button
            className={activePage === "donor" ? "nav-btn active" : "nav-btn"}
            onClick={() => handleNavClick("donor")}
          >
            Food Donor
          </button>
          <button
            className={activePage === "foodbank" ? "nav-btn active" : "nav-btn"}
            onClick={() => handleNavClick("foodbank")}
          >
            Food Bank
          </button>
          <button
            className={activePage === "directory" ? "nav-btn active" : "nav-btn"}
            onClick={() => handleNavClick("directory")}
          >
            Directory
          </button>
          <button
            className={activePage === "board" ? "nav-btn active" : "nav-btn"}
            onClick={() => handleNavClick("board")}
          >
            Discussion Board
          </button>
        </nav>
      </header>

      <main>
        {activePage === "home" && <Home />}
        {activePage === "setup" && <GetSetUp />}
        {activePage === "donor" && <FoodDonor />}
        {activePage === "foodbank" && <FoodBank />}
        {activePage === "directory" && (
          <Directory />
        )}
        {activePage === "board" && <DiscussionBoard />}
      </main>
    </div>
  );
}
