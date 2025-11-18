'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, MapPin, DollarSign, Calendar } from 'lucide-react';

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Experienced Welder Needed',
    company: 'SteelWorks Industries',
    location: 'Moscow',
    salary: '80,000 - 100,000 RUB',
    type: 'Full-time',
    posted: '2 days ago',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'CNC Machine Operator',
    company: 'Precision Manufacturing',
    location: 'St. Petersburg',
    salary: '60,000 - 75,000 RUB',
    type: 'Full-time',
    posted: '4 days ago',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Industrial Electrician',
    company: 'PowerGrid Solutions',
    location: 'Moscow',
    salary: '70,000 - 90,000 RUB',
    type: 'Full-time',
    posted: '1 week ago',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Maintenance Technician',
    company: 'AutoPlant Russia',
    location: 'Kazan',
    salary: '55,000 - 70,000 RUB',
    type: 'Full-time',
    posted: '1 week ago',
    image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=400&fit=crop',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Check if user is authenticated and has completed onboarding
    // For demo: Just show the page after a brief check
    // In production: Check database for user type and onboarding status
    
    // Simulate auth check
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-sm text-gray-600">Your personalized job feed</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => router.push('/register')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                Switch User
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600">
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {mockJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Job Image */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden">
              <img 
                src={job.image} 
                alt={job.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Job Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-gray-600 font-medium">{job.company}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  {job.type}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="text-sm">{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Posted {job.posted}</span>
                </div>
              </div>

              <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
