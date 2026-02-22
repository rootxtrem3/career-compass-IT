import { z } from 'zod';
import {
  bootstrapPathChecklist,
  listChecklist,
  listUserAnalysisHistory,
  setChecklistCompletion
} from '../services/trackingService.js';
import { HttpError } from '../utils/httpError.js';

const bootstrapSchema = z.object({
  careerId: z.number().int().positive()
});

const updateSchema = z.object({
  completed: z.boolean()
});

export async function getMyHistory(req, res) {
  if (!req.user?.sub) {
    throw new HttpError(401, 'Authentication required');
  }

  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const data = await listUserAnalysisHistory(req.user.sub, limit);

  res.json({ success: true, data });
}

export async function postChecklistBootstrap(req, res) {
  if (!req.user?.sub) {
    throw new HttpError(401, 'Authentication required');
  }

  const parsed = bootstrapSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid checklist bootstrap payload', parsed.error.flatten());
  }

  const data = await bootstrapPathChecklist(req.user.sub, parsed.data.careerId);
  res.status(201).json({ success: true, data });
}

export async function getChecklistItems(req, res) {
  if (!req.user?.sub) {
    throw new HttpError(401, 'Authentication required');
  }

  const careerId = req.query.careerId ? Number(req.query.careerId) : null;
  const data = await listChecklist(req.user.sub, careerId);
  res.json({ success: true, data });
}

export async function patchChecklistItem(req, res) {
  if (!req.user?.sub) {
    throw new HttpError(401, 'Authentication required');
  }

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Invalid checklist update payload', parsed.error.flatten());
  }

  const itemId = Number(req.params.itemId);
  const data = await setChecklistCompletion(req.user.sub, itemId, parsed.data.completed);
  res.json({ success: true, data });
}
