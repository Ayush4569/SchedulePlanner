import type { Request, Response } from 'express';
import { extractTextFromPdf } from '../services/pdf.service.js';
import { generateWeeklyPlanner } from '../services/gemini.service.js';
import Planner from '../models/Planner.model.js';

export const generatePlanner = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const extractedText = await extractTextFromPdf(req.file.buffer);

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the PDF' });
    }

    const validatedPlanner = await generateWeeklyPlanner(extractedText);

    try {
      const plannerDoc = new Planner({
        weeklyPlan: validatedPlanner.weeklyPlan,
        notes: validatedPlanner.notes,
      });
      await plannerDoc.save();
    } catch (dbError) {
      console.error('Error saving planner to database:', dbError);
    }

    return res.status(200).json({ planner: validatedPlanner });

  } catch (error: any) {
    console.error('Error generating planner:', error);
    return res.status(500).json({ error: error.message || 'An error occurred while generating the planner' });
  }
};

export const getPlanners = async (req: Request, res: Response) => {
  try {
    const planners = await Planner.find().sort({ createdAt: -1 });
    return res.status(200).json({ planners });
  } catch (error: any) {
    console.error('Error fetching planners:', error);
    return res.status(500).json({ error: error.message || 'An error occurred while fetching planners' });
  }
};
