import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Data } from "@intros/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<Data<"/api/profiles/[id]">>> {
  const cnt = await Container.init();
  const currentPrismaUser = await cnt.currentPrismaUser;

  const [profile, conversation] = await Promise.all([
    cnt.prisma.profile.findUniqueOrThrow({
      where: { id: params.id },
    }),
    currentPrismaUser
      ? cnt.prisma.conversation.findFirst({
          where: {
            OR: [
              {
                AND: [
                  { fromUserId: currentPrismaUser.id },
                  { toUserId: params.id },
                ],
              },
              {
                AND: [
                  { fromUserId: params.id },
                  { toUserId: currentPrismaUser.id },
                ],
              },
            ],
          },
        })
      : null,
  ]);

  return NextResponse.json({ profile, conversation });
}
