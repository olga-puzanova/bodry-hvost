const dialog = document.querySelector(".booking-dialog");
const form = dialog.querySelector("form");
const nameField = form.elements.namedItem("student");
const contactField = form.elements.namedItem("contact");
const questionField = form.elements.namedItem("question");
const questionLabel = form.querySelector("[data-question]");
const title = dialog.querySelector("#booking-title");
const selection = dialog.querySelector("[data-selection]");
const next = dialog.querySelector("[data-next]");
const submit = form.querySelector("[type=submit]");
const success = dialog.querySelector(".success");
let opener;

for (const button of document.querySelectorAll("[data-book], [data-ask]")) {
  button.addEventListener("click", () => {
    opener = button;
    const asking = button.hasAttribute("data-ask");
    const { course, date, price } = button.dataset;
    title.textContent = asking ? "Вопрос о курсах" : "Заявка на курс";
    selection.hidden = asking;
    selection.textContent = asking ? "" : [course, date, price].join(" · ");
    next.textContent = asking
      ? "В рабочей версии администратор ответит по указанному контакту."
      : "В рабочей версии администратор подтвердит группу, адрес и условия оплаты.";
    questionLabel.hidden = !asking;
    questionField.disabled = !asking;
    submit.textContent = asking ? "Отправить демо-вопрос" : "Отправить демо-заявку";
    dialog.showModal();
    nameField.focus();
  });
}

dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());

dialog.addEventListener("close", () => {
  form.reset();
  form.hidden = false;
  next.hidden = false;
  success.hidden = true;
  opener?.focus();
});

const fields = [nameField, contactField, questionField];
for (const field of fields) {
  field.addEventListener("input", () => {
    field.setCustomValidity(field.value.trim() ? "" : "Заполни это поле.");
  });
}

form.addEventListener("reset", () => {
  for (const field of fields) field.setCustomValidity("");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  form.reset();
  form.hidden = true;
  next.hidden = true;
  success.textContent = questionField.disabled
    ? "Демо-заявка заполнена. В рабочей версии школа связалась бы с тобой и подтвердила место."
    : "Демо-вопрос заполнен. В рабочей версии администратор ответил бы по указанному контакту.";
  success.hidden = false;
  success.focus();
});
