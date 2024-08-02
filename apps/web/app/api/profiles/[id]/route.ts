import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Data } from "@intros/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<Data<"/api/profiles/[id]">>> {
  const cnt = await Container.init();
  const profile = await cnt.prisma.profile.findUniqueOrThrow({
    where: { id: params.id },
  });
  return NextResponse.json({ profile });
}
