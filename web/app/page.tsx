import { Container } from "../container";

export default async function Page() {
  const cnt = await Container.init();
  const user = await cnt.currentUser;

  return <div>home {JSON.stringify(user)}</div>;
}
