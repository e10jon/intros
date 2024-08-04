import { NextResponse } from "next/server";
import { Data, Body } from "@intros/types";
import { Container } from "@/container";

// load current user settings
export async function GET(): Promise<NextResponse<Data<"/api/settings">>> {
  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  let settings = await cnt.prisma.userSettings.findUnique({
    where: { userId: currentPrismaUser.id },
  });
  if (!settings)
    settings = await cnt.prisma.userSettings.create({
      data: { userId: currentPrismaUser.id },
    });

  return NextResponse.json({ settings });
}

// update current user profile
export async function POST(
  request: Request
): Promise<NextResponse<Data<"/api/settings">>> {
  const body = (await request.json()) as Body<"/api/settings">;

  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const settings = await cnt.prisma.userSettings.update({
    where: { userId: currentPrismaUser.id },
    data: body,
  });

  return NextResponse.json({ settings });
}
