import { NextResponse } from "next/server";
import { Container } from "@/container";
import { State } from "country-state-city";
import { Data } from "@intros/types";

// get the list of states for country
export async function GET(
  request: Request,
  { params }: { params: { isoCode: string } }
): Promise<NextResponse<Data<"/api/countries/[isoCode]">>> {
  // make sure this endpoint isn't abused publicly
  await Container.init({ requireUser: true });

  const provinces = State.getStatesOfCountry(params.isoCode).map(
    ({ name, isoCode }) => ({ name, isoCode })
  );
  if (!provinces)
    return NextResponse.json({ errorCode: "CountryNotFound" }, { status: 400 });

  return NextResponse.json({ provinces });
}
