# PaperFlow — To-Do List Web App

> **"Your day, organized."**

PaperFlow is a modern, responsive task-management and personal productivity web application designed around a warm "digital notebook" aesthetic.

---

## 1. Project Overview

PaperFlow offers a calm, intentional alternative to generic dark-mode admin dashboards. It behaves like a personal planner or paper journal, enabling users to add, edit, filter, search, complete, and delete daily tasks easily.

This application is built as a pure frontend solution. All task data persists locally inside the user's browser using the native HTML5 `localStorage` API.

---

## 2. Project Objective

The core objective of this project is to build a fully functional, resilient, and accessible task manager using standard web fundamentals (HTML5, CSS3, Vanilla JavaScript) without relying on external libraries or frameworks like React, Vue, Bootstrap, or jQuery.

---

## 3. Key Features

- **Task Creation & Management:** Add tasks using buttons or pressing the `Enter` key.
- **Inline Task Editing:** Edit existing tasks directly within the planner card.
- **Task Completion:** Mark tasks as complete with visually distinctive sage-green styling and readable line-through text.
- **Task Deletion:** Remove individual tasks seamlessly.
- **Clear Completed:** Remove all finished tasks in a single click.
- **Real-Time Case-Insensitive Search:** Instantly filter tasks as you type.
- **Planner Tab Filters:** Categorize views into `All`, `Active`, and `Completed`.
- **Dynamic Task Statistics:** Automatically recalculate Total, Active, and Completed task counters.
- **Persistent Local Storage:** Retain tasks across browser refreshes and system reboots.
- **Empty States:** Friendly contextual illustrations and copy when no tasks match the filter/search criteria.
- **Responsive Notebook Design:** Fully adapted across desktop, tablet, and mobile screens without horizontal scroll.

---

## 4. Technologies Used

- **HTML5:** Semantic architecture, accessibility attributes (ARIA), forms, and clean markup.
- **CSS3:** Custom CSS variables, CSS grid/flexbox layouts, responsive media queries, and keyframe animations.
- **Vanilla JavaScript (ES6+):** Event listeners, array methods (`map`, `filter`, `unshift`), DOM manipulation, and input validation.
- **Web Storage API (`localStorage`):** Structured JSON serialization and data persistence.

---

## 5. How `localStorage` Works in PaperFlow

PaperFlow saves data in the user's browser storage using standard key-value pairs:

1. **Saving Tasks (`JSON.stringify`):**
   The internal JavaScript `tasks` array (containing objects with `id`, `title`, and `completed` fields) is serialized into a string and saved:
   ```javascript
   localStorage.setItem('paperflow_tasks_data', JSON.stringify(tasks));