import { NextResponse } from "next/server";
import { Container } from "../../container";
import { NextApiRequest, NextApiResponse } from "next";

export type Data = { hello: string };

export async function GET(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<NextResponse<Data>> {
  const cnt = await Container.init(request, response);
  return NextResponse.json(cnt.helloWorld());
}
