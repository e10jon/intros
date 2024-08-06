import {
  DayOfWeek,
  EmailFrequency,
  Conversation,
  Message as PrismaMessage,
  Profile,
  ConversationNotification,
  UserSettings,
} from "@prisma/client";
import Stripe from "stripe";

const paths = [
  "/api",
  "/api/payment/subscription",
  "/api/profile",
  "/api/profiles",
  "/api/profiles/[id]",
  "/api/conversations",
  "/api/conversations/[id]",
  "/api/conversations/[id]/message",
  "/api/conversations/[id]/mute",
  "/api/conversations/[id]/report",
  "/api/conversation",
  "/api/settings",
  "/api/countries",
  "/api/countries/[isoCode]",
] as const;

type Paths = typeof paths;
export type Path = Paths[number];

export type Method = "GET" | "POST";

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
          notifications: ConversationNotification[];
        })[];
        numTokensAvailable: number;
      }
    : M extends "POST"
    ? SingleConversation
    : never
  : P extends "/api/conversations/[id]"
  ? SingleConversation
  : P extends "/api/conversation"
  ? M extends "GET"
    ? SingleConversation
    : M extends "POST"
    ?
        | {
            errorCode: "ModerationFail";
            moderationCategories: string[];
          }
        | { errorCode: "NoTokensAvailable" | "NoNewIntrosRemainaing" }
        | SingleConversation
    : never
  : P extends
      | "/api/conversations/[id]/message"
      | "/api/conversations/[id]/mute"
      | "/api/conversations/[id]/report"
  ? { message: Message }
  : P extends "/api/settings"
  ? { settings: UserSettings }
  : P extends "/api/countries"
  ? { countries: Country[] }
  : P extends "/api/countries/[isoCode]"
  ? { provinces: Province[] } | { errorCode: "CountryNotFound" }
  : unknown;

export type Message = Pick<
  PrismaMessage,
  "id" | "body" | "createdAt" | "updatedAt" | "userId" | "specialCode"
> & {
  user: { profile: { id: string } | null } | null;
};

type SingleConversation = {
  conversation: Conversation;
  messages: Message[];
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
      country?: string;
      province?: string;
    }
  : P extends "/api/conversation"
  ? {
      toUserId: string;
      body: string;
    }
  : P extends "/api/conversations/[id]/message"
  ? {
      body: string;
    }
  : P extends "/api/conversations/[id]/mute"
  ? {} // needs to have something
  : P extends "/api/conversations/[id]/report"
  ? {
      reason: string;
    }
  : P extends "/api/settings"
  ? {
      pushToken?: string;
      emailFrequency?: EmailFrequency;
      sendEmailsTime?: Date;
      sendEmailsDayOfWeek?: DayOfWeek;
      dailyIntrosLimit?: number;
      dailyIntrosResetTime?: Date;
      timeZone?: string;
    }
  : P extends "/api/countries"
  ? {}
  : never;

export type Params<P extends Path> = P extends
  | "/api/profiles/[id]"
  | "/api/conversations/[id]"
  | "/api/conversations/[id]/message"
  | "/api/conversations/[id]/mute"
  | "/api/conversations/[id]/report"
  ? { id: string }
  : P extends "/api/countries/[isoCode]"
  ? { isoCode: string }
  : never;

export { EmailFrequency, DayOfWeek };

export const errorCodes = [
  "ModerationFail",
  "NoTokensAvailable",
  "NoNewIntrosRemainaing",
  "CountryNotFound",
] as const;

export type ErrorCode = (typeof errorCodes)[number];

export type Country = { name: string; isoCode: string };
export type Province = { name: string; isoCode: string };
