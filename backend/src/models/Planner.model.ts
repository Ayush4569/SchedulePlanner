import mongoose, { Schema, Document } from 'mongoose';

export interface ITask {
  timeBlock: string;
  activity: string;
  type: 'study' | 'break' | 'routine' | 'other';
  priority?: 'hard' | 'medium' | 'easy' | 'none';
}

export interface IDayPlan {
  day: string;
  tasks: ITask[];
}

export interface IPlanner extends Document {
  weeklyPlan: IDayPlan[];
  notes?: string;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  timeBlock: { type: String, required: true },
  activity: { type: String, required: true },
  type: { type: String, required: true },
  priority: { type: String, enum: ['hard', 'medium', 'easy', 'none'] },
});

const DayPlanSchema = new Schema<IDayPlan>({
  day: { type: String, required: true },
  tasks: [TaskSchema],
});

const PlannerSchema = new Schema<IPlanner>({
  weeklyPlan: [DayPlanSchema],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPlanner>('Planner', PlannerSchema);
