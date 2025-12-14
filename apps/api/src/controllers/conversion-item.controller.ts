import { type RequestHandler } from 'express';

// Returns a static list for now; replace with DB-backed fetch when ready.
export const getConversionItems: RequestHandler = async (_req, res) => {
  res.json([]);
};
