"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import { Goal } from "@/features/goals/goalsTypes";
import { useEffect, useState, useMemo } from "react";
import { CheckCircle, Info } from "lucide-react";

function formatGroupKey(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

export default function AchievedGoalsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const goals = useSelector((state: RootState) => state.goals.goals);

  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [infoGoalId, setInfoGoalId] = useState<string | null>(null);

  useEffect(() => {
    if (goals.some((goal) => goal.progress === 100)) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [goals]);

  if (!user) {
    return (
      <main
        className="flex flex-col justify-center items-center min-h-[80vh] px-6 bg-[var(--color-primary)] rounded-3xl shadow-lg max-w-md mx-auto mt-20"
        aria-label="Sign in required"
      >
        <h1 className="text-3xl font-extrabold mb-6 text-[var(--color-secondary)] select-none">
          Achieved Goals
        </h1>
        <p className="text-[var(--color-secondary)] text-center max-w-sm mb-6">
          Please{" "}
          <Link
            href="/signin"
            className="text-[var(--color-accent)] font-semibold hover:underline hover:text-[var(--color-secondary)] transition-colors duration-300"
          >
            sign in
          </Link>{" "}
          to view your achieved goals.
        </p>
      </main>
    );
  }

  const achievedGoals = goals.filter((goal) => goal.progress === 100);

  const groups = useMemo(() => {
    const map = new Map<string, Goal[]>();
    achievedGoals.forEach((goal) => {
      const date = new Date(goal.endDate);
      const groupKey = formatGroupKey(date);
      if (!map.has(groupKey)) map.set(groupKey, []);
      map.get(groupKey)!.push(goal);
    });
    return Array.from(map.entries()).sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateB.getTime() - dateA.getTime();
    });
  }, [achievedGoals]);

  const toggleGroup = (group: string) => {
    setExpandedGroup((prev) => (prev === group ? null : group));
    setInfoGoalId(null);
  };

  const toggleInfo = (goalId: string) => {
    setInfoGoalId((prev) => (prev === goalId ? null : goalId));
  };

  return (
    <main
      className="max-w-5xl mx-auto mt-20 px-6 relative select-none"
      aria-label="Achieved Goals Page"
    >
      <h1 className="text-5xl font-extrabold mb-8 text-center text-[var(--color-secondary)] transition-colors duration-300">
        Achieved Goals
      </h1>

      {showToast && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-4 bg-[var(--color-accent)] text-white px-10 py-8 rounded-3xl shadow-2xl text-4xl font-extrabold animate-toast-pop backdrop-blur-sm">
            <CheckCircle size={48} aria-hidden="true" />
            <span>You did it!</span>
          </div>
          <style jsx>{`
            @keyframes toast-pop {
              0% {
                opacity: 0;
                transform: scale(0.7);
              }
              25% {
                opacity: 1;
                transform: scale(1.1);
              }
              50% {
                transform: scale(1);
              }
              75% {
                transform: scale(1.05);
              }
              100% {
                opacity: 0;
                transform: scale(0.7);
              }
            }
            .animate-toast-pop {
              animation: toast-pop 3s ease-in-out forwards;
            }
          `}</style>
        </div>
      )}

      <nav
        className="flex flex-wrap justify-center gap-3 mb-6"
        aria-label="Months navigation"
        role="navigation"
      >
        {groups.length === 0 && (
          <p className="text-center text-[var(--color-secondary)] mt-10 select-none">
            No achieved goals yet.
          </p>
        )}

        {groups.map(([group]) => {
          const isActive = expandedGroup === group;
          return (
            <button
              key={group}
              onClick={() => toggleGroup(group)}
              className={`whitespace-nowrap px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-300
                ${
                  isActive
                    ? "bg-[var(--color-accent)] text-[var(--color-primary)] shadow-md"
                    : "bg-[var(--color-primary)] text-[var(--color-secondary)] hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-accent)]"
                }`}
              aria-pressed={isActive}
              aria-expanded={isActive}
              aria-controls={`group-panel-${group.replace(/\s/g, "-")}`}
              tabIndex={0}
            >
              {group}
            </button>
          );
        })}
      </nav>

      {expandedGroup && (
        <section
          id={`group-panel-${expandedGroup.replace(/\s/g, "-")}`}
          aria-live="polite"
          aria-label={`${expandedGroup} Achieved Goals`}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          role="region"
        >
          {groups
            .find(([group]) => group === expandedGroup)?.[1]
            .map((goal: Goal) => (
              <article
                key={goal.id}
                className="border border-[var(--color-secondary)] rounded-xl p-4 shadow-sm bg-[var(--color-primary)] hover:shadow-md transition-shadow cursor-default flex items-center justify-between"
                aria-label={`Goal: ${goal.title}`}
                tabIndex={0}
              >
                <span className="font-semibold text-[var(--color-secondary)] truncate max-w-[70%]">
                  {goal.title}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleInfo(goal.id)}
                    aria-label={`Show completion date for ${goal.title}`}
                    className="p-1 rounded hover:bg-[var(--color-primary-hover)] transition-colors"
                  >
                    <Info
                      size={18}
                      className="text-[var(--color-accent)]"
                      aria-hidden="true"
                    />
                  </button>
                  {infoGoalId === goal.id && (
                    <span
                      className="text-xs text-[var(--color-accent)] whitespace-nowrap select-text"
                      role="status"
                    >
                      Completed on:{" "}
                      {new Date(goal.endDate).toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </article>
            ))}
        </section>
      )}
    </main>
  );
}
