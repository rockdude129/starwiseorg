import { useState, useEffect } from 'react';
import { Star, Zap, Calendar, Trophy, BookOpen, Sparkles, LogOut, User, MessageCircle, Settings, Target, Award, Brain, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import QuestionScreen from './QuestionScreen';
import MessagingPanel from './MessagingPanel';
import { lessons, getLessonWithQuestions, Lesson } from '@/lib/gemini';
import { getInitialProgress, completeLesson, getUserLevel, updateStreak, UserProgress } from '@/lib/progress';
import Roadmap, { RoadmapLesson } from './Roadmap';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Lesson data
const lessons = [
  {
    id: 1,
    title: "Introduction to Astronomy",
    description: "Learn the basics of celestial objects and the night sky",
    duration: "15 min",
    xp: 100,
    completed: true,
    progress: 100
  },
  {
    id: 2,
    title: "The Solar System",
    description: "Explore our cosmic neighborhood and planet formation",
    duration: "20 min",
    xp: 100,
    completed: true,
    progress: 100
  },
  {
    id: 3,
    title: "Stars and Stellar Evolution",
    description: "Understanding star life cycles and classifications",
    duration: "25 min",
    xp: 100,
    completed: true,
    progress: 100
  },
  {
    id: 4,
    title: "Galaxies and the Universe",
    description: "Journey through cosmic structures and expansion",
    duration: "30 min",
    xp: 100,
    completed: false,
    progress: 40
  },
  {
    id: 5,
    title: "Space Exploration",
    description: "Human achievements in space and future missions",
    duration: "20 min",
    xp: 100,
    completed: false,
    progress: 0
  }
];

// Achievements data
const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "🌟",
    unlocked: true,
    xp: 50
  },
  {
    id: 2,
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    unlocked: true,
    xp: 100
  },
  {
    id: 3,
    title: "Stellar Student",
    description: "Complete 3 lessons",
    icon: "⭐",
    unlocked: true,
    xp: 150
  },
  {
    id: 4,
    title: "Cosmic Explorer",
    description: "Complete all lessons",
    icon: "🚀",
    unlocked: false,
    xp: 500
  },
  {
    id: 5,
    title: "Knowledge Seeker",
    description: "Earn 1000 XP",
    icon: "🧠",
    unlocked: false,
    xp: 200
  }
];

