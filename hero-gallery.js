const gallery = document.querySelector("[data-hero-gallery]");
const slides = [...gallery.querySelectorAll(".hero-slide")];
const slideButtons = [...gallery.querySelectorAll("[data-slide]")];
const galleryControls = gallery.querySelector(".hero-gallery-controls");
const playbackButton = gallery.querySelector(".gallery-playback");
const galleryReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let activeSlide = 0;
let rotationTimer;
let playing = !galleryReducedMotion.matches;
let pointerInside = false;
let focusInside = false;
let galleryVisible = true;

function showSlide(index) {
  slides[activeSlide].classList.remove("is-active");
  slides[activeSlide].setAttribute("aria-hidden", "true");
  slideButtons[activeSlide].removeAttribute("aria-current");
  activeSlide = index;
  slides[activeSlide].classList.add("is-active");
  slides[activeSlide].removeAttribute("aria-hidden");
  slideButtons[activeSlide].setAttribute("aria-current", "true");
}

function scheduleSlide() {
  clearTimeout(rotationTimer);
  if (!playing || pointerInside || focusInside || !galleryVisible || document.hidden) return;
  rotationTimer = setTimeout(() => {
    showSlide((activeSlide + 1) % slides.length);
    scheduleSlide();
  }, 5000);
}

function updatePlayback() {
  playbackButton.textContent = playing ? "Пауза" : "Продолжить";
  playbackButton.setAttribute("aria-label", playing ? "Остановить смену фотографий" : "Продолжить смену фотографий");
  scheduleSlide();
}

for (const button of slideButtons) {
  button.addEventListener("click", () => {
    showSlide(Number(button.dataset.slide));
    scheduleSlide();
  });
}

playbackButton.addEventListener("click", () => {
  playing = !playing;
  updatePlayback();
});
gallery.addEventListener("pointerenter", event => {
  pointerInside = event.pointerType !== "touch";
  scheduleSlide();
});
gallery.addEventListener("pointerleave", () => {
  pointerInside = false;
  scheduleSlide();
});
gallery.addEventListener("focusin", () => {
  focusInside = true;
  scheduleSlide();
});
gallery.addEventListener("focusout", event => {
  focusInside = gallery.contains(event.relatedTarget);
  scheduleSlide();
});
document.addEventListener("visibilitychange", scheduleSlide);
galleryReducedMotion.addEventListener("change", event => {
  playing = !event.matches;
  updatePlayback();
});

if (typeof IntersectionObserver === "function") {
  const galleryObserver = new IntersectionObserver(([entry]) => {
    galleryVisible = entry.isIntersecting;
    scheduleSlide();
  });
  galleryObserver.observe(gallery);
}

galleryControls.hidden = false;
updatePlayback();
