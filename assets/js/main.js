/* =========================================================
   ВКСервис Норильск — интерактив
   ========================================================= */
(function () {
  "use strict";

  /* ---- Год в подвале ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Шапка: тень при прокрутке ---- */
  var header = document.getElementById("header");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Мобильное меню ---- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  var overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  document.body.appendChild(overlay);

  function setMenu(open) {
    if (!nav || !burger) return;
    nav.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    overlay.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burger) {
    burger.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
  }
  overlay.addEventListener("click", function () { setMenu(false); });
  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---- Маска телефона ---- */
  function maskPhone(input) {
    input.addEventListener("input", function () {
      var digits = input.value.replace(/\D/g, "");
      if (digits.startsWith("8")) digits = "7" + digits.slice(1);
      if (!digits.startsWith("7")) digits = "7" + digits;
      digits = digits.slice(0, 11);

      var out = "+7";
      if (digits.length > 1) out += " (" + digits.slice(1, 4);
      if (digits.length >= 4) out += ") " + digits.slice(4, 7);
      if (digits.length >= 7) out += "-" + digits.slice(7, 9);
      if (digits.length >= 9) out += "-" + digits.slice(9, 11);
      input.value = out;
    });
  }
  document.querySelectorAll('input[type="tel"]').forEach(maskPhone);

  /* ---- Тост ---- */
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-show");
    }, 4000);
  }

  /* ---- Обработка форм (демо без бэкенда) ---- */
  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var phone = (form.querySelector('[name="phone"]') || {}).value || "";
      if (!name.trim() || phone.replace(/\D/g, "").length < 11) {
        showToast("Заполните имя и корректный телефон");
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Отправляем…"; }

      setTimeout(function () {
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Отправить"; }
        showToast("Спасибо, " + name.trim().split(" ")[0] + "! Заявка принята — перезвоним в рабочее время.");
      }, 700);
    });
  });

  /* ---- Анимация появления ---- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Счётчики ---- */
  var counters = document.querySelectorAll(".stat__num[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    var suffix = el.dataset.suffix || "";
    var start = performance.now();
    var dur = 1400;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.dataset.count + (el.dataset.suffix || "");
    });
  }
})();
