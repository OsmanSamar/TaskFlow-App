import cron from "node-cron";
import db from "../database/database.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "node:crypto";

// Save a notification only if one already unread does not exist.

const saveNotification = (userId, title, message, taskId, type) => {
  const existing = db
    .prepare(
      `
      SELECT id
      FROM notifications
      WHERE user_id = ?
        AND task_id = ?
        AND type = ?
    `,
    )
    .get(userId, taskId, type);

  if (existing) return;

  db.prepare(
    `
    INSERT INTO notifications (
      id, user_id, task_id, title, message, type, is_read, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, 0, ?)
  `,
  ).run(
    crypto.randomUUID(),
    userId,
    taskId,
    title,
    message,
    type,
    new Date().toISOString(),
  );
};

// Check unfinished tasks and create in-app notifications.
const checkTaskNotifications = () => {
  const dates = db
    .prepare(
      `
    SELECT
      date('now') AS today,
      date('now', '+1 day') AS tomorrow
  `,
    )
    .get();

  const tasks = db
    .prepare(
      `
    SELECT id, user_id, text, due_date
    FROM tasks
    WHERE done = 0
      AND due_date IS NOT NULL
      AND date(due_date) <= date('now', '+1 day')
  `,
    )
    .all();

 
  for (const task of tasks) {
    const dueDate = task.due_date.slice(0, 10);

    // Task due today.
    if (dueDate === dates.today) {
      saveNotification(
        task.user_id,
        "Task due today",
        `Your task "${task.text}" is due today.`,
        task.id,
        "task_due_today"
      );
    }

    // Task due tomorrow.
    else if (dueDate === dates.tomorrow) {
      saveNotification(
        task.user_id,
        "Task reminder",
        `Your task "${task.text}" is due tomorrow.`,
        task.id,
        "task_due"
      );
    }

    // Task overdue: yesterday or earlier.
    else if (dueDate < dates.today) {
      saveNotification(
        task.user_id,
        "Overdue task",
        `Your task "${task.text}" is overdue.`,
        task.id,
        "task_overdue"
      );
    }
  }
};

// Send email reminders for tasks due tomorrow, at 9 AM daily.
const sendTaskReminderEmails = async () => {
  const tasks = db
    .prepare(
      `
    SELECT
      tasks.id,
      tasks.text,
      tasks.due_date,
      users.email,
      users.name
    FROM tasks
    JOIN users ON users.id = tasks.user_id
    WHERE tasks.done = 0
      AND date(tasks.due_date) = date('now', '+1 day')
      AND users.task_reminders = 1
  `,
    )
    .all();

  for (const task of tasks) {
    try {
      await sendEmail({
        to: task.email,
        subject: "Task reminder",
        html: `
          <h2>Task reminder</h2>
          <p>Hi ${task.name},</p>
          <p>Your task <strong>${task.text}</strong> is due tomorrow.</p>
          <p>Due date: ${task.due_date}</p>
        `,
      });
    } catch (error) {
      console.error(`Failed to send reminder for task ${task.id}:`, error);
    }
  }
};

// Start both schedules.
export const startTaskReminders = () => {
  // Check for in-app notifications every minute.
  cron.schedule("* * * * *", () => {
    // console.log("Checking in-app task notifications...");
    checkTaskNotifications();
  });

  // Send email reminders at 9 AM every day.
  cron.schedule("0 9 * * *", async () => {
    console.log("Sending task reminder emails...");
    await sendTaskReminderEmails();
  });

  // Run the notification check once at startup so you can test immediately.
  checkTaskNotifications();
};
