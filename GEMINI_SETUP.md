# Gemini AI Setup for Starwise

This guide will help you set up Gemini AI to generate dynamic questions for each lesson.

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Step 2: Add API Key to Environment

Create a `.env` file in your project root and add:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio.

## Step 3: Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## How It Works

- **Dynamic Questions**: Each lesson will generate 4 unique questions using Gemini AI
- **Caching**: Questions are cached to avoid repeated API calls
- **Fallback**: If no API key is provided, fallback questions are used
- **Topic-Specific**: Questions are tailored to each lesson's content

## Lesson Topics

The app will generate questions for these 5 lessons:

1. **Introduction to Astronomy** - Basics of celestial objects
2. **The Solar System** - Planets and solar system formation
3. **Stars and Stellar Evolution** - Star life cycles
4. **Galaxies and the Universe** - Cosmic structures
5. **Space Exploration** - Human space achievements

## Features

- ✅ **4 Questions per Lesson** - Multiple choice format
- ✅ **1 Correct, 3 Incorrect** - Plausible distractors
- ✅ **Explanations** - Why the answer is correct
- ✅ **XP System** - 100 XP for perfect score
- ✅ **Progress Tracking** - Lesson completion status
- ✅ **Achievements** - Unlock as you progress

## Troubleshooting

### No API Key
- The app will use fallback questions
- You'll see a warning in the console
- Questions will still be educational but generic

### API Errors
- Check your internet connection
- Verify your API key is correct
- Ensure you have sufficient API quota

### Question Generation Issues
- Questions are cached after first generation
- Clear browser cache to regenerate
- Check browser console for errors

## Cost

- Gemini API has a generous free tier
- Each lesson generates 4 questions once
- Questions are cached to minimize API calls
- Typical usage: ~20 API calls per user

## Next Steps

Once set up, you can:
1. Start lessons to see AI-generated questions
2. Earn XP and unlock achievements
3. Track your progress through the cosmos
4. Chat with the AI about astronomy topics 