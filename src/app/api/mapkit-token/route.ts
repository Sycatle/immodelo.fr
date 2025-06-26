import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jwt-simple";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const privateKey = process.env.APPLE_MAPKIT_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const teamId     = process.env.APPLE_MAPKIT_TEAM_ID!;
  const keyId      = process.env.APPLE_MAPKIT_KEY_ID!;
  const now        = Math.floor(Date.now() / 1000);

  const token = jwt.encode(
    {
      iss: teamId,
      iat: now,
      exp: now + 3600,       // valable 1 heure
      origin: `${req.headers.host}`,
    },
    privateKey,
    "ES256",
    { kid: keyId }
  );

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
  res.status(200).json({ token });
}
