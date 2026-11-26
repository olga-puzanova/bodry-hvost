const goalButtons = [...document.querySelectorAll("[data-goal]")];
const courseCards = [...document.querySelectorAll("[data-program]")];
const courseLinks = [...document.querySelectorAll("[data-course-link]")];
const detailPanels = [...document.querySelectorAll("[data-detail]")];
const programChoice = document.querySelector("[data-program-choice]");
const programButtons = [...programChoice.querySelectorAll("[data-select-program]")];
const results = document.querySelector("[data-result]");
const cards = document.querySelector(".cards");
const coursePhoto = document.querySelector("[data-course-photo]");
const courseImages = [...coursePhoto.querySelectorAll("[data-course-image]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const entranceAnimations = new WeakMap();

function reveal(element, delay = 0) {
  if (reducedMotion.matches || typeof element.animate !== "function") return;
  entranceAnimations.get(element)?.cancel();
  const animation = element.animate(
    [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 440, delay, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" }
  );
  entranceAnimations.set(element, animation);
}

const revealObserver = typeof IntersectionObserver === "function" ? new IntersectionObserver(entries => {
  let delay = 0;
  for (const { isIntersecting, target } of entries) {
    if (!isIntersecting) continue;
    revealObserver.unobserve(target);
    reveal(target, delay);
    delay = Math.min(delay + 65, 195);
  }
}, { threshold: 0.06 }) : null;

const scrollContent = document.querySelectorAll([
  ".hero-copy", ".hero-photo", ".course-intro", ".filter", ".card", ".program-heading",
  ".program-days > li", "[data-reveal]", ".program-sign-up",
  ".schedule > *", ".faq-grid > *", ".enrolment-copy > *",
  ".footer .wrap > *"
].join(", "));

for (const element of scrollContent) revealObserver?.observe(element);

function revealAllCards() {
  courseCards.forEach((card, index) => {
    revealObserver?.unobserve(card);
    const position = card.getBoundingClientRect();
    if (revealObserver && (position.top >= window.innerHeight || position.bottom <= 0)) {
      revealObserver.observe(card);
    } else {
      reveal(card, index * 110);
    }
  });
}

const goalDescriptions = {
  all: "Три программы для разных целей.",
  try: "Для первого знакомства подойдёт «Проба профессии».",
  start: "Для смены профессии начни со «Старта в профессии».",
  pro: "Чтобы отработать одну технику, выбери «Форму на кудрях»."
};

function filterCards(goal) {
  for (const button of goalButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.goal === goal));
  }
  for (const card of courseCards) {
    card.hidden = goal !== "all" && card.dataset.program !== goal;
  }
  cards.dataset.filtered = String(goal !== "all");
  coursePhoto.hidden = goal === "all";
  for (const image of courseImages) image.hidden = image.dataset.courseImage !== goal;
  results.textContent = goalDescriptions[goal];
}

function showDetails(program) {
  for (const panel of detailPanels) panel.hidden = panel.dataset.detail !== program;
  for (const button of programButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.selectProgram === program));
  }
  for (const link of courseLinks) {
    if (link.dataset.courseLink === program) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
}

function linkedProgram() {
  return document.getElementById(location.hash.slice(1))?.dataset.programAnchor;
}

function showLinkedProgram() {
  const program = linkedProgram();
  if (!program) return;
  if (courseCards.some(card => card.dataset.program === program && card.hidden)) filterCards("all");
  showDetails(program);
}

for (const button of goalButtons) {
  button.addEventListener("click", () => {
    const goal = button.dataset.goal;
    filterCards(goal);
    if (goal === "all") {
      revealAllCards();
      return;
    }
    showDetails(goal);
    if (linkedProgram()) {
      history.replaceState(history.state, "", "#courses");
    }
  });
}

for (const link of courseLinks) {
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    showDetails(link.dataset.courseLink);
  });
}

for (const button of programButtons) {
  button.addEventListener("click", () => {
    const program = button.dataset.selectProgram;
    showDetails(program);
    if (cards.dataset.filtered === "true") filterCards(program);
    if (linkedProgram()) history.replaceState(history.state, "", "#" + program + "-program");
  });
}

programChoice.hidden = false;
window.addEventListener("hashchange", showLinkedProgram);
showLinkedProgram();
