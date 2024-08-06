import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Container } from "../container";
import Link from "next/link";

export default async function Page() {
  const cnt = await Container.init();
  const clerkUser = await cnt.currentClerkUser;

  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <div>
          Signed in as {clerkUser?.emailAddresses[0]?.emailAddress}
          <SignOutButton />
        </div>

        <ul>
          <li>
            <Link href="/reports">Reports</Link>
          </li>
        </ul>
      </SignedIn>
    </div>
  );
}
