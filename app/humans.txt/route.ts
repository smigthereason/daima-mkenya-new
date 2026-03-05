// app/humans.txt/route.ts
import type { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(_req: NextRequest) {
  const body = `/* TEAM */
Agency: Sunkova Agency
Lead Developer: Abubakar Ismail
Developers: Sunkova Engineering Team
Site: https://daimamkenyaafrica.com

/* SITE */
Last-Updated: 2026-03-05
Language: en-KE
Location: Nairobi, Kenya
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
