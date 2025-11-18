'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, MapPin, Briefcase, DollarSign, Award, Mail, Phone, FileText } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    // Load profile from sessionStorage (in production, from database)
    const savedProfile = sessionStorage.getItem('user_profile');
    const savedUserType = sessionStorage.getItem('user_type');
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setUserType(savedUserType || 'job_seeker');
    } else {
      // No profile found, redirect to registration
      router.push('/register');
    }
  }, [router]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              >
                View Jobs
              </button>
              <button 
                onClick={() => router.push('/register')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.full_name || 'Your Name'}
              </h2>
              
              {profile.desired_position && (
                <div className="flex items-center text-gray-600 mb-2">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span className="text-lg">{profile.desired_position}</span>
                </div>
              )}
              
              {profile.location_city && (
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{profile.location_city}</span>
                </div>
              )}
              
              {profile.desired_salary_min && (
                <div className="flex items-center text-gray-600 mb-2">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>Min. {profile.desired_salary_min} RUB/month</span>
                </div>
              )}
              
              {profile.email && (
                <div className="flex items-center text-gray-600 mb-2">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{profile.email}</span>
                </div>
              )}
              
              {profile.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <Award className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.split(',').map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CV Text Section */}
        {profile.cv_text && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Full CV / Resume</h3>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                {profile.cv_text}
              </pre>
            </div>
          </div>
        )}

        {/* All Data Section (Debug) */}
        {profile.has_cv && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>✓ Profile created from CV</strong> - Information extracted automatically
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

