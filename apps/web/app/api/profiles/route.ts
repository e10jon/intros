import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Data } from "@intros/shared";

export async function GET(): Promise<NextResponse<Data<"/api/profiles">>> {
  const cnt = await Container.init();
  const profiles = await cnt.prisma.profile.findMany();
  return NextResponse.json({ profiles });
}
