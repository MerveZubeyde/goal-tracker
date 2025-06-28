import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { Goal } from './goalsTypes'

interface GoalsState {
  goals: Goal[]
  loading: boolean
  error: string | null
}

const initialState: GoalsState = {
  goals: [],
  loading: false,
  error: null,
}

export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (userId: string) => {
    const goalsRef = collection(db, 'goals')
    const q = query(goalsRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)

    const goals: Goal[] = []
    querySnapshot.forEach((docSnap) => {
      goals.push({ id: docSnap.id, ...(docSnap.data() as Omit<Goal, 'id'>) })
    })
    return goals
  }
)

export const addGoal = createAsyncThunk(
  'goals/addGoal',
  async (goal: Omit<Goal, 'id'>) => {
    const docRef = await addDoc(collection(db, 'goals'), goal)
    return { id: docRef.id, ...goal }
  }
)

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (id: string) => {
    await deleteDoc(doc(db, 'goals', id))
    return id
  }
)

export const updateGoalProgress = createAsyncThunk(
  'goals/updateGoalProgress',
  async ({
    goalId,
    subtasksCompleted,
  }: {
    goalId: string
    subtasksCompleted: string[]
  }) => {
    const goalDocRef = doc(db, 'goals', goalId)

   
    await updateDoc(goalDocRef, {
      completedSubtasks: subtasksCompleted,
      progress:
        subtasksCompleted.length > 0
          ? Math.round(
              (subtasksCompleted.length /
                (subtasksCompleted.length ? subtasksCompleted.length : 1)) * 100
            )
          : 0,
    })

    return { goalId, subtasksCompleted }
  }
)

export const updateGoalSubtasks = createAsyncThunk(
  'goals/updateGoalSubtasks',
  async ({ goalId, subtasks }: { goalId: string; subtasks: string[] }) => {
    const goalDocRef = doc(db, 'goals', goalId)
    await updateDoc(goalDocRef, { subtasks })
    return { goalId, subtasks }
  }
)

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    updateProgressLocally: (
      state,
      action: PayloadAction<{ goalId: string; completedSubtasks: string[] }>
    ) => {
      const { goalId, completedSubtasks } = action.payload
      const goal = state.goals.find((g) => g.id === goalId)
      if (goal && goal.subtasks) {
        goal.completedSubtasks = completedSubtasks
        goal.progress = Math.round(
          (completedSubtasks.length / goal.subtasks.length) * 100
        )
      }
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.goals = action.payload
        state.loading = false
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch goals.'
      })

      .addCase(addGoal.pending, (state) => {
        state.error = null
      })
      .addCase(addGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.goals.push(action.payload)
      })
      .addCase(addGoal.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add goal.'
      })

      .addCase(deleteGoal.pending, (state) => {
        state.error = null
      })
      .addCase(deleteGoal.fulfilled, (state, action: PayloadAction<string>) => {
        state.goals = state.goals.filter((goal) => goal.id !== action.payload)
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete goal.'
      })

      .addCase(updateGoalProgress.fulfilled, (state, action) => {
        const { goalId, subtasksCompleted } = action.payload
        const goal = state.goals.find((g) => g.id === goalId)
        if (goal && goal.subtasks) {
          goal.completedSubtasks = subtasksCompleted
          goal.progress = Math.round(
            (subtasksCompleted.length / goal.subtasks.length) * 100
          )
        }
      })

      
      .addCase(updateGoalSubtasks.fulfilled, (state, action) => {
        const { goalId, subtasks } = action.payload
        const goal = state.goals.find((g) => g.id === goalId)
        if (goal) {
          goal.subtasks = subtasks
          
        }
      })
  },
})

export const { updateProgressLocally } = goalsSlice.actions
export default goalsSlice.reducer
