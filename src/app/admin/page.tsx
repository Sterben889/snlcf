import { signOut } from "~/server/auth";
import { auth } from "~/server/auth";

export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl bg-white p-8 shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>

              <p className="mt-2 text-gray-600">
                Signed in as {session?.user.email}
              </p>

              <p className="text-sm text-gray-500">
                Role: {session?.user.role}
              </p>
            </div>

            <form
              action={async () => {
                "use server";

                await signOut({
                  redirectTo: "/",
                });
              }}
            >
              <button
                type="submit"
                className="rounded-md bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-900"
              >
                Sign out
              </button>
            </form>
          </div>

          <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-8">
            <h2 className="text-xl font-semibold">Authentication is working</h2>

            <p className="mt-2 text-gray-600">
              Homepage editing, pictures, events, sermons, and staff will be
              added after this phase passes testing.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
