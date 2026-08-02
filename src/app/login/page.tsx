import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { auth, signIn } from "~/server/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  const params = await searchParams;

  async function login(formData: FormData) {
    "use server";

    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/admin",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/login?error=invalid");
      }

      throw error;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Administrator Login
        </h1>

        <p className="mb-6 text-gray-600">
          Sign in to manage the church website.
        </p>

        {params.error && (
          <p className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
            The email or password was incorrect.
          </p>
        )}

        <form action={login} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block font-medium text-gray-800"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block font-medium text-gray-800"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
