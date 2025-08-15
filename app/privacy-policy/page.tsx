import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Privacy Policy Content */}
      <section className="flex-grow container mx-auto px-4 py-16">
        <h2 className="text-4xl font-semibold mb-6">Privacy Policy</h2>
        <p className="mb-4">
          <strong>Last updated:</strong> July 31, 2025
        </p>

        <p className="mb-4">
          Welcome to PlaySkillSphere! We respect your privacy and are committed
          to protecting your personal information. This policy explains what
          data we collect, why we collect it, and how you can manage it.
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">
          1. Information We Collect
        </h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Email & Password:</strong> Collected via Supabase Auth when
            you sign up. Passwords are hashed and never visible to us.
          </li>
          <li>
            <strong>Google Profile Info:</strong> If you sign in with Google
            OAuth, we receive your email, profile name (if shared), and avatar
            URL.
          </li>
          <li>
            <strong>Username & Avatar:</strong> You choose a username and can
            upload an avatar or sync from Google.
          </li>
        </ul>

        <h3 className="text-2xl font-medium mt-8 mb-4">
          2. How We Use Your Information
        </h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Account Management:</strong> To create and secure your
            account.
          </li>
          <li>
            <strong>Profile Personalization:</strong> To show your username and
            avatar in the app.
          </li>
          <li>
            <strong>Communications:</strong> To send important service emails
            (e.g., password resets).
          </li>
          <li>
            <strong>Analytics:</strong> We use anonymous, aggregated metrics to
            improve performance and user experience.
          </li>
        </ul>

        <h3 className="text-2xl font-medium mt-8 mb-4">
          3. Data Storage & Security
        </h3>
        <p className="mb-4">
          All data is stored in our Supabase database with encrypted
          connections. The site runs on HTTPS via Vercel, and we follow industry
          best practices (environment variables, least-privilege access).
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">4. Data Sharing</h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Service Providers:</strong> Supabase (auth & database),
            Vercel (hosting), Google (OAuth).
          </li>
          <li>
            <strong>Legal Compliance:</strong> We may disclose data if required
            by law.
          </li>
        </ul>

        <h3 className="text-2xl font-medium mt-8 mb-4">
          5. Cookies & Tracking
        </h3>
        <p className="mb-4">
          We use only the cookies necessary to maintain your authenticated
          session. No third-party tracking cookies are used.
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">6. Data Retention</h3>
        <p className="mb-4">
          We keep your data as long as your account exists. You can request
          deletion at any time, and all your personal data will be removed.
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">7. Your Rights</h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Access:</strong> Request a copy of your data via email.
          </li>
          <li>
            <strong>Update:</strong> Change your username or avatar in profile
            settings.
          </li>
          <li>
            <strong>Deletion:</strong> Email us to delete your account and data.
          </li>
          <li>
            <strong>Opt-Out:</strong> Unsubscribe from non-essential emails.
          </li>
        </ul>

        <h3 className="text-2xl font-medium mt-8 mb-4">
          8. Changes to This Policy
        </h3>
        <p className="mb-4">
          We’ll update this policy and the “Last updated” date whenever we make
          significant changes, and notify you via email or in-app banner.
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">9. Contact Us</h3>
        <p>
          Questions? Email us at{" "}
          <Link
            href="mailto:support@playskillsphere.com"
            className="text-blue-600 hover:underline"
          >
            cameyer06@gmail.com
          </Link>
          .
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <p>© {new Date().getFullYear()} PlaySkillSphere</p>
          <div className="space-x-4">
            <Link href="/about" className="hover:underline">
              About
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
