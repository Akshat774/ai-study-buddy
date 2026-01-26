-- Users table (extended with student profile info)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  college_name VARCHAR(255),
  current_semester INT,
  target_exam VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exams/Courses table (flexible course management)
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_name VARCHAR(255) NOT NULL,
  exam_type VARCHAR(100) NOT NULL, -- 'JEE', 'NEET', 'GATE', 'Board', 'Custom'
  description TEXT,
  exam_date DATE,
  target_score INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subjects/Topics table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  subject_name VARCHAR(255) NOT NULL,
  chapters INT DEFAULT 0,
  difficulty_level VARCHAR(50), -- 'Beginner', 'Intermediate', 'Advanced'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study Plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  daily_hours DECIMAL(3,1) NOT NULL, -- Hours per day
  study_schedule JSONB, -- Stores day-wise plan structure
  generated_by_ai BOOLEAN DEFAULT FALSE,
  ai_model VARCHAR(50), -- 'groq', 'openai', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily Progress table
CREATE TABLE IF NOT EXISTS daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  study_plan_id UUID REFERENCES study_plans(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  topics_studied TEXT[],
  hours_studied DECIMAL(3,1),
  notes TEXT,
  confidence_level INT, -- 1-10 scale
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Doubts/Questions table
CREATE TABLE IF NOT EXISTS doubts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id),
  question_title VARCHAR(500) NOT NULL,
  question_text TEXT NOT NULL,
  language VARCHAR(50) DEFAULT 'en', -- 'en', 'hi', 'hinglish', etc.
  answer_text TEXT,
  answer_language VARCHAR(50),
  answered_by_ai BOOLEAN DEFAULT FALSE,
  ai_model VARCHAR(50),
  is_resolved BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notes/Summaries table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id),
  title VARCHAR(500) NOT NULL,
  original_content TEXT, -- Raw PDF/text content
  summarized_content TEXT, -- AI-generated summary
  key_points TEXT[], -- Array of bullet points
  generated_by_ai BOOLEAN DEFAULT FALSE,
  ai_model VARCHAR(50),
  language VARCHAR(50) DEFAULT 'en',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exam Prep Resources table
CREATE TABLE IF NOT EXISTS exam_prep_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  resource_type VARCHAR(100), -- 'formula', 'trick', 'concept', 'example'
  content TEXT NOT NULL,
  topic VARCHAR(255),
  difficulty_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progress tracking (overall statistics)
CREATE TABLE IF NOT EXISTS progress_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id) ON DELETE SET NULL,
  total_hours_studied DECIMAL(8,2) DEFAULT 0,
  doubts_solved INT DEFAULT 0,
  notes_created INT DEFAULT 0,
  average_confidence DECIMAL(3,1) DEFAULT 0,
  last_studied DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_exams_user_id ON exams(user_id);
CREATE INDEX idx_subjects_exam_id ON subjects(exam_id);
CREATE INDEX idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX idx_study_plans_exam_id ON study_plans(exam_id);
CREATE INDEX idx_daily_progress_user_id ON daily_progress(user_id);
CREATE INDEX idx_daily_progress_date ON daily_progress(date);
CREATE INDEX idx_doubts_user_id ON doubts(user_id);
CREATE INDEX idx_doubts_subject_id ON doubts(subject_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_subject_id ON notes(subject_id);
CREATE INDEX idx_progress_stats_user_id ON progress_stats(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_prep_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own exams" ON exams
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own exams" ON exams
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own study plans" ON study_plans
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own study plans" ON study_plans
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own doubts" ON doubts
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own doubts" ON doubts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own progress stats" ON progress_stats
  FOR SELECT USING (auth.uid()::text = user_id::text);
