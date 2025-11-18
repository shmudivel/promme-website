'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Building2, GraduationCap } from 'lucide-react';

type UserType = 'job_seeker' | 'company' | 'university';

export default function RegisterPage() {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const router = useRouter();

  const userTypes = [
    {
      type: 'job_seeker' as UserType,
      title: 'Job Seeker',
      description: 'Looking for industrial work',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      type: 'company' as UserType,
      title: 'Company',
      description: 'Hiring skilled workers',
      icon: Building2,
      color: 'bg-green-500',
    },
    {
      type: 'university' as UserType,
      title: 'University',
      description: 'Training future specialists',
      icon: GraduationCap,
      color: 'bg-purple-500',
    },
  ];

  const handleSelect = (type: UserType) => {
    setSelectedType(type);
    // Redirect to onboarding for selected user type
    setTimeout(() => {
      router.push(`/onboarding/${type}`);
    }, 300);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to PROMME</h1>
          <p className="text-gray-600">I'm here to help. Who are you?</p>
        </div>

        <div className="space-y-4">
          {userTypes.map(({ type, title, description, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className={`w-full p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-2 ${
                selectedType === type ? 'border-blue-500 scale-105' : 'border-transparent'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`${color} p-4 rounded-xl`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center pt-4">
          <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Already have an account? <span className="font-semibold">Sign in</span>
          </a>
        </div>
      </div>
    </main>
  );
}

