"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { addGoal, fetchGoals } from "../features/goals/goalsSlice";

export default function GoalForm() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [title, setTitle] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const addSubtask = () => {
    if (subtaskInput.trim() && subtasks.length < 10) {
      setSubtasks((prev) => [...prev, subtaskInput.trim()]);
      setSubtaskInput("");
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate || !user?.uid) return;
    if (subtasks.length === 0) {
      alert("Please add at least one subtask.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        addGoal({
          title,
          subtasks,
          completedSubtasks: [],
          startDate,
          endDate,
          progress,
          userId: user.uid,
        })
      ).unwrap();

      await dispatch(fetchGoals(user.uid));

      setTitle("");
      setSubtasks([]);
      setSubtaskInput("");
      setStartDate("");
      setEndDate("");
      setProgress(0);
    } catch (error) {
      console.error("Add goal failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[var(--color-primary)] p-6 rounded-2xl shadow-lg max-w-xl mx-auto"
      aria-labelledby="goal-form-title"
    >
      <label htmlFor="goal-title" className="sr-only">
        Goal Title
      </label>
      <input
        id="goal-title"
        type="text"
        placeholder="Goal Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 p-4 text-base h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
        required
        disabled={loading}
        autoComplete="off"
        aria-required="true"
      />

      <fieldset>
        <legend className="block mb-2 font-medium text-[var(--color-secondary)] text-base">
          Subtasks (max 10)
        </legend>
        <div className="flex gap-2">
          <label htmlFor="subtask-input" className="sr-only">
            Add a subtask
          </label>
          <input
            id="subtask-input"
            type="text"
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            className="flex-grow border border-gray-300 p-3 text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
            disabled={loading || subtasks.length >= 10}
            placeholder={
              subtasks.length >= 10 ? "Max 10 subtasks added" : "Add a subtask"
            }
            aria-label="Subtask input"
            aria-disabled={loading || subtasks.length >= 10}
          />
          <button
            type="button"
            onClick={addSubtask}
            disabled={loading || subtasks.length >= 10 || !subtaskInput.trim()}
            className="bg-[var(--color-accent)] text-[var(--color-primary)] px-4 text-base rounded-md font-semibold hover:brightness-110 transition"
            aria-label="Add subtask"
          >
            Add
          </button>
        </div>
        <ul className="mt-2 list-disc list-inside max-h-40 overflow-y-auto text-[var(--color-text)]">
          {subtasks.map((st, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center text-base"
            >
              <span>{st}</span>
              <button
                type="button"
                onClick={() => removeSubtask(idx)}
                className="text-[var(--color-warning)] font-bold ml-2 hover:text-red-700"
                aria-label={`Remove subtask ${st}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="flex gap-4 flex-col sm:flex-row">
        <label className="flex flex-col w-full" htmlFor="start-date">
          <span className="mb-1 text-sm font-medium text-[var(--color-secondary)]">
            Start Date
          </span>
          <input
            id="start-date"
            type="date"
            value={startDate.split("T")[0] || ""}
            onChange={(e) => {
              const timePart = startDate.split("T")[1] || "00:00";
              setStartDate(
                e.target.value ? `${e.target.value}T${timePart}` : ""
              );
            }}
            className="w-full border border-gray-300 p-3 text-base h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
            required
            disabled={loading}
            aria-required="true"
          />
          <label htmlFor="start-time" className="sr-only">
            Start Time
          </label>
          <input
            id="start-time"
            type="time"
            value={startDate.split("T")[1] || ""}
            onChange={(e) => {
              const datePart = startDate.split("T")[0] || "";
              setStartDate(
                e.target.value ? `${datePart}T${e.target.value}` : ""
              );
            }}
            className="mt-2 w-full border border-gray-300 p-3 text-base h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
            required={!!startDate}
            disabled={loading}
            aria-required="true"
          />
        </label>

        <label className="flex flex-col w-full" htmlFor="end-date">
          <span className="mb-1 text-sm font-medium text-[var(--color-secondary)]">
            End Date
          </span>
          <input
            id="end-date"
            type="date"
            value={endDate.split("T")[0] || ""}
            onChange={(e) => {
              const timePart = endDate.split("T")[1] || "00:00";
              setEndDate(e.target.value ? `${e.target.value}T${timePart}` : "");
            }}
            className="w-full border border-gray-300 p-3 text-base h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
            required
            disabled={loading}
            aria-required="true"
          />
          <label htmlFor="end-time" className="sr-only">
            End Time
          </label>
          <input
            id="end-time"
            type="time"
            value={endDate.split("T")[1] || ""}
            onChange={(e) => {
              const datePart = endDate.split("T")[0] || "";
              setEndDate(e.target.value ? `${datePart}T${e.target.value}` : "");
            }}
            className="mt-2 w-full border border-gray-300 p-3 text-base h-12 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
            required={!!endDate}
            disabled={loading}
            aria-required="true"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 text-lg rounded-md font-semibold transition-colors ${
          loading
            ? "bg-[var(--color-accent)]/60 text-[var(--color-primary)] cursor-not-allowed"
            : "bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-background)]"
        }`}
        aria-busy={loading}
      >
        {loading ? "Adding..." : "Add Goal"}
      </button>
    </form>
  );
}
