'use client';

import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import GoalList from '@/components/GoalList';
import { RootState } from '@/store/store';
import ConfettiExplosion from '@/components/ConfettiExplosion';

export default function OngoingGoalsPage() {
  const goals = useSelector((state: RootState) => state.goals.goals);
  const [showCelebrateAnimation, setShowCelebrateAnimation] = useState(false);
  const prevGoalsRef = useRef<typeof goals>([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
     
      prevGoalsRef.current = goals;
      isFirstRender.current = false;
      return;
    }

    const prevCompletedIds = prevGoalsRef.current
      .filter(g => g.progress === 100)
      .map(g => g.id);

    
    const currentCompletedIds = goals
      .filter(g => g.progress === 100)
      .map(g => g.id);

   
    const newlyCompleted = currentCompletedIds.filter(id => !prevCompletedIds.includes(id));

    if (newlyCompleted.length > 0) {
      setShowCelebrateAnimation(true);
      const timer = setTimeout(() => {
        setShowCelebrateAnimation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    prevGoalsRef.current = goals;
  }, [goals]);

  return (
    <>
      <main
        className={`max-w-3xl mx-auto mt-20 px-6 sm:px-6 lg:px-8 relative transition-all duration-500 ${
          showCelebrateAnimation ? 'brightness-125' : 'brightness-100'
        }`}
      >
        <h1 className="text-5xl font-extrabold mb-8 text-center text-[var(--color-secondary)] select-none transition-colors duration-300">
          Ongoing Goals
        </h1>
        <GoalList filter="ongoing" />

        {showCelebrateAnimation && <ConfettiExplosion />}
      </main>
    </>
  );
}
