import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Star, CheckCircle, XCircle, Trophy, Zap } from 'lucide-react';
import { Lesson } from '@/lib/gemini';

interface QuestionScreenProps {
  onBack: () => void;
  onComplete: (score: number, totalQuestions: number) => void;
  lesson: Lesson;
}

const QuestionScreen = ({ onBack, onComplete, lesson }: QuestionScreenProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = lesson.questions;
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const finalScore = score + (isAnswered && selectedAnswer === currentQ.correctAnswer ? 1 : 0);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    if (answerIndex === currentQ.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      onComplete(finalScore, questions.length);
    }
  };

  const handleBackToDashboard = () => {
    onBack();
  };

  // Quiz completion screen
  if (quizCompleted) {
    const percentage = Math.round((finalScore / questions.length) * 100);
    const xpEarned = Math.round((finalScore / questions.length) * 100); // 100 XP for perfect score

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardContent className="p-12">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent mb-2">
                    Lesson Complete!
                  </h1>
                  <p className="text-blue-200/80 text-lg">Great job exploring {lesson.title}!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{finalScore}/{questions.length}</div>
                    <p className="text-blue-200/80">Questions Correct</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">{percentage}%</div>
                    <p className="text-blue-200/80">Accuracy</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">{xpEarned}</div>
                    <p className="text-blue-200/80">XP Earned</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleBackToDashboard}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Star className="mr-2 h-5 w-5" />
                    Continue Learning
                  </Button>
                  
                  {percentage >= 80 && (
                    <div className="flex items-center justify-center gap-2 text-green-300">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm">Excellent work! You're mastering the cosmos!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-blue-200 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">{lesson.title}</h1>
            <p className="text-blue-200/80">{lesson.description}</p>
          </div>
          
          <div className="text-right">
            <div className="text-white font-semibold">Question {currentQuestion + 1} of {questions.length}</div>
            <div className="text-blue-200/80 text-sm">Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Question Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  {currentQ.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 text-left rounded-lg border transition-all duration-300 ${
                      isAnswered
                        ? index === currentQ.correctAnswer
                          ? 'bg-green-500/20 border-green-400 text-green-300'
                          : index === selectedAnswer && index !== currentQ.correctAnswer
                          ? 'bg-red-500/20 border-red-400 text-red-300'
                          : 'bg-white/5 border-white/10 text-blue-200/60'
                        : selectedAnswer === index
                        ? 'bg-blue-500/20 border-blue-400 text-white'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-blue-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isAnswered && index === currentQ.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                      {isAnswered && index === selectedAnswer && index !== currentQ.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  </button>
                ))}

                {isAnswered && (
                  <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white font-semibold mb-2">Explanation:</h4>
                    <p className="text-blue-200/90">{currentQ.explanation}</p>
                    
                    <Button
                      onClick={handleNext}
                      className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reference Video Section */}
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Play className="h-5 w-5 text-blue-400" />
                  Lesson Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-white font-semibold mb-2">{lesson.title}</h3>
                    <p className="text-blue-200/80 text-sm mb-3">{lesson.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-200/60">Duration:</span>
                      <span className="text-blue-200">{lesson.duration}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-blue-200/60">XP Available:</span>
                      <span className="text-purple-300 font-semibold">{lesson.xp} XP</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200/80">Current Score</span>
                  <span className="text-white font-semibold">{score}/{currentQuestion + (isAnswered ? 1 : 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200/80">Progress</span>
                  <span className="text-white font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200/80">Questions Left</span>
                  <span className="text-white font-semibold">{questions.length - currentQuestion - 1}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;
