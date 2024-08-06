import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Country as CountryLib } from "country-state-city";
import { Country, Data } from "@intros/shared";

// get the list of countries
export async function GET(): Promise<NextResponse<Data<"/api/countries">>> {
  // make sure this endpoint isn't abused publicly
  await Container.init({ requireUser: true });

  const countries = CountryLib.getAllCountries().reduce<Country[]>(
    (arr, { name, isoCode }) => {
      const country = { name, isoCode };
      // move United States to the front
      if (name === "United States") return [country].concat(arr);
      return arr.concat(country);
    },
    []
  );

  return NextResponse.json({ countries });
}
