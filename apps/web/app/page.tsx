import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Container } from "../container";

export default async function Page() {
  const cnt = await Container.init();
  const user = await cnt.currentUser;

  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      home {JSON.stringify(user)}
    </div>
  );
}
