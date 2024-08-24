import { z } from "zod";

export const joinRoomMessageSchema = z.object({
  event: z.literal("join-room"),
  roomId: z.string(),
});
export type JoinRoomMessageSchema = z.infer<typeof joinRoomMessageSchema>;

export const leaveRoomMessageSchema = z.object({
  event: z.literal("leave-room"),
  roomId: z.string(),
});
export type LeaveRoomMessageSchema = z.infer<typeof leaveRoomMessageSchema>;

export const describeRoomMessageSchema = z.object({
  event: z.literal("describe-room"),
  roomId: z.string(),
});
export type DescribeRoomMessageSchema = z.infer<
  typeof describeRoomMessageSchema
>;

export const messageSchema = z.discriminatedUnion("event", [
  joinRoomMessageSchema,
  leaveRoomMessageSchema,
  describeRoomMessageSchema,
]);

export type MessageSchema = z.infer<typeof messageSchema>;
