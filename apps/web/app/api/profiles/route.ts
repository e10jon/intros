import { NextRequest, NextResponse } from "next/server";
import { Container } from "@/container";
import { Data } from "@intros/shared";
import { Prisma, Profile } from "@prisma/client";
import { profileInterestsStringToArray } from "@/lib/profile-interests";

export async function GET(
  request: NextRequest
): Promise<NextResponse<Data<"/api/profiles">>> {
  const cnt = await Container.init();

  const searchParams = request.nextUrl.searchParams;
  const nameQuery = searchParams.get("name");
  const interestsQuery = searchParams.get("interests");

  let profiles: (Omit<Profile, "interests"> & { interests: string[] })[] = [];

  if (nameQuery || interestsQuery) {
    const nameSim = Prisma.sql`${nameQuery} <<-> name`;
    const nameSelect = nameQuery
      ? Prisma.sql`${nameSim} AS "nameDistance"`
      : "-1";
    const interestsSim = interestsQuery
      ? Prisma.sql`${interestsQuery} <<-> interests`
      : null;
    const interestsSelect = interestsQuery
      ? Prisma.sql`${interestsSim} AS "interestsDistance"`
      : "-1";
    const nameWhere = nameQuery
      ? Prisma.sql`${nameSim} < ${defaultMaxDistance}`
      : Prisma.sql`1=1`;
    const interestsWhere = interestsQuery
      ? Prisma.sql`${interestsSim} < ${defaultMaxDistance}`
      : Prisma.sql`1=1`;

    profiles = await cnt.prisma.$queryRaw<
      (Profile & { nameDistance: number; interestsDistance: number })[]
    >`SELECT *, ${nameSelect}, ${interestsSelect} FROM "Profile" WHERE ${nameWhere} AND ${interestsWhere};`.then(
      (profiles) =>
        profiles.map(({ interestsDistance, ...profile }) => ({
          ...profile,
          interests: profileInterestsStringToArray(profile.interests),
        }))
    );
  } else {
    profiles = await cnt.prisma.profile.findMany().then((profiles) =>
      profiles.map(({ interestsArray, ...profile }) => ({
        ...profile,
        interests: interestsArray,
      }))
    );
  }

  return NextResponse.json({ profiles });
}

const defaultMaxDistance = 0.7;
