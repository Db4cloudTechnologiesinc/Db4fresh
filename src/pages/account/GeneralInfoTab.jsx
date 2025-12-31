export default function GeneralInfoTab() {
  return (
    <div className="max-w-3xl">
      <h3 className="text-lg font-semibold mb-4">General Information</h3>

      {/* ABOUT US */}
      <section className="mb-6">
        <h4 className="font-semibold mb-1">About Us</h4>
        <p className="text-sm text-gray-600">
          DB4Fresh is an online grocery delivery platform focused on providing
          fresh products at your doorstep with fast delivery and reliable
          service.
        </p>
      </section>

      {/* TERMS */}
      <section className="mb-6">
        <h4 className="font-semibold mb-1">Terms & Conditions</h4>
        <p className="text-sm text-gray-600">
          By using DB4Fresh, you agree to our terms regarding order placement,
          cancellations, refunds, and usage of the platform.
        </p>

        <a
          href="/terms"
          className="text-sm text-red-600 underline"
        >
          Read full Terms & Conditions
        </a>
      </section>

      {/* PRIVACY */}
      <section className="mb-6">
        <h4 className="font-semibold mb-1">Privacy Policy</h4>
        <p className="text-sm text-gray-600">
          We value your privacy. Your personal data is securely stored and never
          shared without consent.
        </p>

        <a
          href="/privacy"
          className="text-sm text-red-600 underline"
        >
          Read Privacy Policy
        </a>
      </section>

      {/* CONTACT */}
      <section className="mb-6">
        <h4 className="font-semibold mb-1">Contact Information</h4>
        <p className="text-sm text-gray-600">
          Email: support@db4fresh.com
        </p>
        <p className="text-sm text-gray-600">
          Phone: +91 98765 43210
        </p>
      </section>

      {/* APP INFO */}
      <section className="mb-6">
        <h4 className="font-semibold mb-1">App Information</h4>
        <p className="text-sm text-gray-600">Version: 1.0.0</p>
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} DB4Fresh. All rights reserved.
        </p>
      </section>

      {/* LANGUAGE (OPTIONAL) */}
      <section>
        <h4 className="font-semibold mb-2">Language</h4>
        <select
          className="border p-2 rounded text-sm"
          defaultValue="en"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="te">Telugu</option>
          <option value="ta">Tamil</option>
        </select>
      </section>
    </div>
  );
}
