"use client";

import { signIn } from "next-auth/react";

export default async function Page() {
  return (
    <div>
      <button onClick={() => signIn()}>Sign In</button>
    </div>
  );
}
