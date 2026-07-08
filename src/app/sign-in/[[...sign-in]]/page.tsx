import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "ورود — لینوکس آکادمی" };

export default function SignInPage() {
  return (
    <main
      dir="rtl"
      lang="fa"
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-brand-purple/10 via-gray-50 to-brand-magenta/10 px-4 py-16"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-brand-magenta text-sm font-bold text-white">
          LA
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">لینوکس آکادمی</div>
          <div className="text-xs text-gray-500">ورود به پنل مدیریت</div>
        </div>
      </div>
      {/* Always land on the admin dashboard after a successful sign-in. */}
      <SignIn forceRedirectUrl="/admin" signUpUrl="/sign-in" />
      <p className="text-xs text-gray-400">دسترسی فقط برای مدیر سایت</p>
    </main>
  );
}
