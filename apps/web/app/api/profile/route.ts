import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Data, Body } from "@intros/shared";

// load current user profile
export async function GET(): Promise<NextResponse<Data<"/api/profile">>> {
  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  const { interestsArray, ...profile } =
    await cnt.prisma.profile.findUniqueOrThrow({
      where: { userId: currentPrismaUser.id },
    });

  return NextResponse.json({
    profile: { ...profile, interests: interestsArray },
  });
}

// update current user profile
export async function POST(
  request: Request
): Promise<NextResponse<Data<"/api/profile">>> {
  const body = (await request.json()) as Body<"/api/profile">;

  const cnt = await Container.init();
  const currentPrismaUser = await cnt.getCurrentPrismaUserOrThrow();

  // if there are no interests and an incoming bio, use AI to generate the interests
  if (body.bio && (!body.interests || !body.interests.length)) {
    const interests = await cnt.ai.extractInterestsFromBio(body.bio);
    body.interests = interests;
  }

  const { interestsArray, ...profile } = await cnt.prisma.profile.update({
    where: { userId: currentPrismaUser.id },
    data: {
      ...body,
      interests: cnt.prisma.profile.interestsArrayToString(body.interests),
    },
  });

  return NextResponse.json({
    profile: { ...profile, interests: interestsArray },
  });
}
