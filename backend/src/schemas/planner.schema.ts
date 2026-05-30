import { z } from 'zod';

export const PlannerSchema = z.object({
  weeklyPlan: z.array(
    z.object({
      day: z.string(),
      tasks: z.array(
        z.object({
          timeBlock: z.string(),
          activity: z.string(),
          type: z.string(),
          priority: z.enum(['hard', 'medium', 'easy', 'none']).optional(),
        })
      ),
    })
  ),
  notes: z.string().optional(),
});

export type PlannerType = z.infer<typeof PlannerSchema>;
