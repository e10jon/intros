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
  const countryQuery = searchParams.get("country");
  const provinceQuery = searchParams.get("province");

  let profiles: (Omit<Profile, "interests"> & { interests: string[] })[] = [];

  if (nameQuery || interestsQuery) {
    const nameSim = nameQuery ? Prisma.sql`${nameQuery} <<-> name` : null;
    const interestsSim = interestsQuery
      ? Prisma.sql`${interestsQuery} <<-> interests`
      : null;
    const countriesSim = countryQuery
      ? Prisma.sql`${countryQuery} <<-> country`
      : null;
    const provincesSim = provinceQuery
      ? Prisma.sql`${provinceQuery} <<-> province`
      : null;

    const nameSelect = nameQuery
      ? Prisma.sql`${nameSim} AS "nameDistance"`
      : "-1";
    const interestsSelect = interestsQuery
      ? Prisma.sql`${interestsSim} AS "interestsDistance"`
      : "-1";
    const countrySelect = countryQuery
      ? Prisma.sql`${countriesSim} AS "countryDistance"`
      : "-1";
    const provinceSelect = provinceQuery
      ? Prisma.sql`${provincesSim} AS "provinceDistance"`
      : "-1";

    const nameWhere = nameQuery
      ? Prisma.sql`${nameSim} < ${defaultMaxDistance}`
      : Prisma.sql`1=1`;
    const interestsWhere = interestsQuery
      ? Prisma.sql`${interestsSim} < ${defaultMaxDistance}`
      : Prisma.sql`1=1`;
    const countryWhere = countryQuery
      ? Prisma.sql`${countriesSim} < ${defaultMaxDistance}`
      : Prisma.sql`1=1`;
    const provinceWhere = provinceQuery
      ? Prisma.sql`${provincesSim} < ${defaultMaxDistance}`
      : Prisma.sql`1=1`;

    profiles = await cnt.prisma.$queryRaw<
      (Profile & {
        nameDistance: number;
        interestsDistance: number;
        countryDistance: number;
        provinceDistance: number;
      })[]
    >`SELECT *, ${nameSelect}, ${interestsSelect}, ${countrySelect}, ${provinceSelect} 
FROM "Profile" WHERE ${nameWhere} AND ${interestsWhere} AND ${countryWhere} AND ${provinceWhere};`.then(
      (profiles) =>
        profiles.map(
          ({
            nameDistance,
            interestsDistance,
            provinceDistance,
            countryDistance,
            ...profile
          }) => ({
            ...profile,
            interests: profileInterestsStringToArray(profile.interests),
            distances: {
              name: nameDistance,
              interests: interestsDistance,
              province: provinceDistance,
              country: countryDistance,
            },
          })
        )
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
