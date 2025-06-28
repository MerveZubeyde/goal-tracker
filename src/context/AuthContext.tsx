"use client";

import { createContext, useContext, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser, setLoading } from "@/features/auth/authSlice";
import { RootState, AppDispatch } from "@/store/store";
import { fetchGoals } from "@/features/goals/goalsSlice";

interface AuthContextType {
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        dispatch(
          setUser({
            id: user.uid,
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
          })
        );
      } else {
        dispatch(clearUser());
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchGoals(user.uid));
    }
  }, [user, dispatch]);

  return (
    <AuthContext.Provider value={{ loading }}>
      <div role="status" aria-live="polite" style={{ display: loading ? "block" : "none" }}>
        Loading...
      </div>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthLoading = () => useContext(AuthContext);
