import { NextResponse } from "next/server";
import { Container } from "../../container";

export type Data = { hello: string };

export async function GET(request: Request): Promise<NextResponse<Data>> {
  const cnt = await Container.init(request);

  await cnt.sendEmailToUser();

  return NextResponse.json({ hello: "world" });
}
