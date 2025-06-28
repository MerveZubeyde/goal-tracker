"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { ProfileData, fetchProfile } from "@/features/profile/profileSlice";
import { Goal } from "@/features/goals/goalsTypes";
import { Award, Star, Crown, Info } from "lucide-react";

function LevelInfoTooltip() {
  return (
    <div
      className="w-64 p-4 bg-[var(--color-primary)] bg-opacity-95 border border-[var(--color-secondary)] rounded-lg shadow-lg text-sm text-[var(--color-text)]"
      role="tooltip"
      aria-live="polite"
    >
      <h4 className="font-bold mb-2">Level Criteria</h4>
      <ul className="list-disc list-inside space-y-1">
        <li>
          <span className="font-semibold">Beginner</span>: 0 - 10 completed goals
          <Award className="inline w-4 h-4 text-green-400 ml-1" />
        </li>
        <li>
          <span className="font-semibold">Intermediate</span>: 11 - 25 completed goals
          <Star className="inline w-4 h-4 text-blue-400 ml-1" />
        </li>
        <li>
          <span className="font-semibold">Advanced</span>: 26+ completed goals
          <Crown className="inline w-4 h-4 text-yellow-400 ml-1" />
        </li>
      </ul>
    </div>
  );
}

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const goals = useSelector((state: RootState) => state.goals.goals);

  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    country: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchProfile(user.uid));
    }
  }, [dispatch, user?.uid]);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setIsEditing(false);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("User not authenticated");
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), formData);
      dispatch(fetchProfile(user.uid));
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      setErrorMsg("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const achievedGoalsCount = goals.filter((goal: Goal) => goal.progress === 100).length;
  const ongoingGoalsCount = goals.filter((goal: Goal) => goal.progress < 100).length;

  const getLevel = (count: number) => {
    if (count >= 26)
      return { label: "Advanced", icon: <Crown className="inline w-6 h-6 text-yellow-400" /> };
    if (count >= 11)
      return { label: "Intermediate", icon: <Star className="inline w-6 h-6 text-blue-400" /> };
    return { label: "Beginner", icon: <Award className="inline w-6 h-6 text-green-400" /> };
  };

  const level = getLevel(achievedGoalsCount);

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-14 mt-20 mb-20">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-[var(--color-secondary)] select-none">
        Your Profile
      </h1>
      <section className="bg-[var(--color-primary)] bg-opacity-90 dark:bg-[var(--color-background)] text-[var(--color-text)] p-10 rounded-3xl shadow-2xl border border-[var(--color-secondary)] backdrop-blur-md transition-colors duration-300">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-8" noValidate>
            {errorMsg && <p className="text-[var(--color-warning)] font-semibold text-lg" role="alert">{errorMsg}</p>}
            {successMsg && <p className="text-[var(--color-success)] font-semibold text-lg" role="status">{successMsg}</p>}
            {(['firstName', 'lastName', 'birthDate', 'country', 'city'] as (keyof ProfileData)[]).map((field) => (
              <div key={field} className="relative">
                <label htmlFor={field} className="sr-only">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === 'birthDate' ? 'date' : 'text'}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full border border-[var(--color-secondary)] rounded-2xl px-6 py-5 text-lg bg-transparent text-[var(--color-text)] placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)] transition drop-shadow-md"
                  aria-required="true"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={saving}
              className={`w-full py-5 rounded-2xl font-bold text-xl transition-colors shadow-lg focus:outline-none focus:ring-6 focus:ring-[var(--color-accent)] ${
                saving
                  ? "bg-[var(--color-primary)] cursor-not-allowed opacity-75"
                  : "bg-[var(--color-accent)] hover:brightness-110"
              }`}
              aria-busy={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        ) : (
          <>
            <p className="mb-6 text-3xl font-extrabold text-[var(--color-accent)] drop-shadow">
              Hi, <span className="capitalize">{formData.firstName || "User"}</span>!
            </p>
            <div className="space-y-4 text-lg font-semibold">
              <p>
                <span className="text-[var(--color-secondary)] text-xl">Name:</span>{" "}
                {formData.firstName} {formData.lastName}
              </p>
              <p>
                <span className="text-[var(--color-secondary)] text-xl">Birth Date:</span>{" "}
                {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString() : "-"}
              </p>
              <p>
                <span className="text-[var(--color-secondary)] text-xl">Location:</span>{" "}
                {formData.city || "-"}, {formData.country || "-"}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-xl font-semibold">Your Level:</span>
              <div className="flex items-center gap-2 relative">
                {level.icon}
                <span className="font-bold">{level.label}</span>
                <button
                  type="button"
                  onClick={() => setShowTooltip((prev) => !prev)}
                  onBlur={() => setShowTooltip(false)}
                  className="ml-2 p-1 rounded-full hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] transition focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  aria-label="Show level criteria"
                  aria-pressed={showTooltip}
                  aria-haspopup="true"
                  aria-expanded={showTooltip}
                >
                  <Info className="w-5 h-5" />
                </button>
                {showTooltip && (
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <LevelInfoTooltip />
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="mt-8 px-10 py-4 bg-[var(--color-accent)] text-white rounded-3xl font-semibold text-lg shadow-lg hover:bg-opacity-90 transition focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]"
              aria-label="Edit profile"
            >
              Change
            </button>
          </>
        )}
      </section>
      <section className="bg-[var(--color-primary)] bg-opacity-70 rounded-3xl shadow-xl border border-[var(--color-secondary)] p-8 flex justify-between items-center transition-colors duration-300">
        <h2 className="text-3xl font-bold text-[var(--color-secondary)]">Achieved Goals</h2>
        <span className="text-[var(--color-accent)] font-extrabold text-4xl" aria-live="polite">{achievedGoalsCount}</span>
      </section>
      <section className="bg-[var(--color-primary)] bg-opacity-70 rounded-3xl shadow-xl border border-[var(--color-secondary)] p-8 flex justify-between items-center transition-colors duration-300">
        <h2 className="text-3xl font-bold text-[var(--color-secondary)]">Ongoing Goals</h2>
        <span className="text-[var(--color-accent)] font-extrabold text-4xl" aria-live="polite">{ongoingGoalsCount}</span>
      </section>
    </div>
  );
}
