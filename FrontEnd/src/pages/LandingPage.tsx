import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export const LandingPage = () => {
  const navigate = useNavigate();
  
  // State for Custom Cursor
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isReady, setIsReady] = useState(false); // To prevent flashing at (0,0)

  // Function to handle vendor navigation (check login status)
  const handleVendorNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/vendors');
    } else {
      navigate('/login');
    }
  };

  // 1. Reveal elements on scroll (Original Functionality)
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const reveal = () => {
      for (let i = 0; i < revealElements.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = revealElements[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          revealElements[i].classList.add('active');
        }
      }
    };
    window.addEventListener('scroll', reveal);
    reveal(); // Initial check on load

    // Setup for custom cursor styling on body/container
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('scroll', reveal);
      document.body.style.cursor = 'default'; // Cleanup cursor style
    };
  }, []);

  // 2. Custom Cursor Tracking (New Functionality)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    // Track mouse position for parallax effect
    const heroSection = document.getElementById('home');
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
      
      // Apply smooth parallax to interactive text
      const interactiveTexts = document.querySelectorAll('.interactive-text');
      interactiveTexts.forEach((text) => {
        const element = text as HTMLElement;
        // Use transform3d for hardware acceleration and smoother movement
        element.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0)`;
      });
    }
    if (!isReady) {
      setIsReady(true);
    }
  }, [isReady]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // 3. Hover Handlers (New Functionality)
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  useEffect(() => {
    // Select all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [data-cursor-hover]'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Scroll to section with offset for sticky header
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Custom Cursor Component
  const CustomCursor = () => {
    return (
      <div
        className={`fixed pointer-events-none z-[9999] rounded-full transition-all duration-300 ease-out 
          ${isReady ? 'opacity-100' : 'opacity-0'}
          ${isHovering 
            ? 'h-12 w-12 bg-indigo-600/50 scale-100 mix-blend-difference' 
            : 'h-3 w-3 bg-indigo-600/80 scale-100'
          }
        `}
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `translate(-50%, -50%)`, // Center the cursor on the mouse
        }}
        aria-hidden="true"
      />
    );
  };

  return (
    <div className="landing-page min-h-screen relative">
      <CustomCursor />
      
      {/* Hero Section with Video Background */}
      <section id="home" className="relative h-screen flex items-end justify-center overflow-hidden">
        {/* Header - Overlay on video */}
        <header className="absolute -top-4 left-0 right-0 px-8 py-6 flex items-center z-20 header-interactive">
          <div className="flex items-center w-1/4">
            <button 
              onClick={() => scrollToSection('home')}
              className="cursor-pointer header-logo-btn"
              data-cursor-hover
            >
              <img src="/LOGO.png" alt="EventCraft Logo" className="h-12 w-auto header-logo" />
            </button>
          </div>
          <nav className="hidden md:flex space-x-8 w-1/2 justify-center items-center">
            <button 
              onClick={() => scrollToSection('problem')}
              className="text-white header-nav-item"
              data-cursor-hover
            >
              Problem
            </button>
            <button 
              onClick={() => scrollToSection('how')}
              className="text-white header-nav-item"
              data-cursor-hover
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('contracts')}
              className="text-white header-nav-item"
              data-cursor-hover
            >
              Contracts
            </button>
            <button 
              onClick={() => scrollToSection('proof')}
              className="text-white header-nav-item"
              data-cursor-hover
            >
              Reviews
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-white header-nav-item"
              data-cursor-hover
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-white header-nav-item"
              data-cursor-hover
            >
              FAQ
            </button>
          </nav>
          <div className="flex items-center space-x-4 w-1/4 justify-end">
            <Link to="/login" className="text-white header-link-item" data-cursor-hover>
              Log In
            </Link>
            <Link to="/register" className="glass-button-signup text-white py-2 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xl" data-cursor-hover>
              Sign Up
            </Link>
          </div>
        </header>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="/hero.jpg" 
          className="absolute inset-0 w-full h-full object-cover opacity-40" 
          aria-hidden="true"
        >
          <source src="/Event (1).mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Top gradient */}
        <div
          className="absolute top-0 left-0 w-full h-40 md:h-56 pointer-events-none"
          style={{
            zIndex: 5,
            background: 'linear-gradient(180deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.5) 50%, rgba(0,0,0,0) 100%)'
          }}
          aria-hidden="true"
        />
        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 w-full h-40 md:h-56 pointer-events-none"
          style={{
            zIndex: 5,
            background: 'linear-gradient(0deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.5) 50%, rgba(0,0,0,0) 100%)'
          }}
          aria-hidden="true"
        />

        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 relative pb-24" style={{ paddingTop: '120px' }}>
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Logo */}
            <div className="mb-6 flex justify-center">
              <div className="logo-interactive-container">
                <img 
                  src="/LOGO.png" 
                  alt="EventCraft Logo" 
                  className="h-56 md:h-80 w-auto logo-interactive" 
                  style={{
                    animation: 'logoFloat 3s ease-in-out infinite, logoFadeIn 2s ease-out'
                  }}
                />
              </div>
            </div>
            <h1 
              className="text-5xl md:text-6xl font-extrabold mb-6 text-white interactive-text"
              style={{
                animation: 'dissolveIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both, textGlow 2s ease-in-out 1.8s infinite',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              <span className="inline-block word-interactive">Craft</span>{' '}
              <span className="inline-block word-interactive">unforgettable</span>{' '}
              <span className="inline-block word-interactive">events</span>
          </h1>
            <p 
              className="text-xl md:text-2xl text-white mb-10 interactive-text"
              style={{
                animation: 'dissolveIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              <span className="inline-block phrase-interactive">Discover verified vendors,</span>{' '}
              <span className="inline-block phrase-interactive">request quotes, negotiate,</span>{' '}
              <span className="inline-block phrase-interactive">sign & pay—one smooth flow.</span>
            </p>
            <div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              style={{
                animation: 'textFadeInUp 1s ease-out 1.1s both'
              }}
            >
              <button 
                onClick={handleVendorNavigation}
                className="glass-button-primary px-8 py-4 rounded-full font-medium transition-all transform hover:-translate-y-1 hover:shadow-xl"
                data-cursor-hover
              >
                Find Vendors
              </button>
              <button 
                onClick={() => scrollToSection('how')} 
                className="glass-button-secondary px-8 py-4 rounded-full font-medium transition-all transform hover:-translate-y-1 hover:shadow-xl"
                data-cursor-hover
              >
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Header for rest of page - Disabled, header only in hero section */}
      <header className="px-8 py-6 flex items-center z-20 sticky top-0 hidden header-interactive" id="sticky-header" style={{ display: 'none' }}>
        <div className="flex items-center w-1/4">
          <button 
            onClick={() => scrollToSection('home')}
            className="cursor-pointer header-logo-btn"
            data-cursor-hover
          >
            <img src="/LOGO.png" alt="EventCraft Logo" className="h-12 w-auto header-logo" />
          </button>
        </div>
        <nav className="hidden md:flex space-x-8 w-1/2 justify-center items-center">
          <button 
            onClick={() => scrollToSection('problem')}
            className="text-white header-nav-item"
            data-cursor-hover
          >
            Problem
          </button>
          <button 
            onClick={() => scrollToSection('how')}
            className="text-white header-nav-item"
            data-cursor-hover
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('contracts')}
            className="text-white header-nav-item"
            data-cursor-hover
          >
            Contracts
          </button>
          <button 
            onClick={() => scrollToSection('proof')}
            className="text-white header-nav-item"
            data-cursor-hover
          >
            Reviews
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="text-white header-nav-item"
            data-cursor-hover
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollToSection('faq')}
            className="text-white header-nav-item"
            data-cursor-hover
          >
            FAQ
          </button>
        </nav>
        <div className="flex items-center space-x-4 w-1/4 justify-end">
          <Link to="/login" className="text-white header-link-item" data-cursor-hover>
            Log In
          </Link>
          <Link to="/register" className="glass-button-signup text-white py-2 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xl" data-cursor-hover>
            Sign Up
          </Link>
        </div>
      </header>
      
      {/* Problem Solution Section */}
      <section id="problem" className="py-24 bg-[#0a0a0f]/40 backdrop-blur-sm relative">
        {/* Top gradient - matches video bottom gradient */}
        <div
          className="absolute top-0 left-0 w-full h-40 md:h-56 pointer-events-none"
          style={{
            zIndex: 1,
            background: 'linear-gradient(180deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.5) 50%, rgba(0,0,0,0) 100%)'
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-3 reveal text-white section-title-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block section-title-word">From</span>{' '}
              <span className="inline-block section-title-word">Chaos</span>{' '}
              <span className="inline-block section-title-word">to</span>{' '}
              <span className="inline-block section-title-word">Clarity</span>
            </h2>
            <p 
              className="text-xl text-gray-300 reveal section-subtitle-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block section-subtitle-phrase">Event planning shouldn't be stressful.</span>{' '}
              <span className="inline-block section-subtitle-phrase">We've simplified the process.</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12 reveal">
              <div className="flex items-start problem-item-interactive">
                <div className="flex-shrink-0 bg-red-100/20 backdrop-blur-sm rounded-full p-3 problem-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 problem-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white problem-title">
                    Endless calls and emails
                  </h3>
                  <p className="text-gray-300 problem-text">
                    Contacting vendors one by one, repeating your requirements
                    again and again.
                  </p>
                </div>
              </div>
              <div className="flex items-start problem-item-interactive">
                <div className="flex-shrink-0 bg-red-100/20 backdrop-blur-sm rounded-full p-3 problem-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 problem-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white problem-title">
                    Unclear pricing
                  </h3>
                  <p className="text-gray-300 problem-text">
                    Hidden fees, confusing packages, and quotes that change
                    without explanation.
                  </p>
                </div>
              </div>
              <div className="flex items-start problem-item-interactive">
                <div className="flex-shrink-0 bg-red-100/20 backdrop-blur-sm rounded-full p-3 problem-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 problem-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white problem-title">
                    No central contract system
                  </h3>
                  <p className="text-gray-300 problem-text">
                    Managing paperwork from multiple vendors in different
                    formats.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-12 reveal">
              <div className="flex items-start solution-item-interactive">
                <div className="flex-shrink-0 bg-green-100/20 backdrop-blur-sm rounded-full p-3 solution-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 solution-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white solution-title">
                    One simple request form
                  </h3>
                  <p className="text-gray-300 solution-text">
                    Submit your event details once and receive responses from
                    multiple vendors.
                  </p>
                </div>
              </div>
              <div className="flex items-start solution-item-interactive">
                <div className="flex-shrink-0 bg-green-100/20 backdrop-blur-sm rounded-full p-3 solution-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 solution-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white solution-title">
                    Transparent pricing
                  </h3>
                  <p className="text-gray-300 solution-text">
                    Clear, itemized quotes that you can compare side-by-side.
                  </p>
                </div>
              </div>
              <div className="flex items-start solution-item-interactive">
                <div className="flex-shrink-0 bg-green-100/20 backdrop-blur-sm rounded-full p-3 solution-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 solution-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2 text-white solution-title">
                    Unified workspace
                  </h3>
                  <p className="text-gray-300 solution-text">
                    Manage quotes, contracts, and payments in one secure
                    platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how" className="py-24 bg-[#0a0a0f]/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-3 reveal text-white how-works-title-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block how-works-title-word">How</span>{' '}
              <span className="inline-block how-works-title-word">EventCraft</span>{' '}
              <span className="inline-block how-works-title-word">Works</span>
            </h2>
            <p 
              className="text-xl text-gray-300 reveal how-works-subtitle-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block how-works-subtitle-phrase">Four simple steps</span>{' '}
              <span className="inline-block how-works-subtitle-phrase">to your perfect event</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div data-cursor-hover className="how-works-card-interactive bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-md reveal border border-white/10 relative overflow-hidden">
              <div className="h-12 w-12 bg-indigo-100/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 how-works-icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 how-works-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white how-works-card-title">Tell us your needs</h3>
              <p className="text-gray-300 how-works-card-text">
                Share your event date, location, guest count, and specific
                requirements.
              </p>
            </div>

            <div data-cursor-hover className="how-works-card-interactive bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-md reveal border border-white/10 relative overflow-hidden">
              <div className="h-12 w-12 bg-indigo-100/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 how-works-icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 how-works-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white how-works-card-title">
                Get comparable quotes
              </h3>
              <p className="text-gray-300 how-works-card-text">
                Receive detailed proposals from vetted vendors in your area.
              </p>
            </div>

            <div data-cursor-hover className="how-works-card-interactive bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-md reveal border border-white/10 relative overflow-hidden">
              <div className="h-12 w-12 bg-indigo-100/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 how-works-icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 how-works-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white how-works-card-title">Negotiate & accept</h3>
              <p className="text-gray-300 how-works-card-text">
                Message vendors directly, adjust quotes, and accept your
                preferred offer.
              </p>
            </div>

            <div data-cursor-hover className="how-works-card-interactive bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-md reveal border border-white/10 relative overflow-hidden">
              <div className="h-12 w-12 bg-indigo-100/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 how-works-icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 how-works-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white how-works-card-title">
                E-sign & pay deposit
              </h3>
              <p className="text-gray-300 how-works-card-text">
                Finalize contracts electronically and make secure payments
                through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contracts & Payments Section */}
      <section id="contracts" className="py-24 bg-[#0a0a0f]/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-3 reveal text-white contracts-title-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block contracts-title-word">Seamless</span>{' '}
              <span className="inline-block contracts-title-word">Contracts</span>{' '}
              <span className="inline-block contracts-title-word">&</span>{' '}
              <span className="inline-block contracts-title-word">Payments</span>
            </h2>
            <p 
              className="text-xl text-gray-300 reveal contracts-subtitle-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block contracts-subtitle-phrase">Sign contracts</span>{' '}
              <span className="inline-block contracts-subtitle-phrase">and make secure payments</span>{' '}
              <span className="inline-block contracts-subtitle-phrase">in one place</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10 contracts-card-interactive">
                <h3 className="text-xl font-semibold mb-6 text-white contracts-card-title">
                  Simple E-Signature
                </h3>
                <div className="border border-white/20 rounded-lg p-6 mb-6 bg-[#0a0a0f]/50">
                  <p className="text-gray-300 mb-8">
                    By signing below, I agree to the terms and conditions
                    outlined in this contract between myself and Elegant Events
                    for services to be provided on June 15, 2023.
                  </p>
                  <div className="h-16 border-b border-gray-400 flex items-end justify-center">
                    <span className="text-2xl text-indigo-400 font-signature italic">
                      Jessica Thompson
                    </span>
                  </div>
                  <div className="mt-2 text-center text-gray-400 text-sm">
                    Signed electronically on May 20, 2023
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Document ID: EC-2023-0568</span>
                  <span>Secured with 256-bit encryption</span>
                </div>
              </div>
            </div>
            <div className="reveal">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10 contracts-card-interactive">
                <h3 className="text-xl font-semibold mb-6 text-white contracts-card-title">
                  Milestone Payments
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
                    <div>
                      <span className="block font-medium text-white">Deposit (25%)</span>
                      <span className="text-sm text-gray-300">
                        Due: May 25, 2023
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block font-medium text-white">Rs. 150,000</span>
                      <span className="text-sm text-green-400">Paid</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
                    <div>
                      <span className="block font-medium text-white">Progress (50%)</span>
                      <span className="text-sm text-gray-300">
                        Due: June 1, 2023
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block font-medium text-white">Rs. 300,000</span>
                      <button className="text-sm text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
                        Pay Now
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-500/20 border border-gray-500/30 rounded-lg backdrop-blur-sm">
                  <div>
                      <span className="block font-medium text-white">Final (25%)</span>
                      <span className="text-sm text-gray-300">
                        Due: June 10, 2023
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block font-medium text-white">Rs. 150,000</span>
                      <span className="text-sm text-gray-400">Upcoming</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-sm text-center text-gray-400">
                  Secure payments via Stripe, PayPal, or bank transfer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="proof" className="py-24 bg-[#0a0a0f]/40 backdrop-blur-sm overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-3 reveal text-white social-proof-title-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block social-proof-title-word">Trusted</span>{' '}
              <span className="inline-block social-proof-title-word">by</span>{' '}
              <span className="inline-block social-proof-title-word">Thousands</span>
            </h2>
            <p 
              className="text-xl text-gray-300 reveal social-proof-subtitle-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block social-proof-subtitle-phrase">Join over 1,200+ couples</span>{' '}
              <span className="inline-block social-proof-subtitle-phrase">and event planners</span>{' '}
              <span className="inline-block social-proof-subtitle-phrase">who love EventCraft</span>
            </p>
          </div>
          
          {/* Scrolling Testimonials */}
          <div className="relative">
            {/* Row 1 - Scrolling Right */}
            <div className="testimonials-scroll-right mb-8">
              <div className="flex gap-6 testimonials-track">
                {/* Duplicate testimonials for seamless scroll */}
                {[...Array(2)].map((_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    {/* Testimonial 1 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 flex-shrink-0 w-[380px] testimonial-card-interactive">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        "EventCraft made wedding planning so much easier. We found our
                        dream photographer and caterer in one day, and the quote
                        negotiation feature saved us over Rs. 120,000!"
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" alt="Sarah J." className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Sarah J.</h4>
                          <p className="text-sm text-gray-400">Wedding, June 2023</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 flex-shrink-0 w-[380px] testimonial-card-interactive">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        "As a corporate event planner, I need reliable vendors fast.
                        EventCraft's platform lets me book trusted professionals in
                        minutes instead of days. A game-changer for my business."
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" alt="Michael T." className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Michael T.</h4>
                          <p className="text-sm text-gray-400">Corporate Events</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 flex-shrink-0 w-[380px] testimonial-card-interactive">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        "The e-signature and payment system is brilliant. No more
                        chasing vendors for contracts or wondering if payments went
                        through. Everything is tracked in one place."
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" alt="Jennifer K." className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Jennifer K.</h4>
                          <p className="text-sm text-gray-400">Birthday Gala, March 2023</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 4 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 flex-shrink-0 w-[380px] testimonial-card-interactive">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        "I planned my daughter's sweet 16 using EventCraft. Found amazing
                        decorators, a DJ, and caterer all in one platform. The messaging
                        feature made coordination effortless!"
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" alt="Lisa M." className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Lisa M.</h4>
                          <p className="text-sm text-gray-400">Sweet 16 Party, May 2023</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 5 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 flex-shrink-0 w-[380px] testimonial-card-interactive">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        "The vendor verification process gave me confidence. Every vendor
                        I worked with was professional and delivered exactly as promised.
                        Highly recommend!"
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" alt="David R." className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">David R.</h4>
                          <p className="text-sm text-gray-400">Anniversary Party, July 2023</p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Row 2 - Scrolling Left */}
            <div className="testimonials-scroll-left">
              <div className="flex gap-6 testimonials-track">
                {/* Duplicate testimonials for seamless scroll */}
                {[...Array(2)].map((_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    {/* Testimonial 6 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 flex-shrink-0 w-[380px] testimonial-card-interactive">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        "EventCraft saved me weeks of research. The comparison feature
                        helped me choose the perfect venue and photographer. The whole
                        process was smooth from start to finish."
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" alt="Emma W." className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Emma W.</h4>
                          <p className="text-sm text-gray-400">Engagement Party, August 2023</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 7 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 flex-shrink-0 w-[380px] testimonial-card-interactive">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        "The payment milestone system is genius! I could pay vendors
                        as services were completed. It gave me peace of mind and
                        kept everything organized."
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" alt="Rachel P." className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Rachel P.</h4>
                          <p className="text-sm text-gray-400">Baby Shower, September 2023</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 8 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 flex-shrink-0 w-[380px] testimonial-card-interactive">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        "I've used EventCraft for three events now. Each time it gets
                        better. The vendor profiles are detailed, and the messaging
                        system makes communication effortless."
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" alt="James L." className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">James L.</h4>
                          <p className="text-sm text-gray-400">Corporate Retreat, October 2023</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 9 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 flex-shrink-0 w-[380px] testimonial-card-interactive">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        "The quote comparison feature is a lifesaver! I could see all
                        my options side by side and make informed decisions. Saved me
                        both time and money."
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" alt="Olivia H." className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Olivia H.</h4>
                          <p className="text-sm text-gray-400">Graduation Party, November 2023</p>
                        </div>
                      </div>
                    </div>

                    {/* Testimonial 10 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10 flex-shrink-0 w-[380px] testimonial-card-interactive">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-6">
                        "EventCraft's customer support is outstanding. They helped me
                        resolve a payment issue within minutes. This platform truly
                        cares about its users."
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80" alt="Mark S." className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Mark S.</h4>
                          <p className="text-sm text-gray-400">Holiday Party, December 2023</p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#0a0a0f]/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-3 reveal text-white pricing-title-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block pricing-title-word">Simple,</span>{' '}
              <span className="inline-block pricing-title-word">Transparent</span>{' '}
              <span className="inline-block pricing-title-word">Pricing</span>
            </h2>
            <p 
              className="text-xl text-gray-300 reveal pricing-subtitle-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block pricing-subtitle-phrase">No monthly fees</span>{' '}
              <span className="inline-block pricing-subtitle-phrase">or hidden charges</span>
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-md border border-white/10 reveal pricing-card-interactive">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">Event Planner</h3>
                <p className="text-gray-300">
                  Perfect for couples and one-time event organizers
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Free</span>
                <span className="text-gray-400 ml-2">forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Unlimited vendor browsing</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Up to 10 quote requests</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Secure messaging with vendors</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Basic contract e-signing</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">3% service fee on payments</span>
                </li>
              </ul>
              <Link to="/register" className="block text-center bg-white/10 border border-indigo-400 text-indigo-400 px-6 py-3 rounded-lg hover:bg-indigo-500/20 transition-colors" data-cursor-hover>
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600/80 backdrop-blur-sm rounded-xl p-8 shadow-md text-white reveal border border-indigo-400/30 pricing-card-interactive pricing-card-pro">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Event Professional</h3>
                <p className="text-indigo-100">
                  For professional planners and frequent organizers
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">Rs. 3,500</span>
                <span className="text-indigo-200 ml-2">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Everything in Free plan</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited quote requests</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced contract templates</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Multiple event management</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Only 1.5% service fee on payments</span>
                </li>
              </ul>
              <Link to="/register" className="block text-center bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors" data-cursor-hover>
                Start 14-Day Free Trial
          </Link>
            </div>
          </div>
          <div className="max-w-3xl mx-auto mt-12 text-center text-gray-300 reveal">
            <p>
              All plans include secure payment processing, vendor verification,
              and 24/7 support.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#0a0a0f]/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-3 reveal text-white faq-title-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block faq-title-word">Frequently</span>{' '}
              <span className="inline-block faq-title-word">Asked</span>{' '}
              <span className="inline-block faq-title-word">Questions</span>
            </h2>
            <p 
              className="text-xl text-gray-300 reveal faq-subtitle-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block faq-subtitle-phrase">Everything you need to know</span>{' '}
              <span className="inline-block faq-subtitle-phrase">about EventCraft</span>
            </p>
          </div>
          <div className="max-w-3xl mx-auto divide-y divide-gray-700">
            {/* FAQ Item 1 */}
            <div className="py-6 reveal faq-item-interactive">
              <h3 className="text-lg font-semibold mb-2 text-white faq-question">
                How do payments work on EventCraft?
              </h3>
              <p className="text-gray-300">
                EventCraft processes payments securely through Stripe. You can
                pay vendors using credit/debit cards, ACH transfers, or PayPal.
                Payments are typically structured as milestones (deposit,
                progress payments, final payment), and you'll receive receipts
                and payment confirmations automatically.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="py-6 reveal faq-item-interactive">
              <h3 className="text-lg font-semibold mb-2 text-white faq-question">
                What if I need to cancel my event or vendor?
              </h3>
              <p className="text-gray-300">
                Cancellation policies are set by each vendor and clearly
                outlined in their contracts. EventCraft makes these policies
                transparent before you book. If you need to cancel, the platform
                will guide you through the process according to the terms you
                agreed to, including any applicable refunds.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="py-6 reveal faq-item-interactive">
              <h3 className="text-lg font-semibold mb-2 text-white faq-question">
                How does vendor verification work?
              </h3>
              <p className="text-gray-300">
                We verify all vendors through a rigorous process that includes
                business license verification, portfolio review, reference
                checks, and proof of insurance. Vendors must maintain a
                satisfaction rating of at least 4.0/5.0 to remain on our
                platform, ensuring you work with only qualified professionals.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="py-6 reveal faq-item-interactive">
              <h3 className="text-lg font-semibold mb-2 text-white faq-question">
                Can I negotiate quotes with vendors?
              </h3>
              <p className="text-gray-300">
                Absolutely! EventCraft's platform is designed to facilitate
                transparent negotiations. You can request changes to quotes, add
                or remove services, and counter-offer directly through the
                messaging system. All changes are tracked and documented for
                clarity.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="py-6 reveal faq-item-interactive">
              <h3 className="text-lg font-semibold mb-2 text-white faq-question">
                What kind of support does EventCraft offer?
              </h3>
              <p className="text-gray-300">
                We offer 24/7 customer support via chat, email, and phone. Our
                support team can assist with platform questions, payment issues,
                vendor communications, and contract concerns. For premium users,
                we also provide dedicated account managers to help with complex
                event planning needs.
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div className="py-6 reveal">
              <h3 className="text-lg font-semibold mb-2 text-white">
                Are there any hidden fees?
              </h3>
              <p className="text-gray-300">
                No hidden fees. EventCraft charges a transparent service fee on
                payments (3% for free accounts, 1.5% for premium accounts) which
                is clearly displayed before you confirm any transaction. There
                are no surprise charges or additional costs beyond what's shown
                in your quote and contract.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0a0a0f]/40 backdrop-blur-sm text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-3 reveal text-white cta-title-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block cta-title-word">Ready</span>{' '}
              <span className="inline-block cta-title-word">to</span>{' '}
              <span className="inline-block cta-title-word">craft</span>{' '}
              <span className="inline-block cta-title-word">your</span>{' '}
              <span className="inline-block cta-title-word">perfect</span>{' '}
              <span className="inline-block cta-title-word">event?</span>
            </h2>
            <p 
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto reveal cta-subtitle-interactive"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="inline-block cta-subtitle-phrase">Join thousands of event planners</span>{' '}
              <span className="inline-block cta-subtitle-phrase">who have simplified their process</span>{' '}
              <span className="inline-block cta-subtitle-phrase">and created unforgettable experiences</span>{' '}
              <span className="inline-block cta-subtitle-phrase">with EventCraft.</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 reveal">
              <Link to="/register" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-medium cta-button-primary transition-all transform hover:-translate-y-1 hover:shadow-lg" data-cursor-hover>
                Get Started for Free
              </Link>
              <button 
                onClick={handleVendorNavigation}
                className="px-8 py-4 bg-indigo-600/80 backdrop-blur-sm border border-indigo-400/50 text-white rounded-full font-medium cta-button-secondary transition-all transform hover:-translate-y-1 hover:shadow-lg" 
                data-cursor-hover
              >
                Browse Vendors
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Add CSS for reveal animations */}
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        .font-signature {
          font-family: 'Brush Script MT', cursive;
        }
        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
        @keyframes logoFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(50px) rotate(-5deg);
            filter: blur(10px);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1) translateY(-10px) rotate(2deg);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(0deg);
            filter: blur(0px);
          }
        }
        @keyframes textFadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes dissolveIn {
          0% {
            opacity: 0;
            filter: blur(20px);
            transform: scale(0.95);
          }
          50% {
            opacity: 0.5;
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
          }
        }
        @keyframes textSlideIn {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes letterSlide {
          0% {
            opacity: 0;
            transform: translateY(30px) rotateX(90deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }
        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2);
          }
          50% {
            text-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3);
          }
        }
        @keyframes textReveal {
          0% {
            opacity: 0;
            transform: translateY(40px);
            clip-path: inset(0 100% 0 0);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            clip-path: inset(0 0 0 0);
          }
        }
        @keyframes wordFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .word-interactive {
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: default;
          display: inline-block;
          will-change: transform, color, text-shadow;
          transform: translate3d(0, 0, 0);
        }
        .word-interactive:hover {
          transform: translate3d(0, -8px, 0) scale(1.1) rotate(2deg) !important;
          text-shadow: 0 10px 30px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.4);
          color: #a78bfa;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .word-interactive:active {
          transform: translate3d(0, -6px, 0) scale(1.08) rotate(1.5deg) !important;
        }
        .phrase-interactive {
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: default;
          display: inline-block;
          padding: 4px 8px;
          border-radius: 8px;
          will-change: transform, background-color, color, text-shadow;
          transform: translate3d(0, 0, 0);
        }
        .phrase-interactive:hover {
          transform: translate3d(0, -4px, 0) scale(1.05) !important;
          background: rgba(139, 92, 246, 0.15);
          text-shadow: 0 5px 20px rgba(139, 92, 246, 0.5);
          color: #c4b5fd;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .phrase-interactive:active {
          transform: translate3d(0, -3px, 0) scale(1.03) !important;
        }
        .interactive-text {
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
        .logo-interactive-container {
          position: relative;
          display: inline-block;
          padding: 20px;
          border-radius: 50%;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .logo-interactive-container::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.4));
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          transform: scale(0.8);
          z-index: 0;
        }
        .logo-interactive-container::after {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border-radius: 50%;
          border: 3px solid rgba(139, 92, 246, 0.6);
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          transform: scale(0.9);
          z-index: 0;
        }
        .logo-interactive-container:hover::before {
          opacity: 1;
          transform: scale(1.1);
          animation: borderPulse 2s ease-in-out infinite;
        }
        .logo-interactive-container:hover::after {
          opacity: 1;
          transform: scale(1.15);
          animation: borderPulse 2s ease-in-out infinite 0.1s;
        }
        .logo-interactive-container:hover {
          transform: scale(1.05);
        }
        .logo-interactive {
          position: relative;
          z-index: 1;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 0 0 rgba(139, 92, 246, 0));
        }
        .logo-interactive-container:hover .logo-interactive {
          transform: scale(1.1) translateY(-5px);
          filter: drop-shadow(0 10px 30px rgba(139, 92, 246, 0.5)) drop-shadow(0 0 20px rgba(139, 92, 246, 0.3));
        }
        @keyframes borderPulse {
          0%, 100% {
            border-color: rgba(139, 92, 246, 0.6);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          }
          50% {
            border-color: rgba(139, 92, 246, 1);
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.6);
          }
        }
        .header-interactive {
          transition: all 0.3s ease;
        }
        .header-logo-btn {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 8px;
          border-radius: 12px;
        }
        .header-logo-btn:hover {
          transform: scale(1.1) rotate(5deg);
          background: rgba(139, 92, 246, 0.1);
        }
        .header-logo {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 0 0 rgba(139, 92, 246, 0));
        }
        .header-logo-btn:hover .header-logo {
          filter: drop-shadow(0 5px 15px rgba(139, 92, 246, 0.5));
          transform: scale(1.05);
        }
        .header-nav-item {
          position: relative;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .header-nav-item::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, rgba(139, 92, 246, 0.8), rgba(99, 102, 241, 0.8));
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .header-nav-item:hover {
          color: #c4b5fd;
          transform: translateY(-2px);
          background: rgba(139, 92, 246, 0.1);
        }
        .header-nav-item:hover::before {
          width: 80%;
        }
        .header-link-item {
          position: relative;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .header-link-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: rgba(139, 92, 246, 0.8);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .header-link-item:hover {
          color: #c4b5fd;
          transform: translateY(-2px);
          background: rgba(139, 92, 246, 0.1);
        }
        .header-link-item:hover::after {
          width: 70%;
        }
        .problem-item-interactive {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 16px;
          border-radius: 12px;
          cursor: default;
        }
        .problem-item-interactive:hover {
          transform: translateX(8px) translateY(-4px);
          background: rgba(239, 68, 68, 0.1);
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.2);
        }
        .problem-icon-container {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .problem-item-interactive:hover .problem-icon-container {
          transform: scale(1.2) rotate(90deg);
          background: rgba(239, 68, 68, 0.3);
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
        }
        .problem-icon {
          transition: all 0.4s ease;
        }
        .problem-item-interactive:hover .problem-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.8));
        }
        .problem-title {
          transition: all 0.3s ease;
        }
        .problem-item-interactive:hover .problem-title {
          color: #fca5a5;
          transform: translateX(4px);
        }
        .problem-text {
          transition: all 0.3s ease;
        }
        .problem-item-interactive:hover .problem-text {
          color: #fecaca;
        }
        .solution-item-interactive {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 16px;
          border-radius: 12px;
          cursor: default;
        }
        .solution-item-interactive:hover {
          transform: translateX(-8px) translateY(-4px);
          background: rgba(34, 197, 94, 0.1);
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.2);
        }
        .solution-icon-container {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .solution-item-interactive:hover .solution-icon-container {
          transform: scale(1.2) rotate(-15deg);
          background: rgba(34, 197, 94, 0.3);
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
        }
        .solution-icon {
          transition: all 0.4s ease;
        }
        .solution-item-interactive:hover .solution-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.8));
        }
        .solution-title {
          transition: all 0.3s ease;
        }
        .solution-item-interactive:hover .solution-title {
          color: #86efac;
          transform: translateX(-4px);
        }
        .solution-text {
          transition: all 0.3s ease;
        }
        .solution-item-interactive:hover .solution-text {
          color: #bbf7d0;
        }
        .section-title-interactive {
          transition: all 0.3s ease;
        }
        .section-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .section-title-word:hover {
          transform: translateY(-6px) scale(1.1);
          color: #c4b5fd;
          text-shadow: 0 8px 24px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .section-subtitle-interactive {
          transition: all 0.3s ease;
        }
        .section-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          padding: 4px 8px;
          border-radius: 8px;
          cursor: default;
        }
        .section-subtitle-phrase:hover {
          transform: translateY(-4px) scale(1.05);
          color: #e9d5ff;
          background: rgba(139, 92, 246, 0.15);
          text-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .how-works-title-interactive {
          transition: all 0.3s ease;
        }
        .how-works-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .how-works-title-word:hover {
          transform: translateY(-6px) scale(1.1);
          color: #c4b5fd;
          text-shadow: 0 8px 24px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .how-works-subtitle-interactive {
          transition: all 0.3s ease;
        }
        .how-works-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          padding: 4px 8px;
          border-radius: 8px;
          cursor: default;
        }
        .how-works-subtitle-phrase:hover {
          transform: translateY(-4px) scale(1.05);
          color: #e9d5ff;
          background: rgba(139, 92, 246, 0.15);
          text-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .how-works-card-interactive {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          cursor: default;
        }
        .how-works-card-interactive::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(99, 102, 241, 0.5));
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          transform: scale(0.95);
          z-index: -1;
        }
        .how-works-card-interactive::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 14px;
          border: 2px solid rgba(139, 92, 246, 0.6);
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          transform: scale(0.98);
          z-index: 0;
        }
        .how-works-card-interactive:hover {
          transform: translateY(-8px) scale(1.02);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 16px 48px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2);
        }
        .how-works-card-interactive:hover::before {
          opacity: 1;
          transform: scale(1.05);
        }
        .how-works-card-interactive:hover::after {
          opacity: 1;
          transform: scale(1.02);
          animation: cardBorderPulse 2s ease-in-out infinite;
        }
        .how-works-icon-container {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .how-works-card-interactive:hover .how-works-icon-container {
          transform: scale(1.15) rotate(5deg);
          background: rgba(139, 92, 246, 0.3);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
        }
        .how-works-icon {
          transition: all 0.5s ease;
        }
        .how-works-card-interactive:hover .how-works-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.8));
          color: #c4b5fd;
        }
        .how-works-card-title {
          transition: all 0.4s ease;
        }
        .how-works-card-interactive:hover .how-works-card-title {
          color: #c4b5fd;
          transform: translateY(-2px);
          text-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        .how-works-card-text {
          transition: all 0.4s ease;
        }
        .how-works-card-interactive:hover .how-works-card-text {
          color: #e9d5ff;
        }
        .contracts-title-interactive {
          transition: all 0.3s ease;
        }
        .contracts-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .contracts-title-word:hover {
          transform: translateY(-6px) scale(1.1);
          color: #818cf8;
          text-shadow: 0 8px 24px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3);
        }
        .contracts-subtitle-interactive {
          transition: all 0.3s ease;
        }
        .contracts-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          padding: 4px 8px;
          border-radius: 8px;
          cursor: default;
        }
        .contracts-subtitle-phrase:hover {
          transform: translateY(-4px) scale(1.05);
          color: #c7d2fe;
          background: rgba(99, 102, 241, 0.15);
          text-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        }
        .contracts-card-interactive {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          cursor: default;
        }
        .contracts-card-interactive::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.5));
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          transform: scale(0.95);
          z-index: -1;
        }
        .contracts-card-interactive::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 14px;
          border: 2px solid rgba(99, 102, 241, 0.6);
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          transform: scale(0.98);
          z-index: 0;
        }
        .contracts-card-interactive:hover {
          transform: translateY(-8px) scale(1.02);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 16px 48px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.2);
        }
        .contracts-card-interactive:hover::before {
          opacity: 1;
          transform: scale(1.05);
        }
        .contracts-card-interactive:hover::after {
          opacity: 1;
          transform: scale(1.02);
          animation: cardBorderPulse 2s ease-in-out infinite;
        }
        .contracts-card-title {
          transition: all 0.4s ease;
        }
        .contracts-card-interactive:hover .contracts-card-title {
          color: #818cf8;
          transform: translateY(-2px);
          text-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        }
        .social-proof-title-interactive {
          transition: all 0.3s ease;
        }
        .social-proof-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .social-proof-title-word:hover {
          transform: translateY(-6px) scale(1.1);
          color: #fbbf24;
          text-shadow: 0 8px 24px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3);
        }
        .social-proof-subtitle-interactive {
          transition: all 0.3s ease;
        }
        .social-proof-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          padding: 4px 8px;
          border-radius: 8px;
          cursor: default;
        }
        .social-proof-subtitle-phrase:hover {
          transform: translateY(-4px) scale(1.05);
          color: #fde68a;
          background: rgba(251, 191, 36, 0.15);
          text-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
        }
        .testimonial-card-interactive {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: default;
        }
        .testimonial-card-interactive:hover {
          transform: translateY(-6px) scale(1.02);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 12px 32px rgba(251, 191, 36, 0.2), 0 0 30px rgba(251, 191, 36, 0.1);
          border-color: rgba(251, 191, 36, 0.3);
        }
        .testimonials-scroll-right {
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .testimonials-scroll-left {
          overflow: hidden;
          mask-image: linear-gradient(to left, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to left, transparent, black 10%, black 90%, transparent);
        }
        .testimonials-track {
          display: flex;
          width: fit-content;
          animation-duration: 40s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .testimonials-scroll-right .testimonials-track {
          animation-name: scrollRight;
        }
        .testimonials-scroll-left .testimonials-track {
          animation-name: scrollLeft;
        }
        @keyframes scrollRight {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scrollLeft {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .pricing-title-interactive {
          transition: all 0.3s ease;
        }
        .pricing-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .pricing-title-word:hover {
          transform: translateY(-6px) scale(1.1);
          color: #818cf8;
          text-shadow: 0 8px 24px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3);
        }
        .pricing-subtitle-interactive {
          transition: all 0.3s ease;
        }
        .pricing-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          padding: 4px 8px;
          border-radius: 8px;
          cursor: default;
        }
        .pricing-subtitle-phrase:hover {
          transform: translateY(-4px) scale(1.05);
          color: #c7d2fe;
          background: rgba(99, 102, 241, 0.15);
          text-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        }
        .pricing-card-interactive {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          cursor: default;
        }
        .pricing-card-interactive::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.5));
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          transform: scale(0.95);
          z-index: -1;
        }
        .pricing-card-interactive:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 16px 48px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.2);
        }
        .pricing-card-interactive:hover::before {
          opacity: 1;
          transform: scale(1.05);
        }
        .pricing-card-pro:hover {
          box-shadow: 0 16px 48px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.3);
        }
        .faq-title-interactive {
          transition: all 0.3s ease;
        }
        .faq-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .faq-title-word:hover {
          transform: translateY(-6px) scale(1.1);
          color: #34d399;
          text-shadow: 0 8px 24px rgba(52, 211, 153, 0.5), 0 0 20px rgba(52, 211, 153, 0.3);
        }
        .faq-subtitle-interactive {
          transition: all 0.3s ease;
        }
        .faq-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          padding: 4px 8px;
          border-radius: 8px;
          cursor: default;
        }
        .faq-subtitle-phrase:hover {
          transform: translateY(-4px) scale(1.05);
          color: #6ee7b7;
          background: rgba(52, 211, 153, 0.15);
          text-shadow: 0 4px 16px rgba(52, 211, 153, 0.4);
        }
        .faq-item-interactive {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 16px;
          border-radius: 12px;
          cursor: default;
        }
        .faq-item-interactive:hover {
          transform: translateX(8px);
          background: rgba(52, 211, 153, 0.1);
          box-shadow: 0 8px 24px rgba(52, 211, 153, 0.2);
        }
        .faq-question {
          transition: all 0.3s ease;
        }
        .faq-item-interactive:hover .faq-question {
          color: #6ee7b7;
          transform: translateX(4px);
        }
        .cta-title-interactive {
          transition: all 0.3s ease;
        }
        .cta-title-word {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          cursor: default;
        }
        .cta-title-word:hover {
          transform: translateY(-6px) scale(1.1);
          color: #fbbf24;
          text-shadow: 0 8px 24px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3);
        }
        .cta-subtitle-interactive {
          transition: all 0.3s ease;
        }
        .cta-subtitle-phrase {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          padding: 4px 8px;
          border-radius: 8px;
          cursor: default;
        }
        .cta-subtitle-phrase:hover {
          transform: translateY(-4px) scale(1.05);
          color: #fde68a;
          background: rgba(251, 191, 36, 0.15);
          text-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
        }
        .cta-button-primary {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .cta-button-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .cta-button-primary:hover::before {
          left: 100%;
        }
        .cta-button-primary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px rgba(251, 191, 36, 0.3), 0 0 20px rgba(251, 191, 36, 0.2);
          transform: translateY(-4px) scale(1.05);
        }
        .cta-button-secondary {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .cta-button-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .cta-button-secondary:hover::before {
          left: 100%;
        }
        .cta-button-secondary:hover {
          background: rgba(99, 102, 241, 0.9);
          border-color: rgba(139, 92, 246, 0.8);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4), 0 0 20px rgba(139, 92, 246, 0.3);
          transform: translateY(-4px) scale(1.05);
        }
        .footer-interactive {
          transition: all 0.3s ease;
        }
        .footer-brand-column {
          transition: all 0.3s ease;
        }
        .footer-logo-link {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
        }
        .footer-logo-link:hover {
          transform: scale(1.1) translateY(-2px);
          filter: drop-shadow(0 8px 16px rgba(99, 102, 241, 0.4));
        }
        .footer-logo {
          transition: all 0.3s ease;
        }
        .footer-description {
          transition: all 0.3s ease;
        }
        .footer-brand-column:hover .footer-description {
          color: #c7d2fe;
        }
        .footer-social-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
        }
        .footer-social-icon:hover {
          transform: translateY(-4px) scale(1.2);
          color: #818cf8;
        }
        .footer-column {
          transition: all 0.3s ease;
        }
        .footer-column-title {
          transition: all 0.3s ease;
        }
        .footer-column:hover .footer-column-title {
          color: #818cf8;
          transform: translateX(4px);
        }
        .footer-link {
          transition: all 0.3s ease;
          display: inline-block;
        }
        .footer-link:hover {
          transform: translateX(6px);
          color: #c7d2fe;
        }
        .footer-policy-link {
          transition: all 0.3s ease;
          position: relative;
        }
        .footer-policy-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8));
          transition: width 0.3s ease;
        }
        .footer-policy-link:hover::after {
          width: 100%;
        }
        .footer-policy-link:hover {
          color: #c7d2fe;
          transform: translateY(-2px);
        }
        @keyframes cardBorderPulse {
          0%, 100% {
            border-color: rgba(139, 92, 246, 0.4);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
          }
          50% {
            border-color: rgba(139, 92, 246, 0.8);
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
          }
        }
        .glass-button-primary {
          background: rgba(139, 92, 246, 0.2);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        .glass-button-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        .glass-button-primary:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 12px 40px rgba(139, 92, 246, 0.3), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .glass-button-primary:hover::before {
          left: 100%;
        }
        .glass-button-secondary {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        .glass-button-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        .glass-button-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 12px 40px rgba(255, 255, 255, 0.2), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .glass-button-secondary:hover::before {
          left: 100%;
        }
        .glass-button-signup {
          background: rgba(139, 92, 246, 0.25);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.25), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        .glass-button-signup::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transition: left 0.5s;
        }
        .glass-button-signup:hover {
          background: rgba(139, 92, 246, 0.35);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 12px 40px rgba(139, 92, 246, 0.35), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .glass-button-signup:hover::before {
          left: 100%;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal {
            transition: none;
          }
          img[style*="logoFloat"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
