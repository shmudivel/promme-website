'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ChatInterface from '@/components/chat-interface';

const initialQuestion = {
  id: 'q0',
  text: "Hi! 👋 Let's set up your profile. Do you have a CV/resume or text you'd like to share? Type 'yes' if you have one, or 'no' to answer questions step by step.",
  field: 'has_cv',
};

const cvQuestion = {
  id: 'qcv',
  text: "Great! Please paste your CV, resume, or any text about your experience below. I'll extract all the information for you.",
  field: 'cv_text',
};

const manualQuestions = [
  {
    id: 'q1',
    text: "What's your full name?",
    field: 'full_name',
  },
  {
    id: 'q2',
    text: "What type of work are you looking for? (e.g., welder, machine operator, technician)",
    field: 'desired_position',
  },
  {
    id: 'q3',
    text: "Which city are you in?",
    field: 'location_city',
  },
  {
    id: 'q4',
    text: "What's your minimum desired salary per month? (in RUB)",
    field: 'desired_salary_min',
    inputType: 'number' as const,
  },
  {
    id: 'q5',
    text: "Tell me about your key skills (e.g., welding, CNC operation, equipment maintenance)",
    field: 'skills',
  },
];

export default function JobSeekerOnboarding() {
  const router = useRouter();
  const [mode, setMode] = useState<'initial' | 'cv' | 'manual' | null>(null);
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});

  const getQuestions = () => {
    if (mode === null) return [initialQuestion];
    if (mode === 'cv') return [cvQuestion];
    return manualQuestions;
  };

  const handleComplete = async (answers: Record<string, string>) => {
    console.log('Job Seeker Answers:', { ...allAnswers, ...answers });
    
    // Combine all answers
    const finalAnswers = { ...allAnswers, ...answers };
    
    // Parse CV if provided
    if (mode === 'cv' && finalAnswers.cv_text) {
      // TODO: In production, send to AI to parse
      // For demo, simulate parsing
      const parsedData = parseCV(finalAnswers.cv_text);
      setAllAnswers({ ...finalAnswers, ...parsedData });
    } else {
      setAllAnswers(finalAnswers);
    }
    
    // TODO: Save to Supabase
    // For now, store in sessionStorage for demo
    sessionStorage.setItem('user_profile', JSON.stringify(finalAnswers));
    sessionStorage.setItem('user_type', 'job_seeker');
    
    // Redirect to profile page instead of dashboard
    setTimeout(() => {
      router.push('/profile');
    }, 1000);
  };

  const handleAnswer = (answers: Record<string, string>) => {
    const latestAnswer = Object.values(answers)[Object.values(answers).length - 1];
    
    if (mode === null) {
      // First question - check if they have CV
      if (latestAnswer.toLowerCase().includes('yes')) {
        setMode('cv');
        setAllAnswers(answers);
        return { continueWithNewQuestions: [cvQuestion] };
      } else {
        setMode('manual');
        setAllAnswers(answers);
        return { continueWithNewQuestions: manualQuestions };
      }
    }
    
    return null;
  };

  return (
    <ChatInterface 
      questions={getQuestions()} 
      onComplete={handleComplete}
      onAnswer={handleAnswer}
      userType="job_seeker" 
    />
  );
}

// Simple CV parser (in production, this would use AI)
function parseCV(cvText: string): Record<string, string> {
  const parsed: Record<string, string> = {};
  
  // Extract name (first line usually)
  const lines = cvText.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    parsed.full_name = lines[0].trim();
  }
  
  // Extract email
  const emailMatch = cvText.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    parsed.email = emailMatch[0];
  }
  
  // Extract phone
  const phoneMatch = cvText.match(/[\+]?[0-9]{10,}/);
  if (phoneMatch) {
    parsed.phone = phoneMatch[0];
  }
  
  // Extract skills (look for common skill keywords)
  const skillKeywords = ['welding', 'operator', 'maintenance', 'technician', 'fabrication', 'cnc', 'machinery'];
  const foundSkills = skillKeywords.filter(skill => 
    cvText.toLowerCase().includes(skill)
  );
  if (foundSkills.length > 0) {
    parsed.skills = foundSkills.join(', ');
  }
  
  // Extract city
  const cities = ['Moscow', 'St. Petersburg', 'Kazan', 'Novosibirsk', 'Yekaterinburg'];
  const foundCity = cities.find(city => cvText.includes(city));
  if (foundCity) {
    parsed.location_city = foundCity;
  }
  
  // Default values if not found
  parsed.cv_text = cvText;
  
  return parsed;
}
