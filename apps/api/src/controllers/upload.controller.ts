import { type RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiResponse, ConversionItem } from '@org/models';
import { initDataSource } from '../db/data-source';
import { startQueue } from '../bullMQ/queue/queue';

const uploadDir = path.resolve(
  process.cwd(),
  './pending-conversion-files'
);

const ensureUploadDir = () => {
  fs.mkdirSync(uploadDir, { recursive: true });
};

const allowedMimeTypes = new Set([
  'video/mp4',
  'video/x-matroska',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/x-ms-wmv',
  'video/x-flv',
]);

const allowedExtensions = new Set([
  '.mp4',
  '.mkv',
  '.mov',
  '.avi',
  '.webm',
  '.wmv',
  '.flv',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^\w.-]+/g, '_');
    cb(null, `${Date.now()}-${baseName}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimeTypes.has(file.mimetype) || allowedExtensions.has(ext)) {
      cb(null, true);
      return;
    }
    cb(
      new Error(
        'Only video files are allowed (mp4, mkv, mov, avi, webm, wmv, flv)'
      )
    );
  },
});

let cachedAddToQueue: ((path: ConversionItem['path']) => Promise<ConversionItem>) | null =
  null;

const getAddToQueue = async () => {
  if (cachedAddToQueue) {
    return cachedAddToQueue;
  }
  const ds = await initDataSource();
  const { addToQueue } = startQueue(ds);
  cachedAddToQueue = addToQueue;
  return addToQueue;
};

export const uploadMiddleware: RequestHandler = (req, res, next) => {
  (upload.single('file') as unknown as RequestHandler)(req, res, next);
};

export const uploadFile: RequestHandler = async (req, res) => {
  if (!req.file?.path) {
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: 'No file provided',
    };
    res.status(400).json(response);
    return;
  }

  try {
    const addToQueue = await getAddToQueue();
    const conversionItem = await addToQueue(req.file.path);
    const response: ApiResponse<ConversionItem> = {
      data: conversionItem,
      success: true,
    };
    res.status(201).json(response);
  } catch (err: unknown) {
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : 'Upload failed',
    };
    res.status(500).json(response);
  }
};