const DAILY_GOAL_XP = 100;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuestionScreen, setShowQuestionScreen] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [studyHours, setStudyHours] = useState(2);
  const [studyDays, setStudyDays] = useState(5);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // User progress state
  const [userProgress, setUserProgress] = useState<UserProgress>(getInitialProgress());
  const [activeUnit, setActiveUnit] = useState(0);
  const [showProModal, setShowProModal] = useState(false);

  useEffect(() => {
    // Update streak on component mount
    const updatedProgress = updateStreak();
    setUserProgress(updatedProgress);
  }, []);

  const handleStartLesson = async (lessonId: number) => {
    try {
      setLoading(true);
      const lesson = await getLessonWithQuestions(lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setShowQuestionScreen(true);
      } else {
        toast({
          title: "Error loading lesson",
          description: "Failed to load lesson questions. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error loading lesson",
        description: "Failed to generate lesson questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    setShowQuestionScreen(false);
    setCurrentLesson(null);
  };

  const handleLessonComplete = (score: number, totalQuestions: number) => {
    if (!currentLesson) return;
    
    const updatedProgress = completeLesson(currentLesson.id, score, totalQuestions);
    setUserProgress(updatedProgress);
    
    const xpEarned = Math.round((score / totalQuestions) * 100);
    const percentage = Math.round((score / totalQuestions) * 100);
    
    toast({
      title: "Lesson Completed! 🎉",
      description: `Earned ${xpEarned} XP with ${percentage}% accuracy!`,
    });
    
    // Check for new achievements
    const newAchievements = updatedProgress.achievements.filter(a => 
      a.unlocked && !userProgress.achievements.find(ua => ua.id === a.id)?.unlocked
    );
    
    if (newAchievements.length > 0) {
      newAchievements.forEach(achievement => {
        toast({
          title: `Achievement Unlocked: ${achievement.title}! 🏆`,
          description: achievement.description,
        });
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon for more cosmic adventures!",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  // Get current lesson progress
  const getCurrentLessonProgress = () => {
    const nextIncompleteLesson = userProgress.lessonProgress.find(lp => !lp.completed);
    return nextIncompleteLesson ? nextIncompleteLesson.lessonId : 1;
  };

  const currentLessonId = getCurrentLessonProgress();
  const currentLessonData = lessons.find(l => l.id === currentLessonId);

  // Map lessons to RoadmapLesson format
  const roadmapLessons: RoadmapLesson[] = lessons.map((lesson, idx) => {
    const progress = userProgress.lessonProgress.find(lp => lp.lessonId === lesson.id);
    return {
      id: lesson.id,
      title: lesson.title,
      completed: progress?.completed || false,
      current: !progress?.completed &&
        (idx === 0 || (userProgress.lessonProgress[idx - 1]?.completed)),
      locked: idx > 0 && !(userProgress.lessonProgress[idx - 1]?.completed),
    };
  });

  const todayXP = userProgress.dailyXP ?? 0;
  const dailyGoalMet = todayXP >= DAILY_GOAL_XP;

  if (showQuestionScreen && currentLesson) {
    return (
      <QuestionScreen 
        onBack={handleBackToDashboard} 
        onComplete={(score, totalQuestions) => handleLessonComplete(score, totalQuestions)}
        lesson={currentLesson}
      />
    );
  }

  if (showMessaging) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Button
              onClick={() => setShowMessaging(false)}
              variant="ghost"
              className="text-blue-200 hover:text-white hover:bg-white/10"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Cosmic Chat
            </h1>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <MessagingPanel />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with User Info and Sign Out */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Star className="h-8 w-8 text-blue-400 animate-spin" style={{animationDuration: '8s'}} />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Starwise
              </h1>
              <p className="text-blue-200/80 text-sm">Your cosmic learning journey</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <User className="h-4 w-4 text-blue-300" />
              <span className="text-blue-200 text-sm">{user?.name || 'Space Explorer'}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-blue-200 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm border-white/10">
            <TabsTrigger value="dashboard" className="text-blue-200 data-[state=active]:bg-blue-500/20">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="lessons" className="text-blue-200 data-[state=active]:bg-blue-500/20">
              All Lessons
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-blue-200 data-[state=active]:bg-blue-500/20">
              Cosmic Chat
            </TabsTrigger>
            <TabsTrigger value="preferences" className="text-blue-200 data-[state=active]:bg-blue-500/20">
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-8">
            {/* Welcome Message */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name || 'Space Explorer'}!
              </h2>
              <p className="text-blue-200/80 text-lg">Ready to discover the cosmos?</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Main Action */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Start Lesson Card */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Continue Your Journey</h2>
                        <p className="text-blue-200/80">Next: {currentLessonData?.title}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="w-48 bg-white/10 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full" style={{width: `${(userProgress.completedLessons / lessons.length) * 100}%`}}></div>
                          </div>
                          <span className="text-blue-200/80 text-sm">{userProgress.completedLessons}/{lessons.length} lessons</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleStartLesson(currentLessonId)}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <BookOpen className="mr-2 h-5 w-5" />
                            Start Lesson
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Weekly Progress */}
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        Weekly Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="relative w-24 h-24 mx-auto mb-3">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="2"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="url(#gradient)"
                              strokeWidth="2"
                              strokeDasharray={`${userProgress.weeklyProgress}, 100`}
                              className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                              <linearGradient id="gradient">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#a855f7" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{userProgress.weeklyProgress}%</span>
                          </div>
                        </div>
                        <p className="text-blue-200/80">This week's goal</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Streak Counter */}
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        Current Streak
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-400 mb-2">{userProgress.currentStreak}</div>
                        <p className="text-blue-200/80 mb-3">days in a row</p>
                        <div className="flex justify-center gap-1">
                          {[...Array(7)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < userProgress.currentStreak ? 'bg-yellow-400' : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upgrade to Pro Card */}
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                    <div className="p-6 flex flex-col items-center text-center">
                      <Sparkles className="w-8 h-8 text-yellow-300 mb-2 animate-bounce" />
                      <span className="text-xl font-bold text-white mb-1">Upgrade to Pro</span>
                      <span className="text-blue-200/80 mb-4">Unlock premium lessons and enjoy an ad-free experience!</span>
                      <Button className="bg-gradient-to-r from-yellow-400 to-purple-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-all" onClick={() => setShowProModal(true)}>
                        Upgrade Now
                      </Button>
                    </div>
                  </Card>

                  {/* Roadmap Component */}
                  <Roadmap
                    units={[{ name: 'Unit 1', lessons: roadmapLessons }]}
                    activeUnit={activeUnit}
                    onUnitChange={setActiveUnit}
                    onLessonClick={handleStartLesson}
                  />
                </div>
              </div>

              {/* Right Column - Avatar & Achievements */}
              <div className="space-y-6">
                
                {/* Planet Avatar */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-center">Your Cosmic Companion</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Star className="h-16 w-16 text-white animate-spin" style={{animationDuration: '4s'}} />
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-1">Nebula Explorer</h3>
                    <p className="text-blue-200/80 text-sm mb-3">Level {getUserLevel(userProgress.totalXP)}</p>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{userProgress.totalXP.toLocaleString()}</div>
                      <p className="text-blue-200/80 text-sm">Total XP</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userProgress.achievements.filter(a => a.unlocked).slice(0, 2).map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-lg">
                          {achievement.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium">{achievement.title}</p>
                          <p className="text-blue-200/80 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                    {userProgress.achievements.filter(a => a.unlocked).length === 0 && (
                      <div className="text-center py-4">
                        <Trophy className="h-8 w-8 text-blue-200/40 mx-auto mb-2" />
                        <p className="text-blue-200/60 text-sm">Complete lessons to unlock achievements!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quote of the Day */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Cosmic Inspiration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-blue-200/90 italic text-center">
                      "The cosmos is within us. We are made of star-stuff."
                    </blockquote>
                    <p className="text-blue-300 text-sm text-center mt-2">— Carl Sagan</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* All Lessons Tab */}
          <TabsContent value="lessons" className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                All Lessons
              </h2>
              <p className="text-blue-200/80">Master the cosmos one lesson at a time</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => {
                const lessonProgress = userProgress.lessonProgress.find(lp => lp.lessonId === lesson.id);
                const isCompleted = lessonProgress?.completed || false;
                const progress = lessonProgress?.progress || 0;
                
                return (
                  <Card key={lesson.id} className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white text-lg">{lesson.title}</CardTitle>
                        {isCompleted && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            ✓ Complete
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-blue-200/80 text-sm">{lesson.description}</p>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-200/60">Duration: {lesson.duration}</span>
                        <span className="text-purple-300 font-semibold">{lesson.xp} XP</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-200/60">Progress</span>
                          <span className="text-blue-200">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <Button
                        onClick={() => handleStartLesson(lesson.id)}
                        disabled={loading}
                        className={`w-full ${
                          isCompleted 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                        }`}
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          isCompleted ? 'Completed' : 'Start Lesson'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Cosmic Chat Tab */}
          <TabsContent value="chat" className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                Cosmic Chat
              </h2>
              <p className="text-blue-200/80">Chat with AI about astronomy and space exploration</p>
            </div>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">AI Astronomy Assistant</h3>
                    <p className="text-blue-200/80 mb-6">
                      Ask questions about stars, planets, galaxies, and everything cosmic. 
                      Get detailed explanations and explore the universe together!
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowMessaging(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Start Chatting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                Study Preferences
              </h2>
              <p className="text-blue-200/80">Customize your learning experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Study Hours */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-400" />
                    Daily Study Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">{studyHours}</div>
                    <p className="text-blue-200/80">hours per day</p>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((hour) => (
                      <Button
                        key={hour}
                        onClick={() => setStudyHours(hour)}
                        variant={studyHours === hour ? "default" : "outline"}
                        size="sm"
                        className={studyHours === hour ? "bg-blue-500" : "border-white/20 text-blue-200 hover:bg-white/10"}
                      >
                        {hour}h
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Study Days */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    Study Days per Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">{studyDays}</div>
                    <p className="text-blue-200/80">days per week</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[3, 4, 5, 6, 7].map((day) => (
                      <Button
                        key={day}
                        onClick={() => setStudyDays(day)}
                        variant={studyDays === day ? "default" : "outline"}
                        size="sm"
                        className={studyDays === day ? "bg-purple-500" : "border-white/20 text-blue-200 hover:bg-white/10"}
                      >
                        {day} days
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    All Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userProgress.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border ${
                          achievement.unlocked
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <p className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-blue-200/60'}`}>
                              {achievement.title}
                            </p>
                            <p className={`text-sm ${achievement.unlocked ? 'text-blue-200/80' : 'text-blue-200/40'}`}>
                              {achievement.description}
                            </p>
                            <p className={`text-xs ${achievement.unlocked ? 'text-green-300' : 'text-blue-200/40'}`}>
                              {achievement.xp} XP
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pro Modal */}
      <Dialog open={showProModal} onOpenChange={setShowProModal}>
        <DialogContent className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-yellow-300" />
              Go Pro: Unlock the Cosmos
            </DialogTitle>
          </DialogHeader>
          <ul className="my-6 space-y-4 text-white/90 text-lg">
            <li>✨ Access <span className="font-bold text-yellow-300">hundreds of premium lessons</span></li>
            <li>🚫 <span className="font-bold text-pink-300">Ad-free</span> learning experience</li>
            <li>🌟 Early access to new features</li>
            <li>🎁 Exclusive badges and rewards</li>
          </ul>
          <DialogFooter>
            <Button className="bg-gradient-to-r from-yellow-400 to-purple-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-all" onClick={() => {/* Payment logic will go here */}}>
              Upgrade Now
            </Button>
            <Button variant="ghost" className="text-blue-200 mt-2" onClick={() => setShowProModal(false)}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
