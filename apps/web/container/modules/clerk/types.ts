export type WebhookPayload<
  Type extends
    | "session.created"
    | "user.created"
    | "user.updated"
    | string = string
> = {
  data: Type extends "session.created"
    ? {
        abandon_at: number;
        actor: string | null;
        client_id: string;
        created_at: number;
        expire_at: number;
        id: string;
        last_active_at: number;
        object: string;
        status: "active";
        updated_at: number;
        user_id: string;
      }
    : Type extends "user.created" | "user.updated"
    ? {
        backup_code_enabled: boolean;
        banned: boolean;
        create_organization_enabled: boolean;
        created_at: number;
        delete_self_enabled: boolean;
        email_addresses: {
          created_at: number;
          email_address: string;
          id: string;
          linked_to: [];
          object: "email_address";
          reserved: boolean;
          updated_at: number;
          verification: {
            attempts: number;
            expire_at: number;
            status: "verified";
            strategy: "email_code";
          };
        }[];
        external_accounts: [];
        external_id: string | null;
        first_name: string | null;
        has_image: boolean;
        id: string;
        image_url: string;
        last_active_at: number;
        last_name: string | null;
        last_sign_in_at: number | null;
        locked: boolean;
        lockout_expires_in_seconds: number | null;
        mfa_disabled_at: number | null;
        mfa_enabled_at: number | null;
        object: "user";
        passkeys: [];
        password_enabled: boolean;
        phone_numbers: {
          created_at: number;
          id: string;
          phone_number: string;
          reserved: boolean;
          reserved_for_second_factor: boolean;
          verification: {
            attempts: number;
            expire_at: number;
            status: "verified";
            strategy: "phone_code";
          } | null;
        }[];
        primary_email_address_id: string;
        primary_phone_number_id: string | null;
        primary_web3_wallet_id: string | null;
        private_metadata: {};
        profile_image_url: string;
        public_metadata: UserPublicMetadata;
        saml_accounts: [];
        totp_enabled: boolean;
        two_factor_enabled: boolean;
        unsafe_metadata: UnsafeMetadata;
        updated_at: number;
        username: string | null;
        verification_attempts_remaining: number;
        web3_wallets: [];
      }
    : Record<string, string | number | boolean | null>;
  event_attributes: {
    http_request: {
      client_ip: string;
      user_agent: string;
    };
  };
  object: "event";
  type: Type;
};
