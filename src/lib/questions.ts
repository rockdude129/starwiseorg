import Papa from 'papaparse';

export interface QuizQuestion {
  lesson: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

let allQuestions: QuizQuestion[] = [];

export async function loadQuestions() {
  if (allQuestions.length) return allQuestions;
  const response = await fetch('/Astronomy_Quiz_Questions_Full.csv');
  const text = await response.text();
  const { data } = Papa.parse(text, { header: true });
  allQuestions = (data as any[]).map(row => ({
    lesson: row['Lesson'],
    question: row['Question'],
    options: [row['Option 1'], row['Option 2'], row['Option 3'], row['Option 4']],
    correctAnswer: row['Correct Answer'],
    explanation: row['Explanation'],
  }));
  return allQuestions;
}

export async function getQuestionsForLesson(lessonTitle: string) {
  const questions = await loadQuestions();
  return questions.filter(q => q.lesson === lessonTitle);
} 