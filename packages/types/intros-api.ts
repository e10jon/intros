import { Conversation, Message, Profile } from "@prisma/client";
import Stripe from "stripe";

const paths = [
  "/api",
  "/api/payment/subscription",
  "/api/profile",
  "/api/profiles",
  "/api/profiles/[id]",
  "/api/conversations",
  "/api/conversations/[id]",
  "/api/conversation",
] as const;

type Paths = typeof paths;
export type Path = Paths[number];

type Method = "GET" | "POST";

export type Data<P extends Path, M extends Method = "GET"> = P extends "/api"
  ? { hello: "there" }
  : P extends "/api/payment/subscription"
  ? CreateSubscription
  : P extends "/api/profile"
  ? { profile: Profile }
  : P extends "/api/profiles"
  ? { profiles: Profile[] }
  : P extends "/api/profiles/[id]"
  ? { profile: Profile; conversation: Conversation | null }
  : P extends "/api/conversations"
  ? M extends "GET"
    ? {
        conversations: (Conversation & {
          userFrom: { profile: Profile | null } | null;
          userTo: { profile: Profile | null } | null;
        })[];
        numTokensAvailable: number;
      }
    : M extends "POST"
    ? SingleConversation
    : never
  : P extends "/api/conversations/[id]"
  ? SingleConversation
  : unknown;

type SingleConversation = {
  conversation: Conversation;
  messages: (Pick<Message, "id" | "body" | "createdAt" | "updatedAt"> & {
    userFrom: { profile: { id: string } | null } | null;
    userTo: { profile: { id: string } | null } | null;
  })[];
  profiles: Profile[];
};

export type CreateSubscription = Stripe.Response<
  Stripe.Subscription & {
    latest_invoice: Stripe.Invoice & {
      payment_intent: Stripe.PaymentIntent;
    };
    pending_setup_intent?: Stripe.SetupIntent;
  }
>;

export type Body<
  P extends Path,
  M extends Method = "POST"
> = P extends "/api/profile"
  ? {
      name?: string;
      bio?: string;
      title?: string;
    }
  : P extends "/api/conversation"
  ? {
      toUserId: string;
      body: string;
    }
  : never;

export type Params<P extends Path> = P extends
  | "/api/profiles/[id]"
  | "/api/conversations/[id]"
  ? { id: string }
  : never;
