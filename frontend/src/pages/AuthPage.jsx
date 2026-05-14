import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Compass } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === 'CREATOR') {
        navigate('/dashboard/creator', { replace: true });
      } else {
        navigate('/dashboard/user', { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E05934]"></div>
      </div>
    );
  }

  // Don't render auth page if authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleGoogleLogin = async (role) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const user = login(role);
    setIsLoading(false);
    
    // Redirect based on role
    if (user.role === 'CREATOR') {
      navigate('/dashboard/creator');
    } else {
      navigate('/dashboard/user');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://static.prod-images.emergentagent.com/jobs/123d505a-210b-43ed-9e8b-486f57b8ea14/images/7b5a210a2ea8e6399ecdda8002bd4c902ef299a02b2a675d08617bf649885e2a.png')`,
      }}
      data-testid="auth-page"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-[#E05934] rounded-2xl flex items-center justify-center mb-4">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Welcome to SessionHub</h1>
            <p className="text-[#737373] mt-2 text-center">
              Sign in to book sessions and manage your profile
            </p>
          </div>

          {/* Google Login Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => handleGoogleLogin('USER')}
              disabled={isLoading}
              className="w-full bg-white hover:bg-[#F5F0EB] text-[#1A1A1A] border border-[#E5E5E5] rounded-xl py-6 text-base font-medium transition-all active:scale-95 flex items-center justify-center gap-3"
              data-testid="google-login-user"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? 'Signing in...' : 'Continue as User'}
            </Button>

            <Button
              onClick={() => handleGoogleLogin('CREATOR')}
              disabled={isLoading}
              className="w-full bg-[#E05934] hover:bg-[#C94A28] text-white rounded-xl py-6 text-base font-medium transition-all active:scale-95 flex items-center justify-center gap-3"
              data-testid="google-login-creator"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? 'Signing in...' : 'Continue as Creator'}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-[#737373] text-center mt-6">
            By continuing, you agree to our{' '}
            <span className="text-[#E05934] cursor-pointer hover:underline">Terms of Service</span>
            {' '}and{' '}
            <span className="text-[#E05934] cursor-pointer hover:underline">Privacy Policy</span>
          </p>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-[#737373] hover:text-[#1A1A1A] transition-colors"
              data-testid="back-to-home"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;