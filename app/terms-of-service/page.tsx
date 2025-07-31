import Link from "next/link";

export default function Terms() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Terms of Service Content */}
      <section className="flex-grow container mx-auto px-4 py-16">
        <h2 className="text-4xl font-semibold mb-6">Terms of Service</h2>
        <p className="mb-4">
          <strong>Effective Date:</strong> July 31, 2025
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">
          1. Acceptance of Terms
        </h3>
        <p className="mb-4">
          By accessing or using PlaySkillSphere (the “Service”), you agree to be
          bound by these Terms of Service and our Privacy Policy. If you do not
          agree, please do not use the Service.
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">2. User Accounts</h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            You must provide accurate information when creating an account.
          </li>
          <li>
            You are responsible for safeguarding your account credentials.
          </li>
          <li>
            We reserve the right to suspend or terminate accounts for violations
            of these Terms.
          </li>
        </ul>

        <h3 className="text-2xl font-medium mt-8 mb-4">3. Acceptable Use</h3>
        <p className="mb-4">
          You agree not to use the Service for any unlawful or harmful purposes,
          including but not limited to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Cheating, hacking, or exploiting game vulnerabilities.</li>
          <li>
            Harassment, hate speech, or abusive behavior toward other users.
          </li>
          <li>Uploading or sharing malicious software.</li>
        </ul>

        <h3 className="text-2xl font-medium mt-8 mb-4">
          4. Intellectual Property
        </h3>
        <p className="mb-4">
          All content, trademarks, and logos on the Service are the property of
          PlaySkillSphere or its licensors. You may not use or reproduce any
          proprietary content without permission.
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">
          5. Limitation of Liability
        </h3>
        <p className="mb-4">
          To the fullest extent permitted by law, PlaySkillSphere will not be
          liable for any indirect, incidental, or consequential damages arising
          from your use of the Service.
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">6. Termination</h3>
        <p className="mb-4">
          We may suspend or terminate your access at any time, with or without
          cause or notice, if you violate these Terms.
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">7. Changes to Terms</h3>
        <p className="mb-4">
          We may update these Terms from time to time. We’ll post the revised
          date at the top and notify users of significant changes via email or
          in-app banner.
        </p>

        <h3 className="text-2xl font-medium mt-8 mb-4">
          8. Contact Information
        </h3>
        <p>
          Questions about these Terms? Email us at{" "}
          <a
            href="mailto:support@playskillsphere.com"
            className="text-blue-600 hover:underline"
          >
            cameyer06@gmail.com
          </a>
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
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
