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
  // TODO: combine queries for name, interests, bio, region, country

  let profiles: (Omit<Profile, "interests"> & { interests: string[] })[] = [];

  if (nameQuery) {
    const sim = Prisma.sql`${nameQuery} <<-> name`;

    profiles = await cnt.prisma.$queryRaw<
      (Profile & { distance: number })[]
    >`SELECT *, ${sim} AS "distance" FROM "Profile" WHERE ${sim} < ${defaultMaxDistance} ORDER BY "distance" ASC;`.then(
      (profiles) =>
        profiles.map(({ distance, ...profile }) => ({
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
