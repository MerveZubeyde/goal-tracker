'use client';

import GoalForm from '@/components/GoalForm';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

export default function AddGoalPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <main
        className="flex flex-col justify-center items-center min-h-[80vh] px-4 sm:px-6 bg-[var(--color-primary)] rounded-3xl shadow-lg max-w-md mx-auto mt-20"
        aria-labelledby="add-goal-title"
      >
        <h1
          id="add-goal-title"
          className="text-3xl font-extrabold mb-6 text-[var(--color-secondary)] select-none"
        >
          Add New Goal
        </h1>
        <p className="text-[var(--color-secondary)] text-center max-w-sm mb-6">
          You need to{' '}
          <Link
            href="/signin"
            className="text-[var(--color-accent)] font-semibold hover:underline hover:text-[var(--color-secondary)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            sign in
          </Link>{' '}
          to add a new goal.
        </p>
      </main>
    );
  }

  return (
    <main
      className="max-w-2xl min-h-[70vh] mx-auto mt-10 sm:mt-14 px-4 sm:px-8 pb-16 pt-8 sm:pt-10 bg-[var(--color-primary)] rounded-3xl shadow-2xl transition-colors duration-300 flex flex-col justify-start relative overflow-hidden"
      aria-labelledby="add-goal-title"
    >
      <div className="relative z-10 w-full">
        <h1
          id="add-goal-title"
          className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-[var(--color-secondary)] select-none"
        >
          Add New Goal
        </h1>
        <GoalForm />
      </div>
      <style jsx>{`
        @keyframes flash-glow {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
      `}</style>
    </main>
  );
}
