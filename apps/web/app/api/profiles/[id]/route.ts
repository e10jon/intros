import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Data } from "@intros/shared";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<Data<"/api/profiles/[id]">>> {
  const cnt = await Container.init();
  const currentPrismaUser = await cnt.currentPrismaUser;

  const { interestsArray, ...profile } =
    await cnt.prisma.profile.findUniqueOrThrow({
      where: { id: params.id },
    });

  const conversation = currentPrismaUser
    ? await cnt.prisma.conversation.findFirst({
        where: {
          OR: [
            {
              AND: [
                { fromUserId: currentPrismaUser.id },
                { toUserId: profile.userId },
              ],
            },
            {
              AND: [
                { fromUserId: profile.userId },
                { toUserId: currentPrismaUser.id },
              ],
            },
          ],
        },
      })
    : null;

  return NextResponse.json({
    profile: { ...profile, interests: interestsArray },
    conversation,
  });
}
