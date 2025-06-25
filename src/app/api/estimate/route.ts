import { NextResponse } from "next/server";
import estimatePrice, { EstimateInput } from "@/lib/estimate";

export async function POST(req: Request) {
  const data = (await req.json()) as EstimateInput;

  const result = estimatePrice(data);
  return NextResponse.json(result);
}
