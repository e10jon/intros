import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Container } from "../container";

export default async function Page() {
  const cnt = await Container.init();
  const clerkUser = await cnt.currentClerkUser;

  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      home {JSON.stringify(clerkUser)}
    </div>
  );
}
