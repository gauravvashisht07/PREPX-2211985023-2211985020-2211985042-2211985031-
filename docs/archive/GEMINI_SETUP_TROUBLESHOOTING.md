# Gemini AI Integration Troubleshooting Guide

## Issue: "API key not valid"

If you're seeing this error when trying to use AI feedback:
```
API key not valid. Please pass a valid API key.
```

### Root Causes & Solutions

#### ❌ WRONG: Using Google Cloud Console Key
- ❌ Don't use keys from `console.cloud.google.com`
- ❌ These require payment setup and quota configuration

#### ✅ CORRECT: Using Google AI Studio Key
- ✅ Go to **[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
- ✅ Click "Create API Key"
- ✅ Select "Create API key in new Google Cloud project"
- ✅ Copy the generated key (starts with `AIzaSy...`)

### Step-by-Step Setup

1. **Open Google AI Studio**
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **Create New API Key**
   - Click blue "Create API Key" button
   - Select "Create API key in new Google Cloud project"
   - Wait for creation to complete

3. **Copy the Key**
   - Look for a key starting with `AIzaSy...`
   - Copy the entire key

4. **Update `.env` File**
   ```bash
   # File: backend/.env
   GEMINI_API_KEY=AIzaSy...YOUR_KEY_HERE...
   ```

5. **Restart Backend**
   ```bash
   cd backend
   npm run dev
   ```

6. **Refresh Browser & Test**
   - Hard refresh: `Ctrl+F5`
   - Go to resume, MCQ, or Mock Interview page
   - Click "Get AI Feedback" button
   - Feedback should stream in real-time

### Verify Setup

After updating your key, test with:

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Check API is working
curl -X POST http://localhost:5000/api/feedback/mcq/stream \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "questionText": "What is a binary search tree?",
    "userAnswer": "A tree where left children are smaller than the parent",
    "correctAnswer": "A binary tree where left subtree values < node < right subtree values",
    "explanation": "BST property ensures efficient searching",
    "topic": "Data Structures",
    "difficulty": "medium"
  }'
```

### Common Mistakes

| ❌ Mistake | ✅ Solution |
|-----------|-----------|
| Key from `console.cloud.google.com` | Use `aistudio.google.com` instead |
| Key not saved to `.env` file | Edit `backend/.env` and add `GEMINI_API_KEY=...` |
| Backend not restarted after `.env` update | Stop and restart: `Ctrl+C` then `npm run dev` |
| Old token in browser cache | Hard refresh: `Ctrl+F5` |
| Typo in API key | Copy/paste directly from aistudio.google.com |

### Current Implementation Details

**Files Modified:**
- `backend/services/aiService.js` - Gemini integration (uses `gemini-1.5-flash` model)
- `backend/controllers/feedbackController.js` - Feedback endpoints with JWT auth
- `backend/routes/feedback.js` - API routes
- `frontend/components/StreamingFeedback.jsx` - Real-time feedback UI
- `backend/.env` - Configuration

**Features:**
- ✅ Real-time streaming feedback via Server-Sent Events (SSE)
- ✅ JWT authentication on all endpoints
- ✅ Rate limiting: 100 requests/day per user (free tier)
- ✅ Feedback stored in MongoDB
- ✅ Works on MCQ, Resume, and Mock Interview pages

**Endpoints:**
- `POST /api/feedback/mcq` - MCQ feedback
- `POST /api/feedback/mcq/stream` - MCQ streaming feedback
- `POST /api/feedback/resume` - Resume feedback
- `POST /api/feedback/resume/stream` - Resume streaming
- `POST /api/feedback/interview` - Interview feedback
- `POST /api/feedback/interview/stream` - Interview streaming

---

## Can't Access aistudio.google.com?

If the site is blocked or unavailable:

1. Try a different browser
2. Use VPN if region-restricted
3. Alternative: Use Google Cloud Console
   - Go to `console.cloud.google.com`
   - Create project
   - Enable "Generative Language API"
   - Create API key
   - Add billing (free tier includes $300 credit)

---

## Questions?

The entire AI feedback system is configured and ready. Only the API key validation is blocking it from working. Once you have a valid key from aistudio.google.com, update it in `backend/.env` and restart the backend.
