import { Metadata } from "next";
import { Container } from "@/container";
import { selectArgsForMessage } from "@/lib/prisma";

export const metadata: Metadata = { title: "Reports" };

export default async function Conversation({
  params,
}: {
  params: { id: string };
}) {
  const cnt = await Container.init({ requireAdmin: true });

  const conversation = await cnt.prisma.conversation.findUniqueOrThrow({
    where: { id: params.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: selectArgsForMessage,
      },
    },
  });

  return (
    <div>
      <h1>Conversation {params.id}</h1>
      <div>
        {conversation.messages.map((message) => (
          <div key={message.id}>
            <div>{message.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
