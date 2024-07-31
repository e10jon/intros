import { NextResponse } from "next/server";
import { Container } from "@/container";
import { User } from "@prisma/client";

export type Data = {};

export async function POST(): Promise<NextResponse<Data>> {
  const cnt = await Container.init();
  const user = await cnt.getCurrentPrismaUser();
  return NextResponse.json({});
}
