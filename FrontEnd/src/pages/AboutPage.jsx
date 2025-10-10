import React from 'react';
import BackButton from '../components/BackButton';
import { Calendar, Users, Store, FileText, MessageSquare, Clock, Star, Award, Target, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About EventCraft</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The ultimate event management platform that revolutionizes how you plan, 
            coordinate, and execute unforgettable events.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <Target className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              To simplify event management by providing a comprehensive platform that connects 
              event planners with trusted vendors, streamlines contract management, and leverages 
              AI technology to deliver exceptional event experiences.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Users className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-gray-600">Comprehensive user management with role-based access control.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Store className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Vendor Network</h3>
              <p className="text-gray-600">Connect with verified vendors and service providers.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Calendar className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Event Planning</h3>
              <p className="text-gray-600">Create and manage events with detailed planning tools.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <FileText className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Contract Management</h3>
              <p className="text-gray-600">Streamlined contract creation and management.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <MessageSquare className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
              <p className="text-gray-600">Intelligent assistant for instant help and guidance.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Clock className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Calendar Integration</h3>
              <p className="text-gray-600">Keep track of all events and important dates.</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-teal-600 rounded-lg shadow-lg p-8 mb-12">
          <div className="text-center text-white">
            <Heart className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <Award className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-teal-100">We strive for excellence in every aspect of our platform.</p>
              </div>
              <div>
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
                <p className="text-teal-100">We believe in the power of collaboration and community.</p>
              </div>
              <div>
                <Star className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-teal-100">We continuously innovate to improve the event planning experience.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            We are a passionate team of developers, designers, and event industry experts 
            dedicated to creating the best event management platform possible.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of event planners who trust EventCraft for their most important events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/users"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Managing Users
              </a>
              <a
                href="/contact"
                className="bg-white hover:bg-gray-50 text-teal-600 border-2 border-teal-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
