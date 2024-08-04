declare global {
  // this is how clerk wants you to do custom metadata typing
  // be sure this matches the customized session token in the clerk settings
  interface UserPublicMetadata {
    creationIsComplete?: boolean;
    stripeSubscriptionId?: string;
    subscriptionIsActive?: boolean;
    numAvailableTokens?: number;
  }
}

export {};
