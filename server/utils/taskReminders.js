import cron from "node-cron";
import db from "../database/database.js";
import { sendEmail } from "../utils/sendEmail.js";

// Check every day for tasks that are due tomorrow and send reminders.
export const startTaskReminders = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Checking task reminders...");

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
        WHERE
          tasks.done = 0
          AND tasks.due_date = date('now', '+1 day')
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
  });
};
