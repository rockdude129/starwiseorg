import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Sparkles, Rocket, Loader2, Mail, Smartphone, Link2, Chrome, Github, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const WelcomePage = () => {
  const [tab, setTab] = useState('email');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Email/password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Phone/OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpUserId, setOtpUserId] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Magic link
  const [magicEmail, setMagicEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  const { signIn, signUp, sendPhoneOTP, verifyPhoneOTP, sendMagicLink, signInWithOAuth } = useAuth();
  const { toast } = useToast();

  // Email/password handler
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signIn(email, password);
        toast({ title: 'Welcome back!', description: 'Successfully signed in to your account.' });
      } else {
        await signUp(email, password, name);
        toast({ title: 'Account created!', description: 'Welcome to Starwise! Your account has been created successfully.' });
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
      toast({ title: 'Error', description: error.message || 'An error occurred. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Phone/OTP handler
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { userId } = await sendPhoneOTP(phone);
      setOtpSent(true);
      setOtpUserId(userId);
      toast({ title: 'OTP sent!', description: 'Check your phone for the verification code.' });
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP.');
      toast({ title: 'Error', description: error.message || 'Failed to send OTP.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyPhoneOTP(otpUserId, otp);
      toast({ title: 'Phone verified!', description: 'Successfully signed in with phone.' });
    } catch (error: any) {
      setError(error.message || 'Failed to verify OTP.');
      toast({ title: 'Error', description: error.message || 'Failed to verify OTP.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Magic link handler
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendMagicLink(magicEmail);
      setMagicSent(true);
      toast({ title: 'Magic link sent!', description: 'Check your email for the sign-in link.' });
    } catch (error: any) {
      setError(error.message || 'Failed to send magic link.');
      toast({ title: 'Error', description: error.message || 'Failed to send magic link.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // OAuth handler
  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'discord') => {
    setLoading(true);
    setError('');
    try {
      await signInWithOAuth(provider);
      // OAuth redirects to callback page, so we don't need to handle success here
    } catch (error: any) {
      setError(error.message || `Failed to sign in with ${provider}.`);
      toast({ title: 'Error', description: error.message || `Failed to sign in with ${provider}.`, variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-blue-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="relative z-10 w-full max-w-2xl mx-auto p-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-400 to-purple-400 p-4 rounded-full">
                <Star className="h-12 w-12 text-white animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
            Starwise
          </h1>
          <p className="text-blue-200/80 text-lg">Your Journey Through The Cosmos</p>
        </div>
        {/* Auth Card */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl p-10">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white text-2xl mb-2">Sign In or Create Account</CardTitle>
            <p className="text-blue-200/80 mb-6">Choose your preferred authentication method</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="mb-6 w-full flex flex-nowrap justify-between gap-2 bg-transparent">
                <TabsTrigger
                  value="email"
                  className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2 rounded-full font-semibold shadow-md transition-all duration-200 text-base
                    data-[state=active]:bg-white data-[state=active]:text-purple-900 data-[state=active]:scale-105
                    bg-purple-800/60 text-white hover:bg-purple-700/80"
                >
                  <Mail className="h-5 w-5" /> Email
                </TabsTrigger>
                <TabsTrigger
                  value="phone"
                  className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2 rounded-full font-semibold shadow-md transition-all duration-200 text-base
                    data-[state=active]:bg-white data-[state=active]:text-purple-900 data-[state=active]:scale-105
                    bg-purple-800/60 text-white hover:bg-purple-700/80"
                >
                  <Smartphone className="h-5 w-5" /> Phone
                </TabsTrigger>
                <TabsTrigger
                  value="magic"
                  className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2 rounded-full font-semibold shadow-md transition-all duration-200 text-base
                    data-[state=active]:bg-white data-[state=active]:text-purple-900 data-[state=active]:scale-105
                    bg-purple-800/60 text-white hover:bg-purple-700/80"
                >
                  <Link2 className="h-5 w-5" /> Magic Link
                </TabsTrigger>
                <TabsTrigger
                  value="oauth"
                  className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2 rounded-full font-semibold shadow-md transition-all duration-200 text-base
                    data-[state=active]:bg-white data-[state=active]:text-purple-900 data-[state=active]:scale-105
                    bg-purple-800/60 text-white hover:bg-purple-700/80"
                >
                  <Chrome className="h-5 w-5" /> OAuth
                </TabsTrigger>
              </TabsList>
              {/* Email/Password Tab */}
              <TabsContent value="email">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-200">Your Name</Label>
                      <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:ring-blue-400/20" placeholder="Space Explorer" required={!isLogin} disabled={loading} />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-blue-200">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:ring-blue-400/20" placeholder="astronaut@cosmos.space" required disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-blue-200">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:ring-blue-400/20" placeholder="••••••••" required disabled={loading} minLength={8} />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" disabled={loading}>
                    {loading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />{isLogin ? 'Signing In...' : 'Creating Account...'}</>) : (<><Rocket className="mr-2 h-5 w-5" />{isLogin ? 'Launch Mission' : 'Begin Journey'}</>)}
                  </Button>
                </form>
                <div className="text-center mt-2">
                  <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-300 hover:text-blue-200 text-sm transition-colors duration-200" disabled={loading}>
                    {isLogin ? 'New to the cosmos? Create an account' : 'Already an explorer? Sign in'}
                  </button>
                </div>
              </TabsContent>
              {/* Phone/OTP Tab */}
              <TabsContent value="phone">
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-blue-200">Phone Number</Label>
                      <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:ring-blue-400/20" placeholder="+1234567890" required disabled={loading} />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" disabled={loading}>
                      {loading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Sending OTP...</>) : (<><Smartphone className="mr-2 h-5 w-5" />Send OTP</>)}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-blue-200">Enter OTP</Label>
                      <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={loading}>
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTP>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" disabled={loading}>
                      {loading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Verifying...</>) : (<><Rocket className="mr-2 h-5 w-5" />Verify OTP</>)}
                    </Button>
                  </form>
                )}
              </TabsContent>
              {/* Magic Link Tab */}
              <TabsContent value="magic">
                {!magicSent ? (
                  <form onSubmit={handleSendMagicLink} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="magic-email" className="text-blue-200">Email</Label>
                      <Input id="magic-email" type="email" value={magicEmail} onChange={e => setMagicEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:ring-blue-400/20" placeholder="astronaut@cosmos.space" required disabled={loading} />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" disabled={loading}>
                      {loading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Sending Magic Link...</>) : (<><Link2 className="mr-2 h-5 w-5" />Send Magic Link</>)}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-blue-200">Magic link sent! Check your email to sign in.</p>
                  </div>
                )}
              </TabsContent>
              {/* OAuth Tab */}
              <TabsContent value="oauth">
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-blue-200/80 mb-4">Sign in with your favorite platform</p>
                  </div>
                  
                  <Button 
                    onClick={() => handleOAuthSignIn('google')} 
                    className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-300" 
                    disabled={loading}
                  >
                    <Chrome className="mr-2 h-5 w-5" />
                    Continue with Google
                  </Button>
                  
                  <Button 
                    onClick={() => handleOAuthSignIn('github')} 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={loading}
                  >
                    <Github className="mr-2 h-5 w-5" />
                    Continue with GitHub
                  </Button>
                  
                  <Button 
                    onClick={() => handleOAuthSignIn('discord')} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={loading}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Continue with Discord
                  </Button>
                  
                  {loading && (
                    <div className="text-center">
                      <Loader2 className="h-6 w-6 text-blue-400 animate-spin mx-auto" />
                      <p className="text-blue-200/80 text-sm mt-2">Redirecting to authentication...</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-blue-200/60 text-xs">Join thousands of space enthusiasts learning astronomy</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomePage;
