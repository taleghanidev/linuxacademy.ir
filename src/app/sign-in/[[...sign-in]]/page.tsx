import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Sign in — Linux Academy" };

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <SignIn />
    </main>
  );
}
