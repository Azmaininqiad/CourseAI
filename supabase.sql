-- ============================================
-- Course Creation System Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    topic TEXT NOT NULL,
    structure JSONB DEFAULT '{}',
    images_per_module INTEGER DEFAULT 1,
    videos_per_module INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_courses_session_id ON courses(session_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);

-- ============================================
-- COURSE MODULES TABLE
-- ============================================
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    images JSONB DEFAULT '[]',
    videos JSONB DEFAULT '[]',
    module_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_modules_filename ON course_modules(filename);
CREATE INDEX idx_course_modules_order ON course_modules(module_order);

-- ============================================
-- COURSE MEDIA TABLE
-- ============================================
CREATE TABLE course_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    media_type VARCHAR(50) NOT NULL, -- 'image' or 'video'
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_course_media_course_id ON course_media(course_id);
CREATE INDEX idx_course_media_module_id ON course_media(module_id);
CREATE INDEX idx_course_media_type ON course_media(media_type);

-- ============================================
-- COURSE PROGRESS TABLE (for tracking creation progress)
-- ============================================
CREATE TABLE course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    step_message TEXT,
    progress_percentage INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'error'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX idx_course_progress_session_id ON course_progress(session_id);
CREATE INDEX idx_course_progress_created_at ON course_progress(created_at DESC);

-- ============================================
-- SEARCH KEYWORDS TABLE (for caching search keywords)
-- ============================================
CREATE TABLE search_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_filename VARCHAR(255) NOT NULL,
    keyword_type VARCHAR(20) NOT NULL, -- 'image' or 'video'
    keyword TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_search_keywords_course_id ON search_keywords(course_id);
CREATE INDEX idx_search_keywords_module ON search_keywords(module_filename);
CREATE INDEX idx_search_keywords_type ON search_keywords(keyword_type);

-- ============================================
-- WEBSOCKET SESSIONS TABLE (for tracking active sessions)
-- ============================================
CREATE TABLE websocket_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_websocket_sessions_session_id ON websocket_sessions(session_id);
CREATE INDEX idx_websocket_sessions_course_id ON websocket_sessions(course_id);
CREATE INDEX idx_websocket_sessions_active ON websocket_sessions(is_active);

-- ============================================
-- COURSE FILES TABLE (for storing generated files)
-- ============================================
CREATE TABLE course_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'markdown', 'json', 'image', 'video'
    file_path TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    file_content TEXT, -- For text files
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_course_files_course_id ON course_files(course_id);
CREATE INDEX idx_course_files_module_id ON course_files(module_id);
CREATE INDEX idx_course_files_type ON course_files(file_type);

-- ============================================
-- AGENT WORKFLOW LOGS TABLE (for tracking agent activities)
-- ============================================
CREATE TABLE agent_workflow_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    step_status VARCHAR(50) NOT NULL, -- 'started', 'completed', 'error'
    step_message TEXT,
    input_data JSONB,
    output_data JSONB,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_agent_logs_course_id ON agent_workflow_logs(course_id);
CREATE INDEX idx_agent_logs_session_id ON agent_workflow_logs(session_id);
CREATE INDEX idx_agent_logs_agent_name ON agent_workflow_logs(agent_name);
CREATE INDEX idx_agent_logs_created_at ON agent_workflow_logs(created_at DESC);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating updated_at
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
    BEFORE UPDATE ON course_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set module order
CREATE OR REPLACE FUNCTION set_module_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.module_order IS NULL THEN
        SELECT COALESCE(MAX(module_order), 0) + 1 
        INTO NEW.module_order 
        FROM course_modules 
        WHERE course_id = NEW.course_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set module order
CREATE TRIGGER set_module_order_trigger
    BEFORE INSERT ON course_modules
    FOR EACH ROW
    EXECUTE FUNCTION set_module_order();

-- ============================================
-- FUNCTIONS FOR COURSE STATISTICS
-- ============================================

