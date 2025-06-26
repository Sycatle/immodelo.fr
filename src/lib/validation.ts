import { z } from "zod";

export const estimateInputSchema = z.object({
  address: z.string().trim().min(3).max(100),
  postcode: z.string().regex(/^\d{5}$/),
  city: z.string().trim().min(2).max(100),
  surface: z.preprocess((v) => Number(v), z.number().positive()),
  totalSurface: z
    .preprocess((v) => (v === "" || v === null ? undefined : Number(v)),
      z.number().int().min(0)
    )
    .optional(),
  buildableSurface: z
    .preprocess((v) => (v === "" || v === null ? undefined : Number(v)),
      z.number().int().min(0)
    )
    .optional(),
  propertyType: z.enum(["maison", "appartement", "terrain", "autre"]),
  rooms: z.preprocess((v) => Number(v), z.number().int().min(0)),
  bathrooms: z
    .preprocess((v) => (v === "" || v === null ? undefined : Number(v)),
      z.number().int().min(0)
    )
    .optional(),
  levels: z
    .preprocess((v) => (v === "" || v === null ? undefined : Number(v)),
      z.number().int().min(0)
    )
    .optional(),
  condition: z.string().trim().min(1),
  partyWalls: z.boolean().optional(),
  basement: z.boolean().optional(),
  parkingSpots: z
    .preprocess((v) => (v === "" || v === null ? undefined : Number(v)),
      z.number().int().min(0)
    )
    .optional(),
  outbuildings: z
    .preprocess((v) => (v === "" || v === null ? undefined : Number(v)),
      z.number().int().min(0)
    )
    .optional(),
  exceptionalView: z.boolean().optional(),
  pool: z.boolean().optional(),
  sewer: z.boolean().optional(),
  dpe: z.string().optional().default(""),
  yearBuilt: z
    .preprocess((v) => (v === "" || v === null ? undefined : Number(v)),
      z.number().int().min(0).max(new Date().getFullYear())
    )
    .optional(),
  houseQuality: z.string().optional().default(""),
  brightness: z.string().optional().default(""),
  noise: z.string().optional().default(""),
  transportProximity: z.string().optional().default(""),
  roofQuality: z.string().optional().default(""),
  occupation: z.string().optional().default(""),
  urgency: z.string().optional().default(""),
  firstname: z.string().trim().min(1).max(100),
  lastname: z.string().trim().min(1).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^((\+33|0)[1-9])(\d{2}){4}$/),
});

export type ValidEstimateInput = z.infer<typeof estimateInputSchema>;
