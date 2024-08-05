import { Metadata } from "next";
import { Container } from "@/container";

export const metadata: Metadata = { title: "Reports" };

export default async function Profile({ params }: { params: { id: string } }) {
  const cnt = await Container.init({ requireAdmin: true });

  const profile = await cnt.prisma.profile.findUniqueOrThrow({
    where: { id: params.id },
  });

  return (
    <div>
      <h1>{profile.name}</h1>
      <div>{profile.title}</div>
      <div>{profile.bio}</div>
    </div>
  );
}
