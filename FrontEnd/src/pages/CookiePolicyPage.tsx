import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import Footer from '../components/Footer';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10">
          <h1 className="text-4xl font-bold mb-6 text-white">Cookie Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: December 2023</p>

          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Cookies</h2>
              <p className="mb-3">EventCraft uses cookies for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and security</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings to provide enhanced, personalized features</li>
                <li><strong>Targeting Cookies:</strong> Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Session Cookies</h3>
                  <p>These are temporary cookies that expire when you close your browser. They help maintain your session while you navigate through our platform.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Persistent Cookies</h3>
                  <p>These cookies remain on your device for a set period or until you delete them. They help us remember your preferences and improve your experience.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Third-Party Cookies</h2>
              <p className="mb-3">We may also use third-party cookies from trusted partners for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Analytics services (e.g., Google Analytics)</li>
                <li>Payment processing (e.g., Stripe, PayPal)</li>
                <li>Social media integration</li>
                <li>Advertising and marketing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Managing Cookies</h2>
              <p className="mb-3">You can control and manage cookies in various ways:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
                <li>Browser extensions: Use privacy-focused extensions to block cookies</li>
                <li>Opt-out tools: Use industry opt-out tools for advertising cookies</li>
              </ul>
              <p className="mt-4">
                <strong>Note:</strong> Disabling cookies may affect the functionality of our website and your ability to use certain features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Cookie Consent</h2>
              <p>
                By continuing to use EventCraft, you consent to our use of cookies in accordance with this Cookie Policy. If you do not agree to our use of cookies, you should set your browser settings accordingly or discontinue use of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <p className="mt-2">
                Email: privacy@eventcraft.com<br />
                Address: 123 Event Street, Suite 101, San Francisco, CA 94103
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicyPage;

