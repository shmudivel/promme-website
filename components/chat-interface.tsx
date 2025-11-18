'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
};

type Question = {
  id: string;
  text: string;
  field: string;
  inputType?: 'text' | 'number' | 'textarea';
};

interface ChatInterfaceProps {
  questions: Question[];
  onComplete: (answers: Record<string, string>) => void;
  onAnswer?: (answers: Record<string, string>) => { continueWithNewQuestions?: Question[] } | null;
  userType: string;
}

export default function ChatInterface({ questions: initialQuestions, onComplete, onAnswer, userType }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(initialQuestions);
  const [inputValue, setInputValue] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isLargeInput, setIsLargeInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let mounted = true;
    
    // Initial greeting
    const greeting = {
      id: 'greeting',
      text: `Hi! 👋 I'm here to help you set up your profile. Let's get started!`,
      sender: 'bot' as const,
      timestamp: new Date(),
    };
    setMessages([greeting]);

    // First question after delay
    const timer = setTimeout(() => {
      if (mounted) {
        askQuestion(0);
      }
    }, 1000);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const askQuestion = (index: number) => {
    if (index >= questions.length) {
      // All questions answered
      const finalMessage = {
        id: 'complete',
        text: 'Perfect! Your profile is all set. Let me show you your profile...',
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, finalMessage]);
      
      setTimeout(() => {
        onComplete(answers);
      }, 1500);
      return;
    }

    setIsTyping(true);
    
    // Check if this is a CV input question (make textarea larger)
    const question = questions[index];
    setIsLargeInput(question.field === 'cv_text');
    
    setTimeout(() => {
      const botMessage: Message = {
        id: question.id,
        text: question.text,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Add user message
    const userMessage: Message = {
      id: `user-${currentQuestionIndex}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save answer
    const newAnswers = {
      ...answers,
      [currentQuestion.field]: inputValue,
    };
    setAnswers(newAnswers);

    // Check if parent wants to handle the answer
    if (onAnswer) {
      const result = onAnswer(newAnswers);
      if (result && result.continueWithNewQuestions) {
        // Parent provided new questions to ask
        setQuestions(result.continueWithNewQuestions);
        setCurrentQuestionIndex(0);
        setInputValue('');
        askQuestion(0);
        return;
      }
    }

    // Clear input
    setInputValue('');

    // Move to next question
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    askQuestion(nextIndex);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-full">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">PROMME Assistant</h2>
            <p className="text-sm text-gray-500">Setting up your profile</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {currentQuestionIndex < questions.length && !isTyping && (
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            {isLargeInput ? (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste your CV or resume here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            )}
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-full py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {isLargeInput ? 'Submit CV' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
