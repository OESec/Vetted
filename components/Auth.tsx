import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Button from './Button';
import Logo from './Logo';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface AuthProps {
  onBack: () => void;
  onLoginSuccess?: (session: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onBack, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Hardcoded Backdoor for Testing
    if (email === 'investor_demo@vetted.ai' && password === 'Blue-Sky-Action-99!') {
        setTimeout(() => {
            if (onLoginSuccess) {
                onLoginSuccess({
                    user: {
                        id: 'mock-investor-id',
                        email: email
                    }
                });
            }
            setLoading(false);
        }, 800);
        return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutralLight flex flex-col items-center justify-center p-4 animate-fade-in-up">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <button 
                  onClick={onBack} 
                  className="hover:scale-105 transition-transform focus:outline-none"
                  aria-label="Back to Home"
                >
                  <Logo className="w-12 h-12 text-primary" />
                </button>
            </div>
          <h2 className="text-2xl font-bold text-neutralDark">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
          <p className="text-gray-500 mt-2">
            {isSignUp ? 'Start automating your security reviews today.' : 'Sign in to access your dashboard.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
              <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {message && (
             <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-start">
              <CheckCircle2 size={16} className="mt-0.5 mr-2 flex-shrink-0" />
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Sign Up' : 'Log In')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
            }}
            className="font-bold text-primary hover:underline"
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </div>
        
        <div className="mt-6 text-center">
            <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600">
                ← Back to Home
            </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;