import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export interface ProfileData {
  firstName: string;
  lastName: string;
  birthDate: string;
  country: string;
  city: string;
}

interface ProfileState {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (uid: string, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as ProfileData;
      } else {
        return null;
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Profile fetch failed");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<ProfileData | null>) => {
          state.profile = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
