# Personal Notebook Setup Guide

A beautiful React-based personal productivity app with task management, focus tracking, and mood monitoring.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- **React 19** - UI framework
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Testing Library & Jest** - Testing (already included with CRA)

### 2. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 3. Run Tests

```bash
npm test
```

### 4. Build for Production

```bash
npm build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Backlog.jsx              # Task backlog management
│   ├── TodayTasks.jsx           # Today's task list
│   ├── FocusBlocks.jsx          # Pomodoro-style focus timer
│   ├── MoodTracker.jsx          # Daily mood logging
│   └── DashboardInsights.jsx    # Analytics and charts
├── hooks/
│   └── useLocalStorage.js       # Custom hook for persistent state
├── utils/
│   └── dataHelpers.js           # Utility functions
├── pages/
│   └── Dashboard.jsx            # Main dashboard page
├── tests/
│   ├── App.test.js
│   ├── useLocalStorage.test.js
│   └── dataHelpers.test.js
├── App.js                       # Main app component with theme toggle
└── index.css                    # Tailwind configuration
```

## ✨ Features

### 📋 Task Management
- **Backlog**: Add tasks with priority levels (high, medium, low)
- **Today's Tasks**: Move tasks from backlog to today's focus
- **Completion Tracking**: Check off completed tasks with visual progress

### ⏱️ Focus Blocks
- Pomodoro-style timer (25, 45, or 60 minutes)
- Track completed focus sessions
- Visual countdown with animated progress ring

### 😊 Mood Tracker
- Log daily mood (1-5 scale with emojis)
- Add notes about your mood
- View mood trends over time

### 📊 Dashboard Insights
- **Productivity Score**: Combined metric of tasks and mood
- **Task Completion Chart**: 7-day bar chart
- **Mood Trend**: 7-day line chart
- **Priority Distribution**: Pie chart of task priorities

### 🌓 Theme Toggle
- Light/Dark mode with smooth transitions
- Persistent theme preference
- Accessible theme toggle button

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize these values
      }
    }
  }
}
```

### Animations
Framer Motion animations can be customized in each component. Look for `motion` components and their props.

## 💾 Data Persistence

All data is stored in browser localStorage:
- Tasks
- Mood entries
- Focus blocks
- Theme preference

Data persists across sessions but is local to each browser.

## 🧪 Testing

The project includes:
- Component tests
- Hook tests
- Utility function tests

Run tests in watch mode:
```bash
npm test
```

## 🛠️ Technologies

- **React 19** - Latest React with improved performance
- **Create React App** - Zero-config setup
- **TailwindCSS 3** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **Recharts** - Composable charting library
- **React Testing Library** - Modern testing utilities

## 📝 Notes

- The CSS warnings about `@tailwind` and `@apply` are expected and will not affect functionality
- TailwindCSS processes these directives during build
- All data is stored locally in the browser
- No backend or database required

## 🚀 Next Steps

Consider adding:
- Export/import data functionality
- Weekly/monthly reports
- Task categories or tags
- Recurring tasks
- Cloud sync with backend
- Mobile responsive improvements
- PWA support for offline use

Enjoy your Personal Notebook! 📓✨
