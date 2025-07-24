export interface UserProgress {
  totalXP: number;
  completedLessons: number;
  currentStreak: number;
  weeklyProgress: number;
  achievements: Achievement[];
  lessonProgress: LessonProgress[];
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  progress: number;
  lastAttempted?: Date;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xp: number;
  unlockedAt?: Date;
}

// Default achievements
export const defaultAchievements: Achievement[] = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "🌟",
    unlocked: false,
    xp: 50
  },
  {
    id: 2,
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    unlocked: false,
    xp: 100
  },
  {
    id: 3,
    title: "Stellar Student",
    description: "Complete 3 lessons",
    icon: "⭐",
    unlocked: false,
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

// Local storage keys
const PROGRESS_KEY = 'starwise_user_progress';
const ACHIEVEMENTS_KEY = 'starwise_achievements';

// Get initial progress from localStorage or create default
export const getInitialProgress = (): UserProgress => {
  const savedProgress = localStorage.getItem(PROGRESS_KEY);
  const savedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY);
  
  if (savedProgress && savedAchievements) {
    try {
      const progress = JSON.parse(savedProgress);
      const achievements = JSON.parse(savedAchievements);
      return {
        ...progress,
        achievements: achievements.map((a: any) => ({
          ...a,
          unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined
        }))
      };
    } catch (error) {
      console.error('Error parsing saved progress:', error);
    }
  }
  
  // Default progress
  return {
    totalXP: 0,
    completedLessons: 0,
    currentStreak: 0,
    weeklyProgress: 0,
    achievements: defaultAchievements,
    lessonProgress: [
      { lessonId: 1, completed: false, progress: 0 },
      { lessonId: 2, completed: false, progress: 0 },
      { lessonId: 3, completed: false, progress: 0 },
      { lessonId: 4, completed: false, progress: 0 },
      { lessonId: 5, completed: false, progress: 0 }
    ]
  };
};

// Save progress to localStorage
export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({
      totalXP: progress.totalXP,
      completedLessons: progress.completedLessons,
      currentStreak: progress.currentStreak,
      weeklyProgress: progress.weeklyProgress,
      lessonProgress: progress.lessonProgress
    }));
    
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(progress.achievements));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

// Update lesson completion
export const completeLesson = (lessonId: number, score: number, totalQuestions: number): UserProgress => {
  const progress = getInitialProgress();
  
  // Calculate XP based on performance (100 XP for perfect score)
  const xpEarned = Math.round((score / totalQuestions) * 100);
  
  // Update lesson progress
  const lessonIndex = progress.lessonProgress.findIndex(lp => lp.lessonId === lessonId);
  if (lessonIndex !== -1) {
    progress.lessonProgress[lessonIndex] = {
      lessonId,
      completed: true,
      progress: 100,
      lastAttempted: new Date()
    };
  }
  
  // Update overall progress
  progress.totalXP += xpEarned;
  progress.completedLessons = progress.lessonProgress.filter(lp => lp.completed).length;
  progress.weeklyProgress = Math.min(100, progress.weeklyProgress + 20);
  
  // Check for achievements
  progress.achievements = checkAchievements(progress);
  
  // Save updated progress
  saveProgress(progress);
  
  return progress;
};

// Check and unlock achievements
export const checkAchievements = (progress: UserProgress): Achievement[] => {
  const achievements = [...progress.achievements];
  
  // First Steps - Complete first lesson
  if (progress.completedLessons >= 1 && !achievements[0].unlocked) {
    achievements[0] = {
      ...achievements[0],
      unlocked: true,
      unlockedAt: new Date()
    };
  }
  
  // Week Warrior - 7-day streak
  if (progress.currentStreak >= 7 && !achievements[1].unlocked) {
    achievements[1] = {
      ...achievements[1],
      unlocked: true,
      unlockedAt: new Date()
    };
  }
  
  // Stellar Student - Complete 3 lessons
  if (progress.completedLessons >= 3 && !achievements[2].unlocked) {
    achievements[2] = {
      ...achievements[2],
      unlocked: true,
      unlockedAt: new Date()
    };
  }
  
  // Cosmic Explorer - Complete all lessons
  if (progress.completedLessons >= 5 && !achievements[3].unlocked) {
    achievements[3] = {
      ...achievements[3],
      unlocked: true,
      unlockedAt: new Date()
    };
  }
  
  // Knowledge Seeker - Earn 1000 XP
  if (progress.totalXP >= 1000 && !achievements[4].unlocked) {
    achievements[4] = {
      ...achievements[4],
      unlocked: true,
      unlockedAt: new Date()
    };
  }
  
  return achievements;
};

// Get user level based on XP
export const getUserLevel = (totalXP: number): number => {
  return Math.floor(totalXP / 200) + 1;
};

// Get XP needed for next level
export const getXPForNextLevel = (totalXP: number): number => {
  const currentLevel = getUserLevel(totalXP);
  const xpForCurrentLevel = (currentLevel - 1) * 200;
  const xpForNextLevel = currentLevel * 200;
  return xpForNextLevel - totalXP;
};

// Update streak (call this daily)
export const updateStreak = (): UserProgress => {
  const progress = getInitialProgress();
  const today = new Date().toDateString();
  const lastLogin = localStorage.getItem('starwise_last_login');
  
  if (lastLogin !== today) {
    // Check if user logged in yesterday (simple streak logic)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastLogin === yesterdayStr) {
      progress.currentStreak += 1;
    } else {
      progress.currentStreak = 1;
    }
    
    localStorage.setItem('starwise_last_login', today);
    saveProgress(progress);
  }
  
  return progress;
}; 