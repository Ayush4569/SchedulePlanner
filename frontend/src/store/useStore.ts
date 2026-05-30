import { create } from 'zustand';

export type TaskType = 'study' | 'break' | 'routine' | 'other' | string;
export type TaskPriority = 'hard' | 'medium' | 'easy' | 'none';

export interface Task {
  timeBlock: string;
  activity: string;
  type: TaskType;
  priority?: TaskPriority;
}

export interface DayPlan {
  day: string;
  tasks: Task[];
}

export interface PlannerData {
  weeklyPlan: DayPlan[];
  notes?: string;
}

interface PlannerState {
  planner: PlannerData | null;
  isLoading: boolean;
  setPlanner: (planner: PlannerData) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useStore = create<PlannerState>((set) => ({
  planner: null,
  isLoading: false,
  setPlanner: (planner) => set({ planner }),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ planner: null, isLoading: false }),
}));
