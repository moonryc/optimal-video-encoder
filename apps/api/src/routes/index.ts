import { Router } from "express";

import { getConversionItems } from '../controllers/conversion-item.controller';
import {
  uploadFile,
  uploadMiddleware,
} from '../controllers/upload.controller';
import {
  getSettings,
  updateSettings,
} from '../controllers/settings.controller';
import { ApiResponse } from '@org/models';

const router = Router();

router.get("/conversion-items", getConversionItems);
router.get("/settings", getSettings);
router.post("/settings", updateSettings);
router.post(
  "/upload",
  (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        const response: ApiResponse<null> = {
          data: null,
          success: false,
          error: err instanceof Error ? err.message : 'Upload failed',
        };
        res.status(400).json(response);
        return;
      }
      next();
    });
  },
  uploadFile
);

export default router;