-- Function to get course statistics
CREATE OR REPLACE FUNCTION get_course_stats(course_uuid UUID)
RETURNS TABLE (
    total_modules INTEGER,
    total_images INTEGER,
    total_videos INTEGER,
    completion_status VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(cm.id)::INTEGER as total_modules,
        SUM(jsonb_array_length(cm.images))::INTEGER as total_images,
        SUM(jsonb_array_length(cm.videos))::INTEGER as total_videos,
        c.status as completion_status
    FROM courses c
    LEFT JOIN course_modules cm ON c.id = cm.course_id
    WHERE c.id = course_uuid
    GROUP BY c.status;
END;
$$ LANGUAGE plpgsql;

-- Function to get module content with media count
CREATE OR REPLACE FUNCTION get_module_with_media_count(module_uuid UUID)
RETURNS TABLE (
    module_id UUID,
    filename VARCHAR(255),
    title TEXT,
    content TEXT,
    image_count INTEGER,
    video_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cm.id as module_id,
        cm.filename,
        cm.title,
        cm.content,
        jsonb_array_length(cm.images)::INTEGER as image_count,
        jsonb_array_length(cm.videos)::INTEGER as video_count,
        cm.created_at
    FROM course_modules cm
    WHERE cm.id = module_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get course progress summary
CREATE OR REPLACE FUNCTION get_course_progress_summary(course_uuid UUID)
RETURNS TABLE (
    total_steps INTEGER,
    completed_steps INTEGER,
    current_step VARCHAR(100),
    overall_progress INTEGER,
    last_update TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_steps,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::INTEGER as completed_steps,
        (SELECT step_name FROM course_progress WHERE course_id = course_uuid ORDER BY created_at DESC LIMIT 1) as current_step,
        CASE 
            WHEN COUNT(*) > 0 THEN (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100 / COUNT(*))::INTEGER
            ELSE 0
        END as overall_progress,
        MAX(created_at) as last_update
    FROM course_progress 
    WHERE course_id = course_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get agent workflow summary
CREATE OR REPLACE FUNCTION get_agent_workflow_summary(course_uuid UUID)
RETURNS TABLE (
    agent_name VARCHAR(100),
    total_steps INTEGER,
    completed_steps INTEGER,
    error_steps INTEGER,
    avg_execution_time_ms INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        awl.agent_name,
        COUNT(*)::INTEGER as total_steps,
        COUNT(CASE WHEN awl.step_status = 'completed' THEN 1 END)::INTEGER as completed_steps,
        COUNT(CASE WHEN awl.step_status = 'error' THEN 1 END)::INTEGER as error_steps,
        AVG(awl.execution_time_ms)::INTEGER as avg_execution_time_ms,
        MAX(awl.created_at) as last_activity
    FROM agent_workflow_logs awl
    WHERE awl.course_id = course_uuid
    GROUP BY awl.agent_name
    ORDER BY last_activity DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR EASY QUERYING
-- ============================================

-- View for course overview with statistics
CREATE VIEW course_overview AS
SELECT 
    c.id,
    c.session_id,
    c.topic,
    c.status,
    c.images_per_module,
    c.videos_per_module,
    c.created_at,
    c.updated_at,
    COUNT(cm.id) as module_count,
    COALESCE(SUM(jsonb_array_length(cm.images)), 0) as total_images,
    COALESCE(SUM(jsonb_array_length(cm.videos)), 0) as total_videos,
    CASE 
        WHEN c.status = 'completed' THEN 100
        WHEN c.status = 'error' THEN 0
        ELSE (
            SELECT COALESCE(AVG(progress_percentage), 0)::INTEGER 
            FROM course_progress cp 
            WHERE cp.course_id = c.id
        )
    END as progress_percentage
FROM courses c
LEFT JOIN course_modules cm ON c.id = cm.course_id
GROUP BY c.id, c.session_id, c.topic, c.status, c.images_per_module, c.videos_per_module, c.created_at, c.updated_at;

-- View for module overview
CREATE VIEW module_overview AS
SELECT 
    cm.id,
    cm.course_id,
    cm.filename,
    cm.title,
    cm.module_order,
    jsonb_array_length(cm.images) as image_count,
    jsonb_array_length(cm.videos) as video_count,
    cm.created_at,
    cm.updated_at,
    c.topic as course_topic,
    c.status as course_status
FROM course_modules cm
JOIN courses c ON cm.course_id = c.id
ORDER BY cm.course_id, cm.module_order;

-- View for recent course activity
CREATE VIEW recent_course_activity AS
SELECT 
    c.id as course_id,
    c.topic,
    c.status,
    cp.step_name,
    cp.step_message,
    cp.progress_percentage,
    cp.created_at as activity_time,
    'progress' as activity_type
FROM courses c
JOIN course_progress cp ON c.id = cp.course_id
WHERE cp.created_at > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
    c.id as course_id,
    c.topic,
    c.status,
    awl.agent_name || ' - ' || awl.step_name as step_name,
    awl.step_message,
    NULL as progress_percentage,
    awl.created_at as activity_time,
    'agent_log' as activity_type
FROM courses c
JOIN agent_workflow_logs awl ON c.id = awl.course_id
WHERE awl.created_at > NOW() - INTERVAL '24 hours'

ORDER BY activity_time DESC;

-- ============================================
-- DISABLE RLS POLICIES (as requested)
-- ============================================

-- Disable RLS for all tables
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_media DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE search_keywords DISABLE ROW LEVEL SECURITY;
ALTER TABLE websocket_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE agent_workflow_logs DISABLE ROW LEVEL SECURITY;

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to clean up old course data
CREATE OR REPLACE FUNCTION cleanup_old_courses(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM courses 
    WHERE created_at < NOW() - (days_old * INTERVAL '30 day')
    AND status = 'error';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up inactive WebSocket sessions
CREATE OR REPLACE FUNCTION cleanup_inactive_sessions(hours_old INTEGER DEFAULT 24)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM websocket_sessions 
    WHERE last_activity < NOW() - (hours_old * INTERVAL '1 hour')
    AND is_active = FALSE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get course progress history
CREATE OR REPLACE FUNCTION get_course_progress_history(course_uuid UUID)
RETURNS TABLE (
    step_name VARCHAR(100),
    step_message TEXT,
    progress_percentage INTEGER,
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cp.step_name,
        cp.step_message,
        cp.progress_percentage,
        cp.status,
        cp.created_at
    FROM course_progress cp
    WHERE cp.course_id = course_uuid
    ORDER BY cp.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to update WebSocket session activity
CREATE OR REPLACE FUNCTION update_session_activity(session_id_param VARCHAR(255))
RETURNS VOID AS $$
BEGIN
    UPDATE websocket_sessions 
    SET last_activity = NOW(), is_active = TRUE
    WHERE session_id = session_id_param;
    
    IF NOT FOUND THEN
        INSERT INTO websocket_sessions (session_id, is_active, last_activity)
        VALUES (session_id_param, TRUE, NOW());
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get full course data with modules and media
CREATE OR REPLACE FUNCTION get_full_course_data(course_uuid UUID)
RETURNS TABLE (
    course_id UUID,
    topic TEXT,
    status VARCHAR(50),
    structure JSONB,
    images_per_module INTEGER,
    videos_per_module INTEGER,
    course_created_at TIMESTAMP WITH TIME ZONE,
    module_id UUID,
    filename VARCHAR(255),
    title TEXT,
    content TEXT,
    images JSONB,
    videos JSONB,
    module_order INTEGER,
    module_created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as course_id,
        c.topic,
        c.status,
        c.structure,
        c.images_per_module,
        c.videos_per_module,
        c.created_at as course_created_at,
        cm.id as module_id,
        cm.filename,
        cm.title,
        cm.content,
        cm.images,
        cm.videos,
        cm.module_order,
        cm.created_at as module_created_at
    FROM courses c
    LEFT JOIN course_modules cm ON c.id = cm.course_id
    WHERE c.id = course_uuid
    ORDER BY cm.module_order;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL DATA CLEANUP
-- ============================================

-- Clean up any existing test data (optional)
-- DELETE FROM courses WHERE topic LIKE '%test%' OR topic LIKE '%sample%';

-- ============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_course_modules_course_order ON course_modules(course_id, module_order);
CREATE INDEX idx_course_progress_session_status ON course_progress(session_id, status);
CREATE INDEX idx_agent_logs_course_agent ON agent_workflow_logs(course_id, agent_name);
CREATE INDEX idx_course_files_course_type ON course_files(course_id, file_type);

-- Partial indexes for active sessions
CREATE INDEX idx_websocket_sessions_active_only ON websocket_sessions(session_id) WHERE is_active = TRUE;

-- ============================================
-- FINAL SETUP VERIFICATION
-- ============================================

-- Verify all tables are created
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'courses', 
    'course_modules', 
    'course_media', 
    'course_progress', 
    'search_keywords', 
    'websocket_sessions', 
    'course_files', 
    'agent_workflow_logs'
)
ORDER BY table_name;

-- Verify all functions are created
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'get_course_stats',
    'get_module_with_media_count',
    'get_course_progress_summary',
    'get_agent_workflow_summary',
    'get_course_progress_history',
    'get_full_course_data',
    'cleanup_old_courses',
    'cleanup_inactive_sessions',
    'update_session_activity'
)
ORDER BY routine_name;

-- Success message
SELECT 'Database schema setup completed successfully!' as status;