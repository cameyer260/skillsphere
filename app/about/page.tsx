import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero / Intro */}
      <section className="flex-grow container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-semibold mb-4">About PlaySkillSphere</h2>
        <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-400">
          PlaySkillSphere is your go-to hub for sharpening your skills through
          fun, competitive online games. Whether you’re looking to challenge
          friends or just beat your personal best, we’ve got something for
          everyone.
        </p>
      </section>

      {/* GRADIENT DIVIDER */}
      <div className="h-16 bg-gradient-to-b from-transparent to-gray-400" />

      {/* Features */}
      <section className="bg-gray-400 py-12">
        <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg shadow">
            <h3 className="text-xl font-medium mb-2">Easy Sign-Up</h3>
            <p>
              Create an account in seconds with Email/Password or Google OAuth.
            </p>
          </div>
          <div className="p-6 rounded-lg shadow">
            <h3 className="text-xl font-medium mb-2">Track Your Progress</h3>
            <p>
              Your personal dashboard shows all your games and stats in one
              place.
            </p>
          </div>
          <div className="p-6 rounded-lg shadow">
            <h3 className="text-xl font-medium mb-2">Custom Avatars</h3>
            <p>
              Upload your own, or sync automatically with your Google profile
              pic.
            </p>
          </div>
        </div>
      </section>

      {/* GRADIENT DIVIDER */}
      <div className="h-16 bg-gradient-to-b from-gray-400 to-transparent" />

      {/* Call to Action */}
      <section className="py-12 text-center">
        <h3 className="text-2xl font-semibold mb-4">Ready to play?</h3>
        <div className="space-x-4">
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <p>© {new Date().getFullYear()} PlaySkillSphere</p>
          <div className="space-x-4">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
