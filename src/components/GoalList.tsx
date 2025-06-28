'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import GoalItem from './GoalItem';

interface Props {
  filter: 'achieved' | 'ongoing';
}

export default function GoalList({ filter }: Props) {
  const goals = useSelector((state: RootState) => state.goals.goals);
  const user = useSelector((state: RootState) => state.auth.user);

  const filteredGoals = goals.filter(goal =>
    user && goal.userId === user.uid &&
    (filter === 'achieved' ? goal.progress === 100 : goal.progress < 100)
  );

  if (filteredGoals.length === 0) {
    return (
      <p
        className="mt-6 text-center text-[#778da9] select-none"
        role="status"
        aria-live="polite"
      >
        No goals to display.
      </p>
    );
  }

  return (
    <ul className="space-y-5 mt-6" aria-label="Goal list">
      {filteredGoals.map(goal => (
        <li key={goal.id}>
          <GoalItem goal={goal} />
        </li>
      ))}
    </ul>
  );
}
