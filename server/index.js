import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize SQLite database
let db;
async function initDatabase() {
  try {
    db = await open({
      filename: './writeflow.db',
      driver: sqlite3.Database
    });

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        native_language TEXT DEFAULT 'ko',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS writing_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        content TEXT NOT NULL,
        corrected_content TEXT,
        feedback TEXT,
        score INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// AI Writing Correction API
app.post('/api/correct', async (req, res) => {
  try {
    const { content, nativeLanguage = 'ko' } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: '작문 내용을 입력해주세요.' });
    }

    // Create AI correction prompt
    const systemPrompt = `You are an expert English writing tutor. Your task is to:
1. Correct grammar, spelling, and punctuation errors
2. Suggest better vocabulary and expressions
3. Improve sentence structure and flow
4. Provide detailed feedback in ${nativeLanguage === 'ko' ? 'Korean' : 'Chinese'}

Format your response as JSON with the following structure:
{
  "corrected_content": "corrected English text",
  "feedback": {
    "overall_score": 85,
    "grammar_score": 90,
    "vocabulary_score": 80,
    "coherence_score": 85,
    "corrections": [
      {
        "original": "incorrect text",
        "corrected": "corrected text",
        "explanation": "explanation in ${nativeLanguage === 'ko' ? 'Korean' : 'Chinese'}"
      }
    ],
    "suggestions": [
      "suggestion 1 in ${nativeLanguage === 'ko' ? 'Korean' : 'Chinese'}",
      "suggestion 2 in ${nativeLanguage === 'ko' ? 'Korean' : 'Chinese'}"
    ],
    "explanation": "overall feedback in ${nativeLanguage === 'ko' ? 'Korean' : 'Chinese'}"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: content }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    let aiResponse;

    try {
      aiResponse = JSON.parse(response);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      aiResponse = {
        corrected_content: content,
        feedback: {
          overall_score: 75,
          grammar_score: 70,
          vocabulary_score: 75,
          coherence_score: 80,
          corrections: [],
          suggestions: ["AI 응답 파싱 오류가 발생했습니다. 다시 시도해주세요."],
          explanation: "죄송합니다. AI 응답을 처리하는 중에 오류가 발생했습니다. 다시 시도해주세요."
        }
      };
    }

    // Save submission to database (optional - for analytics)
    if (db) {
      try {
        await db.run(
          'INSERT INTO writing_submissions (content, corrected_content, feedback, score) VALUES (?, ?, ?, ?)',
          [content, aiResponse.corrected_content, JSON.stringify(aiResponse.feedback), aiResponse.feedback.overall_score]
        );
      } catch (dbError) {
        console.error('Database save error:', dbError);
      }
    }

    res.json(aiResponse);

  } catch (error) {
    console.error('AI Correction Error:', error);
    res.status(500).json({ 
      error: 'AI 교정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get writing statistics (optional)
app.get('/api/stats', async (req, res) => {
  try {
    if (!db) {
      return res.json({ total_submissions: 0, average_score: 0 });
    }

    const stats = await db.get('SELECT COUNT(*) as total, AVG(score) as average FROM writing_submissions');
    res.json({
      total_submissions: stats.total || 0,
      average_score: Math.round(stats.average || 0)
    });
  } catch (error) {
    res.status(500).json({ error: '통계 조회 중 오류가 발생했습니다.' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

// Start server
async function startServer() {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 WriteFlow server running on port ${PORT}`);
    console.log(`📝 AI Writing Correction API ready`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(console.error);

