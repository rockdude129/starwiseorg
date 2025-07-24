import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  xp: number;
  completed: boolean;
  progress: number;
  questions: Question[];
}

// Cache for generated questions to avoid repeated API calls
const questionCache = new Map<string, Question[]>();

export const generateQuestionsForLesson = async (lessonTitle: string): Promise<Question[]> => {
  const cacheKey = lessonTitle.toLowerCase().replace(/\s+/g, '-');
  
  // Check if questions are already cached
  if (questionCache.has(cacheKey)) {
    return questionCache.get(cacheKey)!;
  }

  // If no API key, use fallback questions
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    console.warn('No Gemini API key found. Using fallback questions.');
    const fallbackQuestions: Question[] = [
      {
        id: `${cacheKey}-1`,
        question: `What is the main topic of ${lessonTitle}?`,
        options: [
          "A basic concept in astronomy",
          "A type of star",
          "A planet in our solar system",
          "A galaxy far away"
        ],
        correctAnswer: 0,
        explanation: "This lesson covers fundamental concepts in astronomy."
      },
      {
        id: `${cacheKey}-2`,
        question: `Which of the following is most relevant to ${lessonTitle}?`,
        options: [
          "Ocean currents",
          "Weather patterns",
          "Celestial objects",
          "Plant growth"
        ],
        correctAnswer: 2,
        explanation: "This lesson focuses on celestial objects and astronomical phenomena."
      },
      {
        id: `${cacheKey}-3`,
        question: `What would you learn from studying ${lessonTitle}?`,
        options: [
          "How to cook",
          "How to drive",
          "How to understand space",
          "How to swim"
        ],
        correctAnswer: 2,
        explanation: "This lesson helps you understand concepts related to space and astronomy."
      },
      {
        id: `${cacheKey}-4`,
        question: `Why is ${lessonTitle} important in astronomy?`,
        options: [
          "It's not important",
          "It helps us understand the universe",
          "It's only for scientists",
          "It's just for fun"
        ],
        correctAnswer: 1,
        explanation: "Understanding this topic helps us better comprehend the universe around us."
      }
    ];
    
    questionCache.set(cacheKey, fallbackQuestions);
    return fallbackQuestions;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 4 multiple choice questions about "${lessonTitle}" for an astronomy learning app. 

Requirements:
- Each question should have 4 options (A, B, C, D)
- Only 1 option should be correct
- 3 options should be plausible but incorrect
- Include a brief explanation for the correct answer
- Questions should be educational and engaging
- Difficulty should be appropriate for beginners to intermediate learners

Format the response as a JSON array with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

Note: correctAnswer should be 0, 1, 2, or 3 corresponding to the index of the correct option.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON response from Gemini');
    }
    
    const questions: Question[] = JSON.parse(jsonMatch[0]).map((q: any, index: number) => ({
      id: `${cacheKey}-${index + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));

    // Cache the questions
    questionCache.set(cacheKey, questions);
    
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    
    // Fallback questions if API fails
    const fallbackQuestions: Question[] = [
      {
        id: `${cacheKey}-1`,
        question: `What is the main topic of ${lessonTitle}?`,
        options: [
          "A basic concept in astronomy",
          "A type of star",
          "A planet in our solar system",
          "A galaxy far away"
        ],
        correctAnswer: 0,
        explanation: "This lesson covers fundamental concepts in astronomy."
      },
      {
        id: `${cacheKey}-2`,
        question: `Which of the following is most relevant to ${lessonTitle}?`,
        options: [
          "Ocean currents",
          "Weather patterns",
          "Celestial objects",
          "Plant growth"
        ],
        correctAnswer: 2,
        explanation: "This lesson focuses on celestial objects and astronomical phenomena."
      },
      {
        id: `${cacheKey}-3`,
        question: `What would you learn from studying ${lessonTitle}?`,
        options: [
          "How to cook",
          "How to drive",
          "How to understand space",
          "How to swim"
        ],
        correctAnswer: 2,
        explanation: "This lesson helps you understand concepts related to space and astronomy."
      },
      {
        id: `${cacheKey}-4`,
        question: `Why is ${lessonTitle} important in astronomy?`,
        options: [
          "It's not important",
          "It helps us understand the universe",
          "It's only for scientists",
          "It's just for fun"
        ],
        correctAnswer: 1,
        explanation: "Understanding this topic helps us better comprehend the universe around us."
      }
    ];
    
    questionCache.set(cacheKey, fallbackQuestions);
    return fallbackQuestions;
  }
};

// Lesson data with questions to be generated
export const lessons: Omit<Lesson, 'questions'>[] = [
  {
    id: 1,
    title: "Introduction to Astronomy",
    description: "Learn the basics of celestial objects and the night sky",
    duration: "15 min",
    xp: 100,
    completed: false,
    progress: 0
  },
  {
    id: 2,
    title: "The Solar System",
    description: "Explore our cosmic neighborhood and planet formation",
    duration: "20 min",
    xp: 100,
    completed: false,
    progress: 0
  },
  {
    id: 3,
    title: "Stars and Stellar Evolution",
    description: "Understanding star life cycles and classifications",
    duration: "25 min",
    xp: 100,
    completed: false,
    progress: 0
  },
  {
    id: 4,
    title: "Galaxies and the Universe",
    description: "Journey through cosmic structures and expansion",
    duration: "30 min",
    xp: 100,
    completed: false,
    progress: 0
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

export const getLessonWithQuestions = async (lessonId: number): Promise<Lesson | null> => {
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) return null;

  const questions = await generateQuestionsForLesson(lesson.title);
  
  return {
    ...lesson,
    questions
  };
}; 