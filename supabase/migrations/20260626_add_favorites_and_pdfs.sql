-- Add favorites table for bookmarking calculators and projects
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calculator_type VARCHAR(50),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, calculator_type, project_id)
);

-- Add PDF reports table for tracking generated reports
CREATE TABLE IF NOT EXISTS public.pdf_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  calculation_id UUID REFERENCES public.calculations(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  file_size INT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  downloaded_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'generated' -- 'generated', 'downloaded', 'archived'
);

-- Add is_favorite column to projects
ALTER TABLE public.projects ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;

-- Add is_favorite column to calculators (will be tracked via favorites table)
-- Add notes to calculations for user annotations
ALTER TABLE public.calculations ADD COLUMN notes TEXT;
ALTER TABLE public.calculations ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_calculator_type ON public.favorites(calculator_type);
CREATE INDEX IF NOT EXISTS idx_pdf_reports_user_id ON public.pdf_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_reports_project_id ON public.pdf_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_calculations_user_id ON public.calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_calculations_is_favorite ON public.calculations(is_favorite);

-- Enable Row Level Security (RLS)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdf_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for PDF reports
CREATE POLICY "Users can view their own PDF reports" ON public.pdf_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own PDF reports" ON public.pdf_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PDF reports" ON public.pdf_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own PDF reports" ON public.pdf_reports
  FOR DELETE USING (auth.uid() = user_id);
