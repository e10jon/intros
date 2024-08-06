import { Metadata } from "next";
import { Container } from "@/container";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Profile" };

export default async function Profile({
  params,
}: {
  params: { slug: string };
}) {
  if (!params.slug.startsWith("%40")) notFound(); // is @
  const slug = params.slug.slice(3); // remove the @

  const cnt = await Container.init();
  const profile = await cnt.prisma.profile.findUnique({
    where: { slug },
  });
  if (!profile) notFound();

  return (
    <div>
      <h1>{profile.name}</h1>
    </div>
  );
}
