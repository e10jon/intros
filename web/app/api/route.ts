import { NextResponse } from "next/server";

export type Data = { hello: string };

export async function GET(): Promise<NextResponse<Data>> {
  const data = { hello: "world" };

  return NextResponse.json(data);
}
