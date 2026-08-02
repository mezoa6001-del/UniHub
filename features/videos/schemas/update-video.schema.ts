import { z } from "zod";

import { createVideoSchema } from "./create-video.schema";

export const updateVideoSchema = createVideoSchema;

export type UpdateVideoInput =
  z.infer<typeof updateVideoSchema>;