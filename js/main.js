const burger = document.querySelector("[data-burger]");
const nav = document.querySelector("[data-nav]");
const overlay = document.querySelector("[data-overlay]");

if (burger && nav) {
  const openMenu = () => {
    burger.classList.add("is-active");
    nav.classList.add("is-open");
    if (overlay) overlay.classList.add("is-visible");
    document.body.classList.add("no-scroll");
  };

  const closeMenu = () => {
    burger.classList.remove("is-active");
    nav.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-visible");
    document.body.classList.remove("no-scroll");
  };

  burger.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  if (overlay) overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) closeMenu();
  });
}


/* ===== Появление секций ===== */
const revealItems = document.querySelectorAll("[data-reveal]");

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

/* ===== Счётчики ===== */
const counters = document.querySelectorAll("[data-count]");

if (counters.length) {
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);
      el.textContent = value.toLocaleString("ru-RU");
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((c) => counterObserver.observe(c));
}

/* ===== Слайдер До/После ===== */
const slider = document.querySelector("[data-slider]");

if (slider) {
  const track = slider.querySelector("[data-slider-track]");
  const slides = slider.querySelectorAll(".slider__slide");
  const dots = slider.querySelectorAll("[data-slide]");
  const prevBtn = slider.querySelector("[data-slider-prev]");
  const nextBtn = slider.querySelector("[data-slider-next]");

  let current = 0;
  let autoplayId = null;

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) =>
      dot.classList.toggle("slider__dot--active", i === current)
    );
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = setInterval(next, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayId) clearInterval(autoplayId);
    autoplayId = null;
  };

  nextBtn.addEventListener("click", () => {
    next();
    startAutoplay();
  });

  prevBtn.addEventListener("click", () => {
    prev();
    startAutoplay();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.slide));
      startAutoplay();
    });
  });

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}

/* ===== Кнопка «Наверх» ===== */
const toTopBtn = document.querySelector("[data-to-top]");

if (toTopBtn) {
  const toggleToTop = () => {
    toTopBtn.classList.toggle("is-visible", window.scrollY > 500);
  };

  toggleToTop();
  window.addEventListener("scroll", toggleToTop, { passive: true });

  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ===== Параллакс hero ===== */
const parallaxLayer = document.querySelector("[data-parallax]");

if (
  parallaxLayer &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  let ticking = false;

  const updateParallax = () => {
    const offset = window.scrollY * 0.3;
    parallaxLayer.style.transform = `translate3d(0, ${offset}px, 0)`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* ===== Форма обратного звонка ===== */
const callbackForm = document.getElementById("callbackForm");

if (callbackForm) {
  const phoneInput = callbackForm.querySelector('input[name="phone"]');
  const message = callbackForm.querySelector("[data-form-message]");

  /* Маска телефона */
  phoneInput.addEventListener("input", (e) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    if (!digits.startsWith("7")) digits = "7" + digits;
    digits = digits.slice(0, 11);

    const parts = [
      "+7",
      digits.slice(1, 4),
      digits.slice(4, 7),
      digits.slice(7, 9),
      digits.slice(9, 11),
    ];

    let result = parts[0];
    if (parts[1]) result += ` (${parts[1]}`;
    if (parts[1] && parts[1].length === 3) result += ")";
    if (parts[2]) result += ` ${parts[2]}`;
    if (parts[3]) result += `-${parts[3]}`;
    if (parts[4]) result += `-${parts[4]}`;

    e.target.value = result;
  });

  callbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = callbackForm.name.value.trim();
    const phone = callbackForm.phone.value.trim();
    const errors = [];

    if (name.length < 2) errors.push("Укажите имя");
    if (phone.replace(/\D/g, "").length !== 11) errors.push("Проверьте телефон");

    if (errors.length) {
      message.hidden = false;
      message.className = "form__message form__message--error";
      message.textContent = errors.join(". ");
      return;
    }

    message.hidden = false;
    message.className = "form__message form__message--success";
    message.textContent = `Спасибо, ${name}! Перезвоним в течение 15 минут.`;

    callbackForm.reset();
  });
}

/* ===== Тень шапки при скролле ===== */
const header = document.querySelector("[data-header]");

if (header) {
  const toggleHeader = () => {
    header.classList.toggle("header--scrolled", window.scrollY > 20);
  };

  toggleHeader();
  window.addEventListener("scroll", toggleHeader, { passive: true });
}

/* ===== Фильтр услуг ===== */
const servicesFilters = document.querySelector("[data-services-filters]");
const servicesGrid = document.querySelector("[data-services-grid]");
const servicesCount = document.querySelector("[data-services-count]");

if (servicesFilters && servicesGrid) {
  const cards = servicesGrid.querySelectorAll(".service-card");

  servicesFilters.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;

    servicesFilters.querySelectorAll(".services__filter").forEach((b) =>
      b.classList.toggle("services__filter--active", b === btn)
    );

    const filter = btn.dataset.filter;
    let visible = 0;

    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !match);
      if (match) visible++;
    });

    if (servicesCount) servicesCount.textContent = visible;
  });
}

/* ===== Универсальная обработка форм заявок ===== */
const requestForms = [
  { id: "serviceForm", phoneField: "servicePhone", extraCheck: null },
  { id: "consultForm", phoneField: "consultPhone", extraCheck: "consultTopic" }
];

/* Маска телефона — применяем ко всем tel-полям */
document.querySelectorAll('input[type="tel"]').forEach((phoneInput) => {
  phoneInput.addEventListener("input", (e) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    if (!digits.startsWith("7")) digits = "7" + digits;
    digits = digits.slice(0, 11);

    const parts = [
      "+7",
      digits.slice(1, 4),
      digits.slice(4, 7),
      digits.slice(7, 9),
      digits.slice(9, 11),
    ];

    let result = parts[0];
    if (parts[1]) result += ` (${parts[1]}`;
    if (parts[1] && parts[1].length === 3) result += ")";
    if (parts[2]) result += ` ${parts[2]}`;
    if (parts[3]) result += `-${parts[3]}`;
    if (parts[4]) result += `-${parts[4]}`;

    e.target.value = result;
  });
});

/* Обработка каждой формы */
requestForms.forEach(({ id, phoneField, extraCheck }) => {
  const form = document.getElementById(id);
  if (!form) return;

  const message = form.querySelector("[data-form-message]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('input[name$="Name"]');
    const phoneInput = form.querySelector(`input[name="${phoneField}"]`);
    const name = nameInput ? nameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const errors = [];

    if (name.length < 2) errors.push("Укажите имя");
    if (phone.replace(/\D/g, "").length !== 11) errors.push("Проверьте телефон");

    if (extraCheck) {
      const extra = form.querySelector(`textarea[name="${extraCheck}"]`);
      if (extra && extra.value.trim().length < 5) {
        errors.push("Опишите тему обращения");
      }
    }

    if (errors.length) {
      message.hidden = false;
      message.className = "form__message form__message--error";
      message.textContent = errors.join(". ");
      return;
    }

    message.hidden = false;
    message.className = "form__message form__message--success";
    message.textContent = `Спасибо, ${name}! Заявка отправлена — перезвоним в течение 15 минут.`;

    form.reset();
  });
});