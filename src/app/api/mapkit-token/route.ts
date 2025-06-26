import { NextRequest, NextResponse } from "next/server";
import jwt from "jwt-simple";
import { env } from "@/env";

export async function GET(req: NextRequest) {
  const privateKey = env.APPLE_MAPKIT_PRIVATE_KEY.replace(/\\n/g, "\n");
  const teamId = env.APPLE_MAPKIT_TEAM_ID;
  const keyId = env.APPLE_MAPKIT_KEY_ID;
  const now = Math.floor(Date.now() / 1000);

  const token = jwt.encode(
    {
      iss: teamId,
      iat: now,
      exp: now + 3600,
      origin: `${req.headers.get("host")}`,
    },
    privateKey,
    "ES256",
    { kid: keyId }
  );

  const res = NextResponse.json({ token });
  res.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate");
  return res;
}
