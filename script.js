(function () {
  var root = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  root.setAttribute("lang", get("lang") === "en" ? "en" : "tr");
  root.setAttribute("data-theme", get("theme") === "light" ? "light" : "dark");

  document.addEventListener("DOMContentLoaded", function () {
    var tb = document.getElementById("theme-btn");
    var lb = document.getElementById("lang-btn");
    function labels() {
      var dark = root.getAttribute("data-theme") === "dark";
      var tr = root.getAttribute("lang") === "tr";
      if (tb) {
        tb.textContent = dark ? "Açık" : "Koyu";
        if (!tr) tb.textContent = dark ? "Light" : "Dark";
        tb.setAttribute("aria-label", tr ? "Temayı değiştir" : "Switch theme");
      }
      if (lb) {
        lb.textContent = tr ? "EN" : "TR";
        lb.setAttribute("aria-label", tr ? "Switch to English" : "Türkçeye geç");
      }
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

    var hdr = document.querySelector(".site-header");
    function onScroll() { if (hdr) hdr.classList.toggle("scrolled", window.scrollY > 8); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var links = document.querySelectorAll("nav a");
    var steps = document.querySelector(".steps");
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
      document.querySelectorAll("main section[id]").forEach(function (s) { io.observe(s); });

      if (steps) {
        var so = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { steps.classList.add("in"); so.disconnect(); } });
        }, { threshold: 0.35 });
        so.observe(steps);
      }
    } else if (steps) { steps.classList.add("in"); }

    var cb = document.getElementById("copy-btn");
    var msg = document.getElementById("copy-msg");
    if (cb) cb.addEventListener("click", function () {
      var mail = cb.getAttribute("data-mail");
      function done() {
        if (!msg) return;
        msg.textContent = root.getAttribute("lang") === "tr" ? "E-posta kopyalandı" : "Email copied";
        setTimeout(function () { msg.textContent = ""; }, 2200);
      }
      try {
        navigator.clipboard.writeText(mail).then(done, function () { window.location.href = "mailto:" + mail; });
      } catch (e) { window.location.href = "mailto:" + mail; }
    });

    var shots = document.querySelectorAll("a.shot");
    if (shots.length) {
      var box = document.createElement("div");
      box.className = "lightbox"; box.hidden = true;
      box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
      box.innerHTML = '<button type="button" class="lb-close"><span class="tr">Kapat</span><span class="en">Close</span><kbd>Esc</kbd></button><img alt="">';
      document.body.appendChild(box);
      var bimg = box.querySelector("img"), bclose = box.querySelector(".lb-close"), lastShot = null;
      var openBox = function (a) {
        lastShot = a;
        var im = a.querySelector("img");
        bimg.src = a.getAttribute("href");
        bimg.alt = im ? im.alt : "";
        box.setAttribute("aria-label", bimg.alt);
        box.hidden = false;
        document.body.style.overflow = "hidden";
        bclose.focus();
      };
      var closeBox = function () {
        box.hidden = true;
        bimg.removeAttribute("src");
        document.body.style.overflow = "";
        if (lastShot) lastShot.focus();
      };
      shots.forEach(function (a) {
        a.addEventListener("click", function (e) { e.preventDefault(); openBox(a); });
      });
      bclose.addEventListener("click", closeBox);
      box.addEventListener("click", function (e) { if (e.target === box) closeBox(); });
      document.addEventListener("keydown", function (e) {
        if (box.hidden) return;
        if (e.key === "Escape") closeBox();
        else if (e.key === "Tab") { e.preventDefault(); bclose.focus(); }
      });
    }

    var pb = document.getElementById("print-btn");
    if (pb) pb.addEventListener("click", function () { window.print(); });
  });
})();
