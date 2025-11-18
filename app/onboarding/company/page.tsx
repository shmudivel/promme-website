'use client';

import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/chat-interface';

const questions = [
  {
    id: 'q1',
    text: "What's your company name?",
    field: 'company_name',
  },
  {
    id: 'q2',
    text: "What industry are you in? (e.g., manufacturing, construction, metalwork)",
    field: 'industry',
  },
  {
    id: 'q3',
    text: "Where is your company located?",
    field: 'location_city',
  },
  {
    id: 'q4',
    text: "Tell me briefly about your company",
    field: 'description',
  },
  {
    id: 'q5',
    text: "What's your company website? (optional, type 'skip' if you don't have one)",
    field: 'website_url',
  },
];

export default function CompanyOnboarding() {
  const router = useRouter();

  const handleComplete = async (answers: Record<string, string>) => {
    console.log('Company Answers:', answers);
    
    // TODO: Save to Supabase
    // For now, just redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return <ChatInterface questions={questions} onComplete={handleComplete} userType="company" />;
}

