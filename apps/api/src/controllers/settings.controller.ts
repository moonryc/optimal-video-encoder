import { promises as fs } from 'fs';
import path from 'path';
import { type RequestHandler } from 'express';

type Settings = Record<string, unknown>;

const settingsPath = path.join(__dirname, '..', 'settings.json');

const readSettings = async (): Promise<Settings> => {
  const raw = await fs.readFile(settingsPath, 'utf-8');
  return JSON.parse(raw) as Settings;
};

const writeSettings = async (settings: Settings) => {
  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
};

export const getSettings: RequestHandler = async (_req, res) => {
  const data = await readSettings();
  res.json(data);
};

export const updateSettings: RequestHandler = async (req, res) => {
  const current = await readSettings();
  const requiredKeys = Object.keys(current);
  const updatedFields = req.body as Record<string, unknown>;
  const keysToUpdate = Object.keys(updatedFields);
  if(!requiredKeys.every(rk=>keysToUpdate.includes(rk))) {
    res.status(400).send({});
    return;
  }

  const next = { ...current, ...(req.body as Settings) };
  await writeSettings(next);
  res.json(next);
};
