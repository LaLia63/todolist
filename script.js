document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task-input");
  const addBtn = document.getElementById("add-btn");
  const taskList = document.getElementById("task-list");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const statsElement = document.getElementById("stats");

  Notiflix.Confirm.init({
    okButtonBackground: "#3b82f6",
    okButtonColor: "#ffffff",
    cancelButtonBackground: "#e5e7eb",
    cancelButtonColor: "#374151",
    titleColor: "#3b82f6",
    messageColor: "#3b82f6",
  });

  Notiflix.Notify.init({
    background: "#3b82f6",
    textColor: "#ffffff",
    position: "right-top",
    timeout: 2500,
  });

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  renderTasks();

  addBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      renderTasks();
    });
  });

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.unshift(newTask);
    saveTasks();
    taskInput.value = "";
    renderTasks();
  }

  function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;
    if (currentFilter === "active") {
      filteredTasks = tasks.filter((t) => !t.completed);
    } else if (currentFilter === "completed") {
      filteredTasks = tasks.filter((t) => t.completed);
    }

    if (filteredTasks.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "text-center py-10 text-gray-400";

      const img = document.createElement("img");
      img.src =
        "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1fe74631-f6e3-454f-9745-02ac905837cf.png";
      img.alt =
        "Illustration of a peaceful desk setup with plants and notebook representing no tasks";
      img.className = "mx-auto mb-4 rounded-lg";

      const message = document.createElement("p");
      message.textContent = "Nothing to do. Enjoy your free time!";

      emptyState.appendChild(img);
      emptyState.appendChild(message);
      taskList.appendChild(emptyState);

      updateStats();
      return;
    }

    filteredTasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });

    updateStats();
  }

  function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.className = "todo-card flex items-center gap-3 p-4 cursor-move";
    taskElement.draggable = true;
    taskElement.dataset.id = task.id;

    taskElement.innerHTML = `
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <input type="checkbox" ${task.completed ? "checked" : ""}
          class="checkbox" id="task-${task.id}">
          <span class="task-text min-w-0 break-words ${task.completed ? "completed" : ""}">
  ${task.text}
</span>
      </div>
      <div class="flex gap-2">
        <button class="edit-btn text-gray-400 hover:text-purple-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button class="delete-btn text-gray-400 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    `;

    const checkbox = taskElement.querySelector(".checkbox");
    checkbox.addEventListener("change", function () {
      task.completed = this.checked;
      saveTasks();
      renderTasks();
    });

    const textElement = taskElement.querySelector(".task-text");
    textElement.addEventListener("click", function () {
      editTask(task.id);
    });

    const editBtn = taskElement.querySelector(".edit-btn");
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      editTask(task.id);
    });

    const deleteBtn = taskElement.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      Notiflix.Confirm.show(
        "Delete Task",
        "Are you sure you want to delete this task?",
        "Delete",
        "Cancel",
        function okCb() {
          tasks = tasks.filter((t) => t.id !== task.id);
          saveTasks();
          renderTasks();

          Notiflix.Notify.success("Task deleted successfully!");
        },
      );
    });

    // Drag & drop
    taskElement.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", task.id);
      setTimeout(() => taskElement.classList.add("opacity-50"), 0);
    });

    taskElement.addEventListener("dragend", function () {
      taskElement.classList.remove("opacity-50");
    });

    taskElement.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    taskElement.addEventListener("drop", function (e) {
      e.preventDefault();
      const draggedId = parseInt(e.dataTransfer.getData("text/plain"));
      const draggedTask = tasks.find((t) => t.id === draggedId);
      const targetId = parseInt(taskElement.dataset.id);

      if (draggedId !== targetId) {
        tasks = tasks.filter((t) => t.id !== draggedId);
        const targetIndex = tasks.findIndex((t) => t.id === targetId);
        tasks.splice(targetIndex, 0, draggedTask);
        saveTasks();
        renderTasks();
      }
    });
    return taskElement;
  }

  function editTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    const textElement = taskElement.querySelector(".task-text");

    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.className =
      "flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none";

    textElement.replaceWith(input);
    input.focus();

    const finishEdit = () => {
      const newText = input.value.trim();
      if (newText) {
        task.text = newText;
        saveTasks();
      }
      renderTasks();
    };

    input.addEventListener("blur", finishEdit);
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") finishEdit();
    });
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const remaining = total - completed;

    statsElement.textContent = `${remaining} remaining of ${total} tasks (${completed} completed)`;
  }
});
