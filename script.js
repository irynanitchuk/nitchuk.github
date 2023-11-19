// Об'єкт із класами для елементів завдання
const cssClasses = {
  task_ITEM: "task-container",
  task_CHECKBOX: "task-checkbox",
  task_TEXT: "task-text",
  task_DELETE: "task-delete",
};

// Отримання посилання на список завдань та елементи підрахунку
const list = document.getElementById("task-list");
const itemCountSpan = document.getElementById("item-count");
const uncheckedCountSpan = document.getElementById("unchecked-count");

// Масив для збереження завдань та лічильник
let taskArr = [];
let numb = 1;

// Перевірка, чи є дані у локальному сховищі
if (localStorage.getItem("taskList")) {
  // Витягнення даних та їх рендеринг
  taskArr = JSON.parse(localStorage.getItem("taskList"));
  render();
  // Оновлення лічильника
  numb = Number(JSON.parse(localStorage.getItem("id")));
}

// Додавання нового завдання
function newTask() {
  let text = window.prompt("Enter task");
  let task = { id: numb++, text, checked: false };
  taskArr.push(task);
  render(); // Оновлення інтерфейсу
  saveData(); // Збереження даних

  localStorage.setItem("id", `${numb}`); // Оновлення лічильника
}

// Рендеринг списку завдань
function render() {
  // Відображення кожного завдання у вигляді HTML
  list.innerHTML = taskArr.map((task) => rendertask(task)).join("");
  // Оновлення лічильників
  itemCountSpan.innerHTML = taskArr.length;
  uncheckedCountSpan.innerHTML = taskArr.filter((task) => !task.checked).length;
}

// Генерація HTML для кожного завдання
function rendertask(task) {
  return `<li id="${task.id}">
    <input type="checkbox" ${task.checked ? "checked" : ""}/>
    <span>${task.text} ID:${task.id}</span>
    <button onClick="deletetask(this)">delete</button>
  </li>`;
}

// Видалення завдання
function deletetask(delButt) {
  const taskEl = delButt.closest("li");
  const taskIndex = taskArr.findIndex((el) => el.id == taskEl.id);
  taskArr.splice(taskIndex, 1); // Видалення завдання з масиву
  render(); // Оновлення інтерфейсу
  countUnchecked(); // Перерахунок невиконаних завдань
  saveData(); // Збереження даних
}

// Підрахунок невиконаних завдань
function countUnchecked() {
  const uncheckCount = taskArr.reduce(
    (acc, task) => (acc += task.checked ? 0 : 1),
    0
  );
  uncheckedCountSpan.textContent = `${uncheckCount}`;
}

// Обробка кліку на чекбокс
list.addEventListener("click", function (e) {
  if (e.target.localName !== "input") return;
  const taskEl = e.target.closest("li");
  const taskIndex = taskArr.findIndex((el) => el.id === Number(taskEl.id));

  taskArr[taskIndex].checked = !taskArr[taskIndex].checked; // Зміна статусу завдання

  saveData(); // Збереження даних
  countUnchecked(); // Перерахунок невиконаних завдань
});

// Збереження даних у локальному сховищі
function saveData() {
  localStorage.setItem("taskList", JSON.stringify(taskArr));
}
