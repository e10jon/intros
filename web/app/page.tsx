import SignInButton from "../components/sign-in-button";
import SignOutButton from "../components/sign-out-button";
import { Container } from "../container";

export default async function Page() {
  const cnt = await Container.init();
  const user = cnt.session?.user;

  return (
    <div>
      <SignInButton />
      <SignOutButton />
      <div>{user ? `Logged in as: ${user.email}` : ""}</div>
    </div>
  );
}
