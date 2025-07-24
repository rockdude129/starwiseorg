
import { useEffect, useState } from 'react';
import { Star, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 flex items-center justify-center transition-opacity duration-300 z-50 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-blue-400 to-purple-400 p-6 rounded-full">
            <Star className="h-16 w-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-300 animate-bounce" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
          Starwise
        </h1>
        <p className="text-blue-200 text-lg opacity-80">Your Journey Through The Cosmos</p>
      </div>
    </div>
  );
};

export default SplashScreen;
