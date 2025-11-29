import { ResetPasswordForm } from "@/src/components/features/forms/auth-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
          <p className="text-gray-600">The password reset link is invalid or missing a token.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col rounded-2xl bg-white py-10 px-10 md:px-16 md:min-w-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 rounded-md">Reset Password</h1>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
