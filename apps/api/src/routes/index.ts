import { Router } from "express";

import { getConversionItems } from '../controllers/conversion-item.controller';
import {
  getSettings,
  updateSettings,
} from '../controllers/settings.controller';

const router = Router();

router.get("/conversion-items", getConversionItems);
router.get("/settings", getSettings);
router.post("/settings", updateSettings);

export default router;
