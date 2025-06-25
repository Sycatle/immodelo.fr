import { z } from "zod";

export const estimateInputSchema = z.object({
  address: z.string().trim().min(3).max(100),
  postcode: z.string().regex(/^\d{5}$/),
  city: z.string().trim().min(2).max(100),
  surface: z.preprocess((v) => Number(v), z.number().positive()),
  propertyType: z.enum(["maison", "appartement", "terrain", "autre"]),
  rooms: z.preprocess((v) => Number(v), z.number().int().min(0)),
  condition: z.string().trim().min(1),
  outdoorSpaces: z.array(z.string()).default([]),
  parking: z.string().optional().default(""),
  yearBuilt: z
    .preprocess((v) => (v === "" || v === null ? undefined : Number(v)),
      z.number().int().min(0).max(new Date().getFullYear())
    )
    .optional(),
  occupation: z.string().optional().default(""),
  urgency: z.string().optional().default(""),
  firstname: z.string().trim().min(1).max(100),
  lastname: z.string().trim().min(1).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^((\+33|0)[1-9])(\d{2}){4}$/),
});

export type ValidEstimateInput = z.infer<typeof estimateInputSchema>;
