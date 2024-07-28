import { Container } from "../container";

export default async function Page() {
  const data = await (async () => {
    const cnt = await Container.init();
    const users = await cnt.prisma.user.findMany();
    return { users };
  })();

  return <div>hello world data {JSON.stringify(data)}</div>;
}
