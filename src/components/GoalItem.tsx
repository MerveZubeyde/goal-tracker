"use client";

import { Goal } from "@/features/goals/goalsTypes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  updateProgressLocally,
  updateGoalProgress,
  updateGoalSubtasks,
} from "@/features/goals/goalsSlice";
import { useState, useEffect } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";

interface Props {
  goal: Goal;
}

export default function GoalItem({ goal }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [completedSubtasks, setCompletedSubtasks] = useState<string[]>(
    goal.completedSubtasks || []
  );
  const [subtasks, setSubtasks] = useState<string[]>(goal.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    setCompletedSubtasks(goal.completedSubtasks || []);
    setSubtasks(goal.subtasks || []);
  }, [goal.completedSubtasks, goal.subtasks]);

  const handleCheckboxChange = async (subtask: string) => {
    let newCompleted: string[];
    if (completedSubtasks.includes(subtask)) {
      newCompleted = completedSubtasks.filter((s) => s !== subtask);
    } else {
      newCompleted = [...completedSubtasks, subtask];
    }
    setCompletedSubtasks(newCompleted);
    dispatch(
      updateProgressLocally({
        goalId: goal.id!,
        completedSubtasks: newCompleted,
      })
    );
    try {
      await dispatch(
        updateGoalProgress({
          goalId: goal.id!,
          subtasksCompleted: newCompleted,
        })
      ).unwrap();
    } catch (error) {
      // error handling
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    const updatedSubtasks = [...subtasks, newSubtask.trim()];
    setSubtasks(updatedSubtasks);
    setNewSubtask("");
    try {
      await dispatch(
        updateGoalSubtasks({ goalId: goal.id!, subtasks: updatedSubtasks })
      ).unwrap();
    } catch (error) {
      // error handling
    }
  };

  const handleDeleteSubtask = async (index: number) => {
    const subtaskToDelete = subtasks[index];
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    const updatedCompleted = completedSubtasks.filter(
      (sub) => sub !== subtaskToDelete
    );
    setSubtasks(updatedSubtasks);
    setCompletedSubtasks(updatedCompleted);
    try {
      await dispatch(
        updateGoalSubtasks({ goalId: goal.id!, subtasks: updatedSubtasks })
      ).unwrap();
      await dispatch(
        updateGoalProgress({
          goalId: goal.id!,
          subtasksCompleted: updatedCompleted,
        })
      ).unwrap();
    } catch (error) {
      // error handling
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(subtasks[index]);
  };

  const saveEditing = async () => {
    if (editingIndex === null) return;
    if (!editingText.trim()) return;

    const updatedSubtasks = [...subtasks];
    updatedSubtasks[editingIndex] = editingText.trim();
    setSubtasks(updatedSubtasks);
    setEditingIndex(null);
    setEditingText("");
    try {
      await dispatch(
        updateGoalSubtasks({ goalId: goal.id!, subtasks: updatedSubtasks })
      ).unwrap();
    } catch (error) {
      // error handling
    }
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingText("");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article
      className="bg-[var(--color-primary)] border border-[var(--color-secondary)] rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 dark:bg-background-dark dark:border-gray-700"
      aria-labelledby={`goal-title-${goal.id}`}
    >
      <div className="flex-1 space-y-3">
        <h3
          id={`goal-title-${goal.id}`}
          className="text-lg font-semibold text-[var(--color-secondary)] dark:text-text-dark"
        >
          {goal.title}
        </h3>
        {goal.description && (
          <p className="text-sm text-[var(--color-accent)] dark:text-gray-300">
            {goal.description}
          </p>
        )}
        <p className="text-sm text-[var(--color-secondary)] dark:text-gray-400">
          <time dateTime={goal.startDate}>
            <strong>Start:</strong> {formatDate(goal.startDate)}
          </time>{" "}
          —{" "}
          <time dateTime={goal.endDate}>
            <strong>End:</strong> {formatDate(goal.endDate)}
          </time>
        </p>

        <section aria-labelledby={`subtasks-title-${goal.id}`} className="mt-3">
          <h4
            id={`subtasks-title-${goal.id}`}
            className="font-semibold mb-2 text-[var(--color-secondary)] dark:text-[var(--color-accent)]"
          >
            Subtasks:
          </h4>
          <ul className="space-y-2">
            {subtasks.map((subtask, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`${goal.id}-subtask-${index}`}
                    checked={completedSubtasks.includes(subtask)}
                    onChange={() => handleCheckboxChange(subtask)}
                    className="cursor-pointer"
                    aria-checked={completedSubtasks.includes(subtask)}
                    aria-labelledby={`${goal.id}-subtask-label-${index}`}
                  />
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="border border-[var(--color-secondary)] rounded px-2 py-1 flex-1 text-[var(--color-text)] bg-[var(--color-primary)] dark:bg-background-dark dark:text-text-dark"
                      aria-label="Edit subtask text"
                    />
                  ) : (
                    <label
                      id={`${goal.id}-subtask-label-${index}`}
                      htmlFor={`${goal.id}-subtask-${index}`}
                      className={
                        completedSubtasks.includes(subtask)
                          ? "line-through text-gray-400"
                          : "text-[var(--color-text)]"
                      }
                    >
                      {subtask}
                    </label>
                  )}
                </div>

                {editingIndex === index ? (
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={saveEditing}
                      className="p-1 rounded hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] text-[var(--color-accent)] transition"
                      aria-label="Save subtask edit"
                      title="Save"
                      type="button"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1 rounded hover:bg-[var(--color-warning)] hover:text-[var(--color-primary)] text-[var(--color-warning)] transition"
                      aria-label="Cancel subtask edit"
                      title="Cancel"
                      type="button"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => startEditing(index)}
                      className="p-1 rounded hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] text-[var(--color-secondary)] transition"
                      aria-label={`Edit subtask ${subtask}`}
                      title="Edit"
                      type="button"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteSubtask(index)}
                      className="p-1 rounded hover:bg-[var(--color-warning)] hover:text-[var(--color-primary)] text-[var(--color-warning)] transition"
                      aria-label={`Delete subtask ${subtask}`}
                      title="Delete"
                      type="button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddSubtask();
            }}
            aria-label="Add new subtask"
          >
            <label htmlFor={`new-subtask-${goal.id}`} className="sr-only">
              New subtask text
            </label>
            <input
              id={`new-subtask-${goal.id}`}
              type="text"
              placeholder="Add new subtask"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="border border-[var(--color-secondary)] rounded px-3 py-1 flex-1 text-[var(--color-text)] bg-[var(--color-primary)] dark:bg-background-dark dark:text-text-dark"
              aria-required="false"
            />
            <button
              className="bg-[var(--color-accent)] text-[var(--color-primary)] px-4 rounded font-semibold hover:brightness-110 transition"
              aria-label="Add new subtask"
              type="submit"
            >
              Add
            </button>
          </form>
        </section>

        <div
          className="w-full bg-[var(--color-secondary)] rounded-full h-3 mt-4 dark:bg-gray-700"
          aria-label={`Progress: ${goal.progress} percent`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={goal.progress}
        >
          <div
            className="bg-[var(--color-accent)] h-3 rounded-full transition-all duration-300"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        <p className="text-sm text-[var(--color-accent)] mt-1 font-semibold">
          Progress: {goal.progress}%
        </p>
      </div>
    </article>
  );
}
