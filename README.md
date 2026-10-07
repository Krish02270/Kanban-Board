# 📋 Kanban Task Manager

### A Modern, Interactive Task Management Board Built with Angular 17

Kanban Task Manager is a **frontend-only task management application** built with **Angular 17**, **Angular Material**, and **Angular CDK Drag & Drop**.

It provides an intuitive Kanban-style workflow where users can create, organize, search, prioritize, and track tasks across customizable columns.

> **Plan. Organize. Prioritize. Get Things Done.**

---

## ✨ Features

### 📝 Task Management

Create, edit, and delete tasks with:

* Title
* Description
* Priority
* Tags
* Column assignment

### 🖱️ Drag & Drop

Move tasks between columns or reorder tasks within the same column using Angular CDK.

### 📊 Dynamic Columns

Users can:

* Add columns
* Rename columns
* Delete columns
* Organize workflows based on their needs

### 💾 LocalStorage Persistence

Tasks and columns are automatically saved to the browser's `localStorage`, allowing the board to persist even after refreshing the page.

### 🔔 Notifications

Angular Material SnackBar provides instant feedback when users:

* Create tasks
* Update tasks
* Delete tasks
* Modify columns

### 🔎 Search

Search across the entire board by:

* Task title
* Description
* Tags

### 📈 Progress Tracking

A live progress indicator shows the percentage of completed tasks.

---

# 🛠️ Technology Stack

| Technology       | Purpose                   |
| ---------------- | ------------------------- |
| Angular 17       | Frontend framework        |
| TypeScript       | Application development   |
| Angular Material | UI components             |
| Angular CDK      | Drag & Drop               |
| Angular Signals  | Reactive state management |
| Reactive Forms   | Task creation/editing     |
| LocalStorage     | Client-side persistence   |
| SCSS             | Styling                   |

---

# 🏗️ Architecture

```text
                         ┌────────────────────┐
                         │       User         │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │   Angular 17 UI    │
                         └─────────┬──────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
       │    Board    │      │ Task Dialog │      │   Search    │
       │  Component  │      │             │      │  & Progress │
       └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   ▼
                         ┌────────────────────┐
                         │  Kanban Service    │
                         │                    │
                         │ Angular Signals    │
                         │ State Management   │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │    LocalStorage    │
                         └────────────────────┘
```

---

# 🧩 Key Technical Decisions

## Angular 17 Standalone Components

The application uses Angular's standalone component architecture, eliminating the need for traditional `NgModule` configuration.

## Signals-Based State Management

Angular 17 Signals are used for reactive application state.

Instead of relying on complex RxJS Subject patterns, the application uses:

```typescript
signal()
computed()
```

This keeps state management simple and reactive.

## Angular CDK Drag & Drop

Angular CDK's `CdkDragDrop` functionality enables:

* Cross-column task movement
* Same-column reordering
* Interactive task organization

## LocalStorage Persistence

Every board modification is persisted to the browser.

The board state is stored using:

```text
kanban_board_v2
```

This allows tasks and columns to survive page refreshes without requiring a backend database.

---

# 📁 Project Structure

```text
src/
│
├── app/
│   │
│   ├── models/
│   │   └── task.model.ts
│   │
│   ├── services/
│   │   └── kanban.service.ts
│   │
│   ├── board/
│   │   └── board.component.ts
│   │
│   ├── task-dialog/
│   │   └── task-dialog.component.ts
│   │
│   ├── confirm-dialog/
│   │   └── confirm-dialog.component.ts
│   │
│   ├── app.component.ts
│   └── app.config.ts
│
├── styles.scss
└── index.html
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js 18+
* npm 9+

Check your versions:

```bash
node -v
npm -v
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd kanban-task-manager
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run the Application

Start the development server:

```bash
npm start
```

or:

```bash
npx ng serve
```

Then open:

```text
http://localhost:4200
```

---

# 📦 Production Build

Create a production build:

```bash
npm run build
```

The generated application will be available inside:

```text
dist/kanban-task-manager/
```

---

# 🎨 Design

The application uses a modern dark interface designed around productivity and readability.

### Typography

* **Syne** — Headings
* **DM Mono** — Badges and dates

### Visual System

* 🌑 Dark UI
* 🟣 Indigo accents
* 🔵 Sky accents
* 🟡 Amber accents
* 🟢 Green accents

### Priority Indicators

| Priority  | Indicator |
| --------- | --------- |
| 🟢 Low    | Green     |
| 🟡 Medium | Amber     |
| 🔴 High   | Red       |

---

# 🔄 User Workflow

```text
Create Task
     ↓
Add Description & Tags
     ↓
Set Priority
     ↓
Assign Column
     ↓
Drag & Drop
     ↓
Update Progress
     ↓
Complete Task
```

---

# 📊 Feature Modules

| Module            | Functionality                  |
| ----------------- | ------------------------------ |
| Task Management   | Create, edit, delete tasks     |
| Drag & Drop       | Move and reorder tasks         |
| Column Management | Create, rename, delete columns |
| Search            | Search tasks in real time      |
| Persistence       | Save board using LocalStorage  |
| Notifications     | Display operation feedback     |
| Progress          | Track task completion          |

---

# 🗺️ Development Roadmap

```text
Weeks 1–2
Task Management
        ↓
Weeks 3–4
Drag & Drop + Column Management
        ↓
Weeks 5–6
Persistence + Notifications
        ↓
Weeks 7–8
Testing + Documentation
```

---

# 🔮 Future Improvements

Potential future enhancements include:

* ☁️ Cloud synchronization
* 👥 Multi-user collaboration
* 🔐 Authentication
* 📅 Due dates and reminders
* 📎 File attachments
* 💬 Task comments
* 📊 Productivity analytics
* 🔔 Browser notifications
* 🌐 Backend API integration
* 📱 Mobile-responsive improvements
* 🎨 Custom board themes

---

# 🎯 Project Goals

This project was built to demonstrate practical knowledge of:

* Angular application architecture
* Modern Angular Signals
* Component-based development
* State management
* Drag-and-drop interactions
* Reactive forms
* UI/UX design
* Browser storage
* TypeScript development

---

# 👨‍💻 Author

### Vinay

Computer Science & Engineering Student

Interested in:

* 💻 Full-Stack Development
* 🤖 Artificial Intelligence
* 📊 Data Analytics
* 🚀 Software Engineering
* 🌐 Modern Web Technologies

GitHub:

https://github.com/Vinay-9AI

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 📜 License

This project is intended for educational and development purposes.
