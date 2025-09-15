import React, { useRef } from 'react';
import { Link } from 'react-scroll';
import { HomeIcon, InfoIcon, ListOrderedIcon, StoreIcon, MessageSquareIcon, FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon, MapPinIcon, PhoneIcon, MailIcon, ChevronRightIcon } from 'lucide-react';
export function App() {
  // Refs for scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const vendorsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  return <div className="font-sans text-gray-800">
      {/* Navigation - Moved to top */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-md z-50 py-3 px-4 md:py-4">
        <div className="container mx-auto">
          <ul className="flex justify-around items-center">
            <li>
              <Link to="home" spy={true} smooth={true} offset={-70} duration={500} className="flex flex-col items-center text-gray-600 hover:text-teal-500 transition-colors cursor-pointer">
                <HomeIcon className="h-6 w-6" />
                <span className="text-xs mt-1">Home</span>
              </Link>
            </li>
            <li>
              <Link to="about" spy={true} smooth={true} offset={-70} duration={500} className="flex flex-col items-center text-gray-600 hover:text-teal-500 transition-colors cursor-pointer">
                <InfoIcon className="h-6 w-6" />
                <span className="text-xs mt-1">About</span>
              </Link>
            </li>
            <li>
              <Link to="steps" spy={true} smooth={true} offset={-70} duration={500} className="flex flex-col items-center text-gray-600 hover:text-teal-500 transition-colors cursor-pointer">
                <ListOrderedIcon className="h-6 w-6" />
                <span className="text-xs mt-1">Steps</span>
              </Link>
            </li>
            <li>
              <Link to="vendors" spy={true} smooth={true} offset={-70} duration={500} className="flex flex-col items-center text-gray-600 hover:text-teal-500 transition-colors cursor-pointer">
                <StoreIcon className="h-6 w-6" />
                <span className="text-xs mt-1">Vendors</span>
              </Link>
            </li>
            <li>
              <Link to="testimonials" spy={true} smooth={true} offset={-70} duration={500} className="flex flex-col items-center text-gray-600 hover:text-teal-500 transition-colors cursor-pointer">
                <MessageSquareIcon className="h-6 w-6" />
                <span className="text-xs mt-1">Reviews</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      {/* Hero Section */}
      <section ref={heroRef} id="home" className="relative h-screen flex items-center justify-center bg-cover bg-center" style={{
      backgroundImage: "url('photo-1653821355736-0c2598d0a63e.jpeg')"
    }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Make Your Events Unforgettable
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            The all-in-one platform that simplifies event planning from concept
            to celebration
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg">
              Get Started
            </button>
            <button className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold py-3 px-8 rounded-full transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>
      {/* About/Features Section */}
      <section ref={aboutRef} id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Choose Our Platform
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            We bring together everything you need to plan and execute perfect
            events
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Driven Planning</h3>
              <p className="text-gray-600">
                Our AI assistant helps you make decisions, suggests vendors, and
                optimizes your budget.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Vendor Marketplace</h3>
              <p className="text-gray-600">
                Connect with hundreds of pre-vetted vendors specializing in all
                aspects of event management.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Process deposits, installments, and final payments with
                bank-level security and escrow options.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Standard Contracts</h3>
              <p className="text-gray-600">
                Use our legally-vetted contract templates or upload and manage
                your own custom agreements.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Steps Section */}
      <section ref={stepsRef} id="steps" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our simple four-step process takes you from initial concept to
            flawless execution
          </p>
          <div className="max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                <div className="w-20 h-20 bg-teal-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  1
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h3 className="text-2xl font-bold mb-2">
                  Create Your Event Profile
                </h3>
                <p className="text-gray-600 mb-4">
                  Define your event type, budget, guest count, and preferences.
                  Our AI will help you refine your vision and set realistic
                  expectations.
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4">
                  <li>Intuitive questionnaire to define your event</li>
                  <li>Budget calculator with cost breakdown</li>
                  <li>AI-powered suggestions based on your inputs</li>
                </ul>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                <div className="w-20 h-20 bg-teal-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  2
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h3 className="text-2xl font-bold mb-2">
                  Browse & Select Vendors
                </h3>
                <p className="text-gray-600 mb-4">
                  Explore our curated marketplace of pre-vetted vendors. Filter
                  by location, price range, style, and availability to find your
                  perfect match.
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4">
                  <li>Verified reviews from real clients</li>
                  <li>Detailed portfolios with past events</li>
                  <li>Instant availability checking</li>
                </ul>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                <div className="w-20 h-20 bg-teal-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  3
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h3 className="text-2xl font-bold mb-2">
                  Manage Contracts & Payments
                </h3>
                <p className="text-gray-600 mb-4">
                  Handle all your vendor agreements, deposits, and payment
                  schedules in one secure place. No more juggling emails and
                  paperwork.
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4">
                  <li>Digital signatures for all parties</li>
                  <li>Automated payment reminders</li>
                  <li>Secure payment processing with escrow option</li>
                </ul>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                <div className="w-20 h-20 bg-teal-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  4
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h3 className="text-2xl font-bold mb-2">Execute Your Event</h3>
                <p className="text-gray-600 mb-4">
                  Access your event dashboard with timeline, vendor contacts,
                  and day-of coordination tools. Share access with your team for
                  seamless collaboration.
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4">
                  <li>Interactive timeline with notifications</li>
                  <li>Vendor check-in system</li>
                  <li>Post-event feedback and review collection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Vendors Section */}
      <section ref={vendorsRef} id="vendors" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Featured Vendors
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Discover top-rated professionals ready to make your event
            exceptional
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vendor 1 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Elegant Events Catering" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>)}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    4.9 (128 reviews)
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Elegant Events Catering
                </h3>
                <p className="text-gray-600 mb-4">
                  Luxury catering service specializing in farm-to-table cuisine
                  and custom menu creation for weddings and corporate events.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>New York, NY</span>
                </div>
              </div>
            </div>
            {/* Vendor 2 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1554941829-202a0b2403b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Bloom & Petal Florists" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>)}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    4.8 (93 reviews)
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Bloom & Petal Florists
                </h3>
                <p className="text-gray-600 mb-4">
                  Award-winning floral design studio creating stunning
                  arrangements for weddings, galas, and corporate events.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Los Angeles, CA</span>
                </div>
              </div>
            </div>
            {/* Vendor 3 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Rhythm Masters DJ" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>)}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    4.7 (156 reviews)
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Rhythm Masters DJ</h3>
                <p className="text-gray-600 mb-4">
                  Professional DJ and entertainment service with
                  state-of-the-art equipment and extensive music library for all
                  event types.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Chicago, IL</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <button className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg">
              View All Vendors
            </button>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section ref={testimonialsRef} id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Real success stories from event planners and hosts who used our
            platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Sarah Johnson" className="w-14 h-14 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold">Sarah Johnson</h3>
                  <p className="text-sm text-gray-500">Wedding Planner</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>)}
                </div>
              </div>
              <p className="text-gray-600 italic">
                "This platform transformed how I manage client events. The
                vendor marketplace saved me countless hours of research, and the
                contract management tools eliminated paperwork headaches. My
                clients love the transparency!"
              </p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael Chen" className="w-14 h-14 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold">Michael Chen</h3>
                  <p className="text-sm text-gray-500">
                    Corporate Event Manager
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>)}
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Managing multiple corporate events simultaneously became so
                much easier. The AI recommendations are spot-on, and the budget
                tracking tools helped me save 15% on our last conference. This
                is a game-changer."
              </p>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Jessica Rodriguez" className="w-14 h-14 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold">Jessica Rodriguez</h3>
                  <p className="text-sm text-gray-500">Bride</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>)}
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Planning my wedding was overwhelming until I found this
                platform. I could compare vendors side-by-side, read verified
                reviews, and manage all my contracts in one place. My wedding
                day was absolutely perfect!"
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4">EventPro</h3>
              <p className="text-gray-400 mb-6">
                Simplifying event planning from concept to celebration. Our
                all-in-one platform connects you with top vendors and provides
                powerful planning tools.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <FacebookIcon className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <InstagramIcon className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <TwitterIcon className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <LinkedinIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center">
                    <ChevronRightIcon className="w-4 h-4 mr-2" />
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center">
                    <ChevronRightIcon className="w-4 h-4 mr-2" />
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center">
                    <ChevronRightIcon className="w-4 h-4 mr-2" />
                    Vendor Directory
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center">
                    <ChevronRightIcon className="w-4 h-4 mr-2" />
                    Event Types
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center">
                    <ChevronRightIcon className="w-4 h-4 mr-2" />
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center">
                    <ChevronRightIcon className="w-4 h-4 mr-2" />
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPinIcon className="w-5 h-5 mr-3 text-teal-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-400">
                    574 Test Street
                    <br />
                    Sri lanka, 8000
                  </span>
                </li>
                <li className="flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-3 text-teal-400" />
                  <span className="text-gray-400">(555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <MailIcon className="w-5 h-5 mr-3 text-teal-400" />
                  <span className="text-gray-400">contact@eventcraft.com</span>
                </li>
              </ul>
            </div>
            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for event planning tips, vendor
                spotlights, and special offers.
              </p>
              <form className="flex flex-col space-y-3">
                <input type="email" placeholder="Your email address" className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} EventCraft. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}