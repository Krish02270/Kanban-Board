# Kanban Board

<p align="center">
  <img src="https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 17" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS" />
  <img src="https://img.shields.io/badge/Material-UI-0081CB?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Angular Material" />
  <img src="https://img.shields.io/badge/CDK-Drag%20%26%20Drop-FF6B6B?style=for-the-badge" alt="Angular CDK" />
  <img src="https://img.shields.io/badge/Storage-LocalStorage-4CAF50?style=for-the-badge" alt="LocalStorage" />
</p>

<p align="center">
  <strong>A modern Kanban task board built with Angular to help users plan, prioritize, and track work efficiently.</strong>
</p>

## Overview

Kanban Board is a frontend-only productivity app designed for task organization and workflow management. The project focuses on a clean, interactive Kanban experience where users can create tasks, move them across columns, and maintain a real-time view of their progress without needing a backend.

This project demonstrates strong front-end engineering principles including component architecture, reactive state management, drag-and-drop interactions, and browser persistence.

---

## Why This Project

This project was built to showcase practical experience with:

- Angular component-driven architecture
- Signals-based state management
- Drag-and-drop interactions using Angular CDK
- Material UI patterns and modern UX design
- Task management workflows with local persistence
- Clean, interview-friendly front-end problem solving

It is a strong example of a real-world UI product that balances usability, maintainability, and modern frontend design.

---

## Key Features

### Task Management
- Create, update, and delete tasks
- Add title, description, tags, and priority level
- Assign tasks to different workflow columns

### Drag & Drop Workflow
- Move tasks between columns
- Reorder tasks within the same column
- Smooth, intuitive interactions powered by Angular CDK

### Dynamic Column System
- Add custom workflow columns
- Rename columns
- Delete columns when they are no longer needed

### Search & Progress Tracking
- Search tasks by title, description, or tags
- Track completion percentage in real time
- Monitor total tasks and completed tasks at a glance

### Persistence
- Board data is stored in browser localStorage
- State remains available after refresh
- No backend required for core functionality

### User Feedback
- Snackbar notifications for create, update, and delete actions
- Clear interaction feedback for a polished experience

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Angular 17 | Frontend framework |
| TypeScript | Strongly typed application logic |
| Angular Material | UI components and design system |
| Angular CDK | Drag-and-drop functionality |
| Angular Signals | Reactive state management |
| SCSS | Styling and component-level design |
| HTML | App structure |
| LocalStorage | Client-side persistence |

---

## Architecture

```text
User
  │
  ▼
Angular 17 UI
  │
  ├── Board Component
  │   ├── Task Creation & Editing
  │   ├── Drag-and-Drop Handling
  │   ├── Column Management
  │   └── Search + Completion Stats
  │
  ├── Task Dialog
  ├── Confirm Dialog
  │
  ▼
Kanban Service
  │
  ├── Angular Signals State
  ├── Task and Column Updates
  └── LocalStorage Persistence
```

---

## Project Structure

```text
src/
├── app/
│   ├── board/
│   │   └── board.component.ts
│   ├── confirm-dialog/
│   │   └── confirm-dialog.component.ts
│   ├── models/
│   │   └── task.model.ts
│   ├── services/
│   │   └── kanban.service.ts
│   ├── task-dialog/
│   │   └── task-dialog.component.ts
│   ├── app.component.ts
│   └── app.config.ts
├── styles.scss
├── index.html
└── main.ts
```

---

## Interview Talking Points

### 1. Problem Solved
This project solves the common challenge of managing work across multiple stages without a complex backend. It provides a lightweight, efficient Kanban workflow for personal and team productivity.

### 2. Technical Decisions
- Used Angular Signals to simplify state updates and reduce boilerplate
- Used Angular CDK for native drag-and-drop interactions
- Used LocalStorage to persist board state and improve usability
- Kept the app frontend-only to focus on UX and UI engineering

### 3. Core Skills Demonstrated
- Component-based UI development
- State management in Angular
- Form-based task creation and editing
- Dynamic UI updates and user feedback
- Performance-conscious interaction design

### 4. Design Thinking
The product is designed to feel fast, organized, and professional. It avoids unnecessary complexity while maintaining a modern interface and intuitive task workflows.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/Krish02270/Kanban-Board.git
cd Kanban-Board
npm install
```

### Run the App

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

### Production Build

```bash
npm run build
```

---

## Future Improvements

- Cloud sync and multi-user collaboration
- Authentication and user accounts
- Due dates and reminders
- Task comments and attachments
- Advanced analytics and reporting
- Backend API integration
- Dark/light theme customization

---

## Project Goals

This project was created to demonstrate practical front-end development skills for real-world product design, especially in:

- Angular application architecture
- State management
- UI/UX implementation
- Workflow-driven product thinking
- Responsive and interactive web experiences

---

## Author

Built with a focus on modern frontend development and productivity-driven user experience.

GitHub: https://github.com/Krish02270

---

## License

This project is intended for learning, portfolio, and development purposes.

---

<p align="center">
  <img src="https://img.shields.io/badge/Status-Ready%20for%20Interview-00C7B7?style=for-the-badge" alt="Interview ready" />
</p>
