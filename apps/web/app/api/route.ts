import { NextResponse } from "next/server";
import { Container } from "../../container";
import { User } from "@prisma/client";

export type Data = { users: User[] };

export async function GET(): Promise<NextResponse<Data>> {
  const cnt = await Container.init();
  const users = await cnt.prisma.user.findMany();
  await cnt.sendEmailToUser();
  return NextResponse.json({ users });
}
