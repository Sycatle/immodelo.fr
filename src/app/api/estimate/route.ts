// Route API /api/estimate
// Reçoit les données du formulaire d'estimation et renvoie un prix estimé.
// Un petit système de rate limiting empêche les abus.
import { NextResponse } from "next/server";
import estimatePrice from "@/lib/estimate";
import { estimateInputSchema, ValidEstimateInput } from "@/lib/validation";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5;
const ipHits = new Map<string, { count: number; ts: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const hit = ipHits.get(ip);
  if (hit && now - hit.ts < RATE_LIMIT_WINDOW) {
    if (hit.count >= RATE_LIMIT_MAX) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    hit.count++;
  } else {
    ipHits.set(ip, { count: 1, ts: now });
  }

  let data: ValidEstimateInput;
  try {
    const body = await req.json();
    data = estimateInputSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const result = await estimatePrice(data);
  return NextResponse.json(result);
}
