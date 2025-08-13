// ===== Grab refs
const app = document.getElementById("app");
const masthead = document.getElementById("masthead");
const navLinks = document.querySelectorAll(".nav-link");
const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// ===== Small helpers
const setActive = (href) => {
  navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === href));
};

const setHeroFor = (partial) => {
  
  if (partial === "home.html") {
    masthead.style.backgroundImage = 'linear-gradient(to bottom, rgba(2,6,23,.25), rgba(2,6,23,.45)), url("./img/money-hero.jpg")';
    masthead.setAttribute("aria-label", "Hero image for Home");
  } else if (partial === "portfolio.html") {
    masthead.style.backgroundImage = 'linear-gradient(to bottom, rgba(2,6,23,.25), rgba(2,6,23,.45)), url("./img/portfolio-hero.jpg")';
    masthead.setAttribute("aria-label", "Hero image for Portfolio");
  }
};

// ===== Core loader (fetches partial and injects it)
const loadContent = (urlFeed) => {
  /*
    loadContent runs every time a link is clicked.
    urlFeed is the href of the clicked link (e.g., "./partials/home.html").
  */
  fetch(urlFeed, { cache: "no-cache" })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${urlFeed}`);
      return res.text();
    })
    .then(html => {
      app.innerHTML = html;
      app.focus({ preventScroll: true });

      // Update active state
      setActive(urlFeed);

      // Update hero based on the partial file name
      const file = urlFeed.split("/").pop(); // "home.html" or "portfolio.html"
      setHeroFor(file);

      // Lightweight routing via hash
      history.pushState({ url: urlFeed }, "", `#${file}`);
    })
    .catch(err => {
      console.error(err);
      app.innerHTML = `<p role="alert">Sorry, there was a problem loading this section.</p>`;
    });
};

// ===== Click handler
const selectContent = (e) => {
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href"); // "./partials/home.html"
  loadContent(href);
};

// ===== Wire up nav
navLinks.forEach(a => a.addEventListener("click", selectContent));

// ===== Support back/forward buttons
window.addEventListener("popstate", (evt) => {
  const url = evt.state?.url || "./partials/home.html";
  loadContent(url);
});

// ===== Initial route (default to Home)
const initial = window.location.hash
  ? `./partials/${window.location.hash.replace("#", "")}` // e.g., #portfolio.html
  : "./partials/home.html";

loadContent(initial);

// ===== Optional: clicking the logo takes you Home
const logo = document.querySelector(".logo");
if (logo) {
  logo.addEventListener("click", (e) => {
    e.preventDefault();
    loadContent("./partials/home.html");
  });
}
