import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Sign in — Linux Academy" };

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      {/* Always land on the admin dashboard after a successful sign-in. */}
      <SignIn forceRedirectUrl="/admin" signUpUrl="/sign-in" />
    </main>
  );
}
