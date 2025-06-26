import { z } from "zod";

const envSchema = z.object({
  APPLE_MAPKIT_PRIVATE_KEY: z.string(),
  APPLE_MAPKIT_TEAM_ID: z.string(),
  APPLE_MAPKIT_KEY_ID: z.string(),
});

export const env = envSchema.parse({
  APPLE_MAPKIT_PRIVATE_KEY: process.env.APPLE_MAPKIT_PRIVATE_KEY,
  APPLE_MAPKIT_TEAM_ID: process.env.APPLE_MAPKIT_TEAM_ID,
  APPLE_MAPKIT_KEY_ID: process.env.APPLE_MAPKIT_KEY_ID,
});
