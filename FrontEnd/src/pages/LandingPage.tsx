import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, TrendingUpIcon, BarChart3Icon } from 'lucide-react';
export const LandingPage = () => {
  const features = [{
    icon: CalendarIcon,
    title: 'Plan',
    description: 'Tools for seamless event creation, scheduling, and management.'
  }, {
    icon: TrendingUpIcon,
    title: 'Promote',
    description: 'Features for marketing, ticketing, and easy registration.'
  }, {
    icon: BarChart3Icon,
    title: 'Analyze',
    description: "Gain valuable insights with data on your event's success."
  }];
  const testimonials = [{
    quote: 'EventCraft transformed how we manage our annual conference. The analytics are a game-changer for understanding our audience.',
    name: 'Jane Doe',
    role: 'Marketing Manager, TechCorp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
  }, {
    quote: 'The ease of use is incredible. I was able to set up ticketing for our community festival in minutes. Highly recommend!',
    name: 'John Smith',
    role: 'Event Planner, Creative Minds',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
  }, {
    quote: 'Finally, a platform that does it all. From promotion to post-event follow-ups, EventCraft streamlines our entire workflow.',
    name: 'Sarah Lee',
    role: 'Founder, Art Showcase',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
  }];
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="min-h-screen bg-[#0a0a0f] w-full text-white">
      <header className="px-8 py-6 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="text-purple-500">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8a4 4 0 100-8 4 4 0 000 8zM26 8a4 4 0 100-8 4 4 0 000 8zM26 18a4 4 0 100-8 4 4 0 000 8zM16 28a4 4 0 100-8 4 4 0 000 8zM6 18a4 4 0 100-8 4 4 0 000 8zM6 28a4 4 0 100-8 4 4 0 000 8zM26 28a4 4 0 100-8 4 4 0 000 8z" fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="0.5" />
              <path d="M16 12v8M22 8l-4 4M22 24l-4-4M10 24l4-4M10 8l4 4" stroke="#8B5CF6" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-bold text-xl">EventCraft</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-400 hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#about" className="text-gray-400 hover:text-white transition-colors">
            About Us
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-white hover:text-gray-300 transition-colors">
            Log In
          </Link>
          <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition-colors">
            Sign Up
          </Link>
        </div>
      </header>
      <section className="relative px-8 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
      }}></div>
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.8
      }} className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Crafting Unforgettable Events, Made Simple
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            The all-in-one platform to plan, promote, and analyze your events
            seamlessly. Get started today and bring your vision to life.
          </p>
          <Link to="/register" className="inline-block bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 rounded-lg text-lg font-medium transition-all transform hover:scale-105">
            Get Started Free
          </Link>
        </motion.div>
      </section>
      <section id="features" className="px-8 py-24 bg-gradient-to-b from-transparent to-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{
          y: 20,
          opacity: 0
        }} whileInView={{
          y: 0,
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              A Powerful Toolkit for Event Organizers
            </h2>
            <p className="text-gray-400 text-lg">
              From initial planning to post-event analysis, EventCraft provides
              the tools you need to create impactful and successful events.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <motion.div key={index} initial={{
              y: 20,
              opacity: 0
            }} whileInView={{
              y: 0,
              opacity: 1
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} whileHover={{
              y: -8,
              transition: {
                duration: 0.2
              }
            }} className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Icon size={32} className="text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>;
          })}
          </div>
        </div>
      </section>
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{
          y: 20,
          opacity: 0
        }} whileInView={{
          y: 0,
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              See EventCraft in Action
            </h2>
            <p className="text-gray-400 text-lg">
              Explore our intuitive interface that makes event management a
              breeze. From dashboards to ticketing, we've designed every detail
              with you in mind.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{
            x: -20,
            opacity: 0
          }} whileInView={{
            x: 0,
            opacity: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-8 aspect-video flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Intuitive Dashboard
                </h3>
                <p className="text-gray-700">
                  Track all your event metrics in one place
                </p>
              </div>
            </motion.div>
            <motion.div initial={{
            x: 20,
            opacity: 0
          }} whileInView={{
            x: 0,
            opacity: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-8 aspect-video flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Effortless Ticketing
                </h3>
                <p className="text-gray-700">
                  Streamline registration and check-in
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="px-8 py-24 bg-gradient-to-b from-gray-900/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{
          y: 20,
          opacity: 0
        }} whileInView={{
          y: 0,
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by Organizers Everywhere
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <motion.div key={index} initial={{
            y: 20,
            opacity: 0
          }} whileInView={{
            y: 0,
            opacity: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <p className="text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>
      <section className="px-8 py-24">
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} whileInView={{
        y: 0,
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to build your next great event?
          </h2>
          <Link to="/register" className="inline-block bg-red-500 hover:bg-red-600 text-white py-4 px-8 rounded-lg text-lg font-medium transition-all transform hover:scale-105">
            Sign Up Now
          </Link>
        </motion.div>
      </section>
      <footer className="border-t border-gray-800 px-8 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-purple-500">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8a4 4 0 100-8 4 4 0 000 8zM26 8a4 4 0 100-8 4 4 0 000 8zM26 18a4 4 0 100-8 4 4 0 000 8zM16 28a4 4 0 100-8 4 4 0 000 8zM6 18a4 4 0 100-8 4 4 0 000 8zM6 28a4 4 0 100-8 4 4 0 000 8zM26 28a4 4 0 100-8 4 4 0 000 8z" fill="#8B5CF6" />
              </svg>
            </div>
            <span className="font-bold">EventCraft</span>
            <span className="text-gray-400 text-sm">
              © 2024 EventCraft Inc. All rights reserved.
            </span>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </motion.div>;
};