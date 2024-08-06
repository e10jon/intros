import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Data, Body } from "@intros/shared";

// load current user profile
export async function GET(): Promise<NextResponse<Data<"/api/profile">>> {
  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const profile = await cnt.prisma.profile.findUniqueOrThrow({
    where: { userId: currentPrismaUser.id },
  });

  return NextResponse.json({ profile });
}

// update current user profile
export async function POST(
  request: Request
): Promise<NextResponse<Data<"/api/profile">>> {
  const body = (await request.json()) as Body<"/api/profile">;

  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const profile = await cnt.prisma.profile.update({
    where: { userId: currentPrismaUser.id },
    data: body,
  });

  return NextResponse.json({ profile });
}
