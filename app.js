const BASE_URL = "https://biyovo1194.pythonanywhere.com/api/v1/tasks";

let todoList = document.querySelector(".todo-list");
let FormEL = document.querySelector(".create-form");
const searchInput = document.querySelector('[data-field="search"]');

FormEL.addEventListener("submit", async (e) => {
  e.preventDefault();

  let formData = new FormData(FormEL);
  let newTodo = {
    title: formData.get("title"),
    description: formData.get("description"),
    completed: false,
  };

  try {
    await createTodo(newTodo);
    FormEL.reset();
    await getElement();
  } catch (err) {
    console.error("Create xato:", err);
  }
});

async function getElement() {
  try {
    let response = await fetch(`${BASE_URL}/`);
    if (!response.ok) throw new Error("Malumot olishda xatolik");
    let data = await response.json();
    updateUi(data.data.results);
  } catch (error) {
    console.error(error);
  }
}

async function createTodo(todo) {
  const response = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error("Yaratishda xatolik");
  return response.json();
}

async function deletedTodo(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}/`, {
      method: "DELETE",
    });

    if (response.ok || response.status === 204) {
      await getElement();
    } else {
      console.error("DELETE muvaffaqiyatsiz:", response.status);
    }
  } catch (error) {
    console.error("DELETE xato:", error);
  }
}

function updateUi(arr) {
  todoList.innerHTML = "";

  arr.forEach((todo) => {
    let { id, title, description, completed, created_at } = todo;

    todoList.innerHTML += `
      <li class="todo-item ${completed ? "is-done" : ""}" data-id="${id}" data-completed="${completed}">
        <button class="check ${completed ? "is-checked" : ""}" type="button"
          aria-label="${completed ? "Mark as active" : "Mark as completed"}"
          data-action="toggle">
          <span class="check-icon" aria-hidden="true">${completed ? "✓" : ""}</span>
        </button>

        <div class="todo-content">
          <div class="todo-top">
            <h3 class="todo-title">${title}</h3>
            <span class="badge ${completed ? "badge-done" : "badge-active"}">
              ${completed ? "Completed" : "Active"}
            </span>
          </div>
          <p class="todo-desc">${description || ""}</p>
          <div class="meta">
            <span class="meta-item">
              <span class="meta-label">ID:</span>
              <span class="meta-value">${id}</span>
            </span>
            <span class="meta-item">
              <span class="meta-label">Created:</span>
              <span class="meta-value">${created_at.split("T")[0]}</span>
            </span>
          </div>
        </div>

        <div class="todo-actions">
          <button class="icon-btn" type="button" title="Edit" data-action="edit">✎</button>
          <button onclick="deletedTodo(${id})" class="icon-btn danger" type="button" title="Delete" data-action="delete">🗑</button>
        </div>
      </li>`;
  });
}

getElement();
