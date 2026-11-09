(function () {
  var root = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  root.setAttribute("lang", get("lang") || "tr");
  root.setAttribute("data-theme", get("theme") || "dark");

  document.addEventListener("DOMContentLoaded", function () {
    var tb = document.getElementById("theme-btn");
    var lb = document.getElementById("lang-btn");
    function labels() {
      if (tb) tb.textContent = root.getAttribute("data-theme") === "dark" ? "☀" : "☾";
      if (lb) lb.textContent = root.getAttribute("lang") === "tr" ? "EN" : "TR";
    }
    labels();
    if (tb) tb.addEventListener("click", function () {
      var t = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", t); set("theme", t); labels();
    });
    if (lb) lb.addEventListener("click", function () {
      var l = root.getAttribute("lang") === "tr" ? "en" : "tr";
      root.setAttribute("lang", l); set("lang", l); labels();
    });

    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    var links = document.querySelectorAll("nav a");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id);
            });
          }
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      document.querySelectorAll("section[id]").forEach(function (s) { io.observe(s); });
    }
  });
})();
