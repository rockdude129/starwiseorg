import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { account } from '@/lib/appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Star, Sparkles, Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        const userId = searchParams.get('userId');
        const secret = searchParams.get('secret');
        const oauthError = searchParams.get('error');

        if (oauthError) {
          throw new Error('OAuth authentication failed. Please try again.');
        }

        // It's a magic link if userId and secret are present
        if (userId && secret) {
          await account.updateMagicURLSession(userId, secret);
          toast({
            title: "Welcome to Starwise!",
            description: "Successfully signed in with magic link.",
          });
        }
        
        // For both OAuth and Magic Link, we need to verify the session
        await checkAuthStatus();
        
        setStatus('success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (error: any) {
        setStatus('error');
        setError(error.message || 'Failed to complete authentication.');
        toast({
          title: "Authentication Failed",
          description: error.message || 'An unknown error occurred.',
          variant: "destructive",
        });
      }
    };

    processAuthCallback();
  }, [searchParams, navigate, toast, checkAuthStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-blue-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-400 to-purple-400 p-4 rounded-full">
              <Star className="h-12 w-12 text-white animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300 animate-bounce" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-lg p-8 max-w-md mx-auto">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto" />
              <h2 className="text-2xl font-bold text-white">Authenticating...</h2>
              <p className="text-blue-200/80">Please wait while we verify your sign-in...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Welcome to Starwise!</h2>
              <p className="text-blue-200/80">Successfully authenticated. Redirecting to dashboard...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 text-red-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Authentication Failed</h2>
              <p className="text-red-200/80">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback; 