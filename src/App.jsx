import { useEffect, useState } from "react";
import "./App.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const initialWeeklyPlan = {
  Monday: "",
  Tuesday: "",
  Wednesday: "",
  Thursday: "",
  Friday: "",
};

function loadSavedData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [tasks, setTasks] = useState(() =>
    loadSavedData("teachflow-tasks", [])
  );
  const [taskText, setTaskText] = useState("");

  const [lessons, setLessons] = useState(() =>
    loadSavedData("teachflow-lessons", [])
  );
  const [lessonTitle, setLessonTitle] = useState("");
  const [grade, setGrade] = useState("Grade 1");
  const [subject, setSubject] = useState("Math");

  const [weeklyPlan, setWeeklyPlan] = useState(() => ({
    ...initialWeeklyPlan,
    ...loadSavedData("teachflow-weekly", initialWeeklyPlan),
  }));

  useEffect(() => {
    localStorage.setItem("teachflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("teachflow-lessons", JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem("teachflow-weekly", JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = tasks.filter((task) => !task.completed).length;
  const plannedDays = days.filter((day) => weeklyPlan[day].trim()).length;

  function addTask(event) {
    event.preventDefault();

    if (taskText.trim() === "") return;

    const newTask = {
      id: crypto.randomUUID(),
      text: taskText.trim(),
      completed: false,
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
    setTaskText("");
  }

  function completeTask(id) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  }

  function addLesson(event) {
    event.preventDefault();

    if (lessonTitle.trim() === "") return;

    const newLesson = {
      id: crypto.randomUUID(),
      title: lessonTitle.trim(),
      grade,
      subject,
    };

    setLessons((previousLessons) => [...previousLessons, newLesson]);
    setLessonTitle("");
  }

  function deleteLesson(id) {
    setLessons((previousLessons) =>
      previousLessons.filter((lesson) => lesson.id !== id)
    );
  }

  function updateWeeklyPlan(day, value) {
    setWeeklyPlan((previousPlan) => ({
      ...previousPlan,
      [day]: value,
    }));
  }

  const navigation = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Lesson Plans", icon: "📚" },
    { name: "Weekly Planner", icon: "📅" },
    { name: "My Tasks", icon: "✅" },
  ];

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">
          TeachFlow<span>.</span>
        </h2>

        <p className="nav-label">MENU</p>

        <nav className="navigation">
          {navigation.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <span className="note-flower">🌷</span>
          <p>Small steps make great things.</p>
          <small>Made for inspired teachers.</small>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR TEACHING SPACE</p>
            <h1>Good morning, Alba! 🌸</h1>
            <p className="subtitle">
              Let's make today a great day for learning.
            </p>
          </div>

          <div className="profile">A</div>
        </header>

        {/* DASHBOARD */}
        {activePage === "Dashboard" && (
          <div className="page-content">
            <section className="overview">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">AT A GLANCE</p>
                  <h2>Today's overview</h2>
                </div>
              </div>

              <div className="overview-grid">
                <article className="overview-card">
                  <span className="card-icon">📚</span>
                  <h3>{lessons.length}</h3>
                  <p>Lessons planned</p>
                </article>

                <article className="overview-card">
                  <span className="card-icon">✅</span>
                  <h3>{completedTasks}</h3>
                  <p>Tasks completed</p>
                </article>

                <article className="overview-card">
                  <span className="card-icon">📝</span>
                  <h3>{remainingTasks}</h3>
                  <p>Tasks remaining</p>
                </article>
              </div>
            </section>

            <section className="welcome-card">
              <div>
                <p className="eyebrow">A LITTLE REMINDER</p>
                <h2>You're making a difference.</h2>
                <p>
                  Every lesson is a chance to inspire a curious mind.
                </p>
              </div>
              <span className="welcome-flower">✿</span>
            </section>

            <section className="bottom-section">
              <div className="content-card">
                <div className="card-heading">
                  <div>
                    <h2>This week's planner</h2>
                    <p>{plannedDays} of 5 days planned</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setActivePage("Weekly Planner")}
                  >
                    View all →
                  </button>
                </div>

                <div className="weekly-preview">
                  {days.map((day) => (
                    <div className="preview-row" key={day}>
                      <span className="day-badge">
                        {day.slice(0, 3)}
                      </span>

                      <p>
                        {weeklyPlan[day].trim() ||
                          "Nothing planned yet"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-card">
                <div className="card-heading">
                  <div>
                    <h2>My tasks</h2>
                    <p>{remainingTasks} tasks remaining</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setActivePage("My Tasks")}
                  >
                    View all →
                  </button>
                </div>

                {tasks.filter((task) => !task.completed).length === 0 ? (
                  <div className="empty-state">
                    <span>🌼</span>
                    <p>All caught up! Enjoy your day.</p>
                  </div>
                ) : (
                  <ul className="dashboard-task-list">
                    {tasks
                      .filter((task) => !task.completed)
                      .slice(0, 5)
                      .map((task) => (
                        <li key={task.id}>
                          <span className="task-dot" />
                          {task.text}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        )}

        {/* LESSON PLANS */}
        {activePage === "Lesson Plans" && (
          <div className="page-content">
            <div className="page-heading">
              <p className="eyebrow">PLAN WITH PURPOSE</p>
              <h2>Lesson Plans 📚</h2>
              <p>Create and organize lessons for your classes.</p>
            </div>

            <section className="content-card">
              <h3 className="form-title">Create a new lesson</h3>

              <form onSubmit={addLesson} className="lesson-form">
                <div className="form-group full-width">
                  <label htmlFor="lesson-title">Lesson title</label>
                  <input
                    id="lesson-title"
                    type="text"
                    placeholder="e.g. Introduction to Fractions"
                    value={lessonTitle}
                    onChange={(event) =>
                      setLessonTitle(event.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lesson-grade">Grade</label>
                  <select
                    id="lesson-grade"
                    value={grade}
                    onChange={(event) => setGrade(event.target.value)}
                  >
                    <option>Grade 1</option>
                    <option>Grade 2</option>
                    <option>Grade 3</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="lesson-subject">Subject</label>
                  <select
                    id="lesson-subject"
                    value={subject}
                    onChange={(event) =>
                      setSubject(event.target.value)
                    }
                  >
                    <option>Math</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>Other</option>
                  </select>
                </div>

                <button className="primary-button full-width" type="submit">
                  + Add Lesson
                </button>
              </form>
            </section>

            <section className="content-card">
              <div className="card-heading">
                <h2>Saved lessons</h2>
                <span className="count-badge">{lessons.length}</span>
              </div>

              {lessons.length === 0 ? (
                <div className="empty-state">
                  <span>📖</span>
                  <p>No lessons yet. Create your first lesson above!</p>
                </div>
              ) : (
                <div className="lesson-list">
                  {lessons.map((lesson) => (
                    <div className="lesson-item" key={lesson.id}>
                      <div className="lesson-icon">📘</div>

                      <div className="lesson-details">
                        <h3>{lesson.title}</h3>
                        <div className="lesson-tags">
                          <span>{lesson.grade}</span>
                          <span>{lesson.subject}</span>
                        </div>
                      </div>

                      <button
                        className="delete-button"
                        onClick={() => deleteLesson(lesson.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* WEEKLY PLANNER */}
        {activePage === "Weekly Planner" && (
          <div className="page-content">
            <div className="page-heading">
              <p className="eyebrow">YOUR WEEK, YOUR WAY</p>
              <h2>Weekly Planner 📅</h2>
              <p>Write down what you'll teach each day.</p>
            </div>

            <section className="content-card">
              <div className="card-heading">
                <div>
                  <h2>Monday – Friday</h2>
                  <p>Your plans save automatically as you type.</p>
                </div>
                <span className="count-badge">{plannedDays}/5</span>
              </div>

              <div className="weekly-grid">
                {days.map((day) => (
                  <div className="day-card" key={day}>
                    <div className="day-header">
                      <label htmlFor={`plan-${day}`}>{day}</label>

                      <span className="day-status">
                        {weeklyPlan[day].trim()
                          ? "✓ Planned"
                          : "Not planned"}
                      </span>
                    </div>

                    <textarea
                      id={`plan-${day}`}
                      rows={4}
                      placeholder={`What will you teach on ${day}?`}
                      value={weeklyPlan[day]}
                      onChange={(event) =>
                        updateWeeklyPlan(day, event.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* MY TASKS */}
        {activePage === "My Tasks" && (
          <div className="page-content">
            <div className="page-heading">
              <p className="eyebrow">STAY ON TRACK</p>
              <h2>My Tasks ✅</h2>
              <p>Keep track of everything you need to do.</p>
            </div>

            <section className="content-card">
              <form onSubmit={addTask} className="task-form">
                <input
                  type="text"
                  placeholder="What do you need to do?"
                  value={taskText}
                  onChange={(event) => setTaskText(event.target.value)}
                />

                <button className="primary-button" type="submit">
                  + Add Task
                </button>
              </form>

              <div className="task-summary">
                <span>{tasks.length} total</span>
                <span>{completedTasks} completed</span>
                <span>{remainingTasks} remaining</span>
              </div>

              {tasks.length === 0 ? (
                <div className="empty-state">
                  <span>✨</span>
                  <p>No tasks yet. Add your first task above!</p>
                </div>
              ) : (
                <ul className="task-list">
                  {tasks.map((task) => (
                    <li className="task-item" key={task.id}>
                      <button
                        type="button"
                        className={`check-button ${
                          task.completed ? "checked" : ""
                        }`}
                        onClick={() => completeTask(task.id)}
                        aria-label={
                          task.completed
                            ? "Mark task incomplete"
                            : "Mark task complete"
                        }
                      >
                        {task.completed ? "✓" : ""}
                      </button>

                      <span
                        className={`task-text ${
                          task.completed ? "completed" : ""
                        }`}
                      >
                        {task.text}
                      </span>

                      <button
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        <footer className="footer">
          Made with ♡ for teachers everywhere · TeachFlow
        </footer>
      </main>
    </div>
  );
}

export default App;