let todoList = document.querySelector(".todo-list");

const todoForm = document.getElementById("todoForm");
const todoTableBody = document.getElementById("todoTableBody");
const searchInput = document.querySelector('[data-field="search"]');
let FormEL = document.querySelector(".create-form");

FormEL.addEventListener("submit", async (e) => {
  e.preventDefault();

  let formData = new FormData(FormEL);

  let newTodo = {
    title: formData.get("title"),
    description: formData.get("description"),
    completed: false,
  };

  await createTodo(newTodo);
  await getElement();
  FormEL.reset();
});

async function getElement() {
  try {
    let response = await fetch(
      "https://biyovo1194.pythonanywhere.com/api/v1/tasks/",
    );
    if (!response.ok) {
      throw new Error("malumot olishda xatolik");
    }
    let data = await response.json();

    updataUi(data.data.results);
    console.log(data.data.results);
  } catch (error) {
    console.log(error);
  }
}
getElement();

async function deletedTodo(id) {
  try {
    const response = await fetch(
      `https://biyovo1194.pythonanywhere.com/api/v1/tasks/${id}`,
      {
        method: "DELETE",
      },
    );

    if (response.status === 200 || response.status === 204) {
      console.log(`Todo ${id} o'chirildi`);
    }
  } catch (error) {
    console.error("DELETE xato:", error);
  }
}

function updataUi(arr) {
  todoList.innerHTML = "";

  arr.forEach((todo) => {
    // console.log(todo);

    let { id, title, description, completed, created_at } = todo;

    todoList.innerHTML += `    <li class="todo-item" data-id="1" data-completed="false">
              <button
                class="check"
                type="button"
                aria-label="Mark as completed"
                data-action="toggle"
              >
                <span class="check-icon" aria-hidden="true"></span>
              </button>

              <div class="todo-content">
                <div class="todo-top">
                  <h3 class="todo-title">${title}</h3>
                  <span class="badge badge-active">${completed ? "Done" : "Active"}</span>
                </div>
                <p class="todo-desc">
                ${description}
                </p>

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
                <button
                  class="icon-btn"
                  type="button"
                  title="Edit"
                  data-action="edit"
                >
                  ✎
                </button>
                <button
                onclick="deletedTodo(${todo.id})"
                  class="icon-btn danger"
                  type="button"
                  title="Delete"
                  data-action="delete"
                >
                  🗑
                </button>
              </div>
            </li>`;
  });
}

async function createTodo(todo) {
  try {
    const response = await fetch(
      "https://biyovo1194.pythonanywhere.com/api/v1/tasks/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      },
    );

    const data = await response.json();
    console.log("Server javobi:", data);
    alert(`${todo.title} qo'shildi`);
  } catch (error) {
    console.log(error);
  }
}
