import BackButton from "@/src/components/elements/back"
import { AuthForm } from "@/src/components/features/forms/auth-form"
import { auth } from "@/src/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Signin() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(session) {
    redirect('/journal')
  }
  return (
    <div className="flex-1 font-sans grid grid-rows-[20px_1fr_20px] p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="font-serif text-3xl font-medium text-center">
          Enter your account to begin
        </h1>
        <AuthForm />
        <BackButton />
      </main>
    </div>
  )
}
