import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import WelcomePage from '@/components/WelcomePage';
import Dashboard from '@/components/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'welcome' | 'dashboard'>('splash');
  const { isAuthenticated, loading } = useAuth();

  const handleSplashComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleLogin = () => {
    setCurrentScreen('dashboard');
  };

  const handleSignup = () => {
    setCurrentScreen('dashboard');
  };

  // Check authentication status when component mounts
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        setCurrentScreen('dashboard');
      } else if (currentScreen === 'splash') {
        // Stay on splash screen initially
      } else {
        setCurrentScreen('welcome');
      }
    }
  }, [isAuthenticated, loading, currentScreen]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Loading your cosmic journey...</p>
        </div>
      </div>
    );
  }

  if (currentScreen === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentScreen === 'welcome' && !isAuthenticated) {
    return <WelcomePage onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return <Dashboard />;
};

export default Index;
