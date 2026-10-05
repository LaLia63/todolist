# Pure Todo

A lightweight, responsive task management application built with vanilla JavaScript.

## Demo

**Live Demo:** [https://lalia63.github.io/todolist]

## Overview

Pure Todo is a client-side todo application focused on a simple workflow for creating, managing, and organizing tasks.

The application uses browser `localStorage` for persistence, allowing tasks to remain available between sessions without requiring a backend service.

## Features

* Create, edit, and delete tasks
* Toggle task completion
* Filter tasks by status
* Drag-and-drop task reordering
* Persistent client-side storage
* Task completion statistics
* Delete confirmation dialog
* Success notifications
* Keyboard interaction
* Responsive UI

## Tech Stack

* HTML5
* CSS3
* JavaScript (ES6+)
* Tailwind CSS
* Notiflix
* LocalStorage API

## Architecture

The application follows a simple client-side architecture:

```text
User Interaction
       │
       ▼
    DOM Events
       │
       ▼
 Application State
       │
       ├──── Add / Edit / Delete
       ├──── Complete / Uncomplete
       ├──── Filter
       └──── Reorder
       │
       ▼
    localStorage
       │
       ▼
     Rendering
```

Application state is maintained in a JavaScript array and synchronized with `localStorage` whenever the state changes.

## Data Model

Each task is represented by an object:

```javascript
{
  id: Number,
  text: String,
  completed: Boolean,
  createdAt: String
}
```

## Project Structure

```text
pure-todo/
├── index.html
├── style.css
├── script.js
├── todolist.png
└── README.md
```

## Local Development

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd pure-todo
```

Open `index.html` directly in a browser or run the project using a local development server.

For example, with VS Code Live Server:

```text
Right-click index.html
→ Open with Live Server
```

## Storage

No external database is used.

Task data is stored using the browser's `localStorage` API:

```javascript
localStorage.setItem("tasks", JSON.stringify(tasks));
```

This keeps the project completely client-side and removes the need for authentication, APIs, or server-side infrastructure.

## Responsive Design

The UI is designed for:

* Mobile
* Tablet
* Desktop

The layout adapts the task input, controls, task cards, and text wrapping according to the available viewport width.

## Author

**Hsu Yati Zaw (Lia)**

Full Stack Developer · UI/UX Designer

[GitHub](https://github.com/LaLia63)

## License

This project is available for personal and educational use.
