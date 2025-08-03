from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import asyncio
import json
import os
import time
import re
import shutil
from pathlib import Path
from typing import List, Dict, Any, Optional
import threading
from concurrent.futures import ThreadPoolExecutor
import uuid

# Import your existing course creation system
try:
    from paste_fixed import EnhancedCourseCreationSystem
    print("✅ Using enhanced course creation system with proper authentication")
except ImportError:
    from paste import EnhancedCourseCreationSystem
    print("⚠️ Using legacy course creation system - authentication issues may occur")

app = FastAPI(title="Course Creation API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class CourseRequest(BaseModel):
    topic: str
    images_per_module: int = 1
    videos_per_module: int = 1

class ProgressUpdate(BaseModel):
    session_id: str
    stage: str
    progress: int
    message: str
    current_module: Optional[int] = None
    total_modules: Optional[int] = None
    data: Optional[Dict[str, Any]] = None

# Global variables
active_connections: Dict[str, WebSocket] = {}
course_sessions: Dict[str, Dict] = {}
executor = ThreadPoolExecutor(max_workers=2)

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def send_progress(self, session_id: str, progress_data: Dict):
        if session_id in self.active_connections:
            try:
                await self.active_connections[session_id].send_text(json.dumps(progress_data))
            except:
                self.disconnect(session_id)

manager = WebSocketManager()

class SequentialCourseCreationSystemWithFolders(EnhancedCourseCreationSystem):
    def __init__(self, session_id: str, topic: str, images_per_module: int = 1, videos_per_module: int = 1):
        super().__init__(images_per_module, videos_per_module)
        self.session_id = session_id
        self.topic = topic
        
        # Create a sanitized folder name from the topic
        self.folder_name = self.sanitize_folder_name(topic)
        
        # Update the course directory to include the topic folder
        self.base_directory = Path("course_content")
        self.course_directory = self.base_directory / self.folder_name
        self.course_directory.mkdir(exist_ok=True, parents=True)
    
    def sanitize_folder_name(self, name: str) -> str:
        """Convert a topic name to a valid folder name"""
        # Replace spaces and special characters with underscores
        sanitized = re.sub(r'[^\w\s-]', '', name.lower())
        sanitized = re.sub(r'[-\s]+', '_', sanitized)
        return sanitized
        
    async def send_progress(self, stage: str, progress: int, message: str, current_module: int = None, total_modules: int = None, data: Dict = None):
        progress_data = {
            "session_id": self.session_id,
            "stage": stage,
            "progress": progress,
            "message": message,
            "current_module": current_module,
            "total_modules": total_modules,
            "data": data,
            "timestamp": time.time()
        }
        await manager.send_progress(self.session_id, progress_data)
    
    def create_crew(self, agents, tasks):
        """Create crew with proper imports"""
        from crewai import Crew, Process
        return Crew(
            agents=agents,
            tasks=tasks,
            verbose=True,
            process=Process.sequential
        )
    
    def parse_json_from_text(self, text: str) -> Dict:
        """Parse JSON from text with error handling"""
        try:
            # Try to find JSON in the text
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
                # If no JSON found, return empty dict
                return {}
        except Exception as e:
            print(f"JSON parsing error: {e}")
            return {}
    
    async def create_single_module_content(self, module_info: Dict, module_number: int, total_modules: int) -> str:
        """Create content for a single module"""
        
        # Create agents
        _, content_creator, keyword_generator, _, content_enhancer = self.create_agents()
        
        # Step 1: Create basic content
        progress = int(10 + (module_number - 1) * 80 / total_modules)
        await self.send_progress("content", progress, f"Creating content for module {module_number}: {module_info.get('title', '')}", module_number, total_modules)
        
        content_task = self.create_single_content_task(module_info, content_creator)
        content_crew = self.create_crew([content_creator], [content_task])
        content_result = content_crew.kickoff()
        basic_content = str(content_result.raw)
        
        # Step 2: Generate keywords for this module
        progress = int(15 + (module_number - 1) * 80 / total_modules)
        await self.send_progress("keywords", progress, f"Generating search keywords for module {module_number}", module_number, total_modules)
        
        keywords_task = self.create_single_module_keyword_task(module_info, keyword_generator)
        keywords_crew = self.create_crew([keyword_generator], [keywords_task])
        keywords_result = keywords_crew.kickoff()
        
        # Parse keywords
        keywords_data = self.parse_json_from_text(str(keywords_result.raw))
        if not keywords_data:
            # Create default keywords if parsing fails
            keywords_data = {
                "image_keywords": [f"{module_info.get('title', '')} tutorial", f"{module_info.get('title', '')} guide"],
                "video_keywords": [f"{module_info.get('title', '')} tutorial", f"{module_info.get('title', '')} explanation"]
            }
        
        # Step 3: Search for media
        progress = int(20 + (module_number - 1) * 80 / total_modules)
        await self.send_progress("media", progress, f"Searching for images and videos for module {module_number}", module_number, total_modules)
        
        media_data = await self.search_media_for_module(keywords_data, module_info.get('filename', ''))
        
        # Step 4: Enhance content with media
        progress = int(25 + (module_number - 1) * 80 / total_modules)
        await self.send_progress("enhancement", progress, f"Enhancing module {module_number} with media", module_number, total_modules)
        
        if media_data['images'] or media_data['videos']:
            enhancement_task = self.create_content_enhancement_task(
                module_info.get('filename', ''),
                basic_content,
                media_data,
                content_enhancer
            )
            enhancement_crew = self.create_crew([content_enhancer], [enhancement_task])
            enhancement_result = enhancement_crew.kickoff()
            final_content = str(enhancement_result.raw)
        else:
            final_content = basic_content
        
        return final_content
    
    def create_single_content_task(self, module_info: Dict, agent):
        """Create content task for a single module"""
        from crewai import Task
        
        task = Task(
            description=f"""
            Create comprehensive content for this module:
            
            Title: {module_info.get('title', '')}
            File: {module_info.get('filename', '')}
            Subtopics: {', '.join(module_info.get('subtopics', []))}
            Objectives: {', '.join(module_info.get('objectives', []))}
            Difficulty: {module_info.get('difficulty', 'Beginner')}
            
            Requirements:
            - Write 10-12 minutes of reading content (approximately 1200-1500 words)
            - Include clear introduction and overview
            - Detailed explanations of concepts
            - Practical examples and code snippets (if applicable)
            - Step-by-step tutorials or guides
            - Key takeaways and summary
            - Practice exercises or questions
            - References and further reading
            
            Format as markdown with proper headers, code blocks, and formatting.
            Make it engaging and educational for self-paced learning.
            Leave placeholder sections for [IMAGES] and [VIDEOS] to be added later.
            """,
            expected_output=f"Complete markdown content for {module_info.get('filename', '')} with comprehensive educational material",
            agent=agent
        )
        
        return task
    
    def create_single_module_keyword_task(self, module_info: Dict, agent):
        """Create keyword generation task for a single module"""
        from crewai import Task
        
        task = Task(
            description=f"""
            Generate search keywords for this specific module:
            
            Title: {module_info.get('title', '')}
            Subtopics: {', '.join(module_info.get('subtopics', []))}
            
            Generate:
            1. {self.images_per_module * 2} image search keywords - focused on visual concepts, diagrams, illustrations
            2. {self.videos_per_module * 2} video search keywords - focused on tutorials, explanations, demonstrations
            
            Requirements:
            - Keywords should be specific and relevant to the module content
            - Image keywords should focus on visual learning aids
            - Video keywords should focus on educational content
            - Each keyword should be 2-4 words maximum
            - Keywords should be different from each other
            
            Return as JSON with structure:
            {{
                "image_keywords": ["keyword1", "keyword2", ...],
                "video_keywords": ["keyword1", "keyword2", ...]
            }}
            """,
            expected_output="JSON structure with image and video keywords for the module",
            agent=agent
        )
        
        return task
    
    async def search_media_for_module(self, keywords_data: Dict, filename: str) -> Dict:
        """Search media for a single module"""
        module_results = {
            "filename": filename,
            "images": [],
            "videos": []
        }
        
        # Search images
        for keyword in keywords_data.get('image_keywords', [])[:self.images_per_module]:
            try:
                result = self.image_search_tool._run(keyword, 1)
                if result and not result.startswith("Error") and not result.startswith("No images"):
                    images = json.loads(result)
                    module_results["images"].extend(images)
                    await asyncio.sleep(0.5)  # Rate limiting
            except Exception as e:
                print(f"Error searching images for '{keyword}': {e}")
        
        # Search videos
        for keyword in keywords_data.get('video_keywords', [])[:self.videos_per_module]:
            try:
                result = self.youtube_search_tool._run(keyword, 1)
                if result and not result.startswith("Error") and not result.startswith("No videos"):
                    videos = json.loads(result)
                    module_results["videos"].extend(videos)
                    await asyncio.sleep(0.5)  # Rate limiting
            except Exception as e:
                print(f"Error searching videos for '{keyword}': {e}")
        
        return module_results
    
    def create_content_enhancement_task(self, filename: str, content: str, media_data: Dict, agent):
        """Create task for enhancing content with media"""
        from crewai import Task
        
        task = Task(
            description=f"""
            Enhance the course content by integrating relevant images and videos.

            File: {filename}

            Original Content: {content}

            Media Data: {json.dumps(media_data, indent=2)}

            Instructions:
            1. Integrate images and videos naturally into the content
            2. Add images after relevant sections with proper markdown formatting
            3. Add videos in appropriate sections with descriptions
            4. Use this format for images:
               ![Image Description](image_url)

            5. Use this format for videos:
               ### 📺 Related Video: [Video Title](video_url)
               *Description: Video description*

            6. Ensure media placement enhances learning
            7. Add a "Visual Resources" section at the end with all media links
            8. Make the content more attractive and engaging

            Return the enhanced markdown content with integrated media.
            """,
            expected_output=f"Enhanced markdown content for {filename} with integrated images and videos",
            agent=agent
        )

        return task
    
    async def run_sequential_course_creation(self, course_topic: str):
        """Main method for sequential course creation with folder organization"""
        
        await self.send_progress("starting", 0, f"Starting sequential course creation for: {course_topic} in folder: {self.folder_name}")
        
        # Step 1: Create course structure
        await self.send_progress("structure", 5, "Creating course structure...")
        course_planner, _, _, _, _ = self.create_agents()
        
        structure_task = self.create_structure_task(course_topic, course_planner)
        structure_crew = self.create_crew([course_planner], [structure_task])
        structure_result = structure_crew.kickoff()
        
        # Parse structure result
        try:
            course_structure = self.parse_json_from_text(str(structure_result.raw))
            if not course_structure or 'modules' not in course_structure:
                course_structure = self.create_default_structure(course_topic)
            
            total_modules = len(course_structure.get('modules', []))
            await self.send_progress("structure", 10, f"Course structure created: {total_modules} modules", data={"course_structure": course_structure})
            
        except Exception as e:
            await self.send_progress("error", 10, f"Structure creation failed: {str(e)}")
            course_structure = self.create_default_structure(course_topic)
            total_modules = len(course_structure.get('modules', []))
        
        # Step 2: Process each module sequentially
        for i, module_info in enumerate(course_structure.get('modules', []), 1):
            try:
                filename = module_info.get('filename', f'module_{i:02d}.md')
                
                await self.send_progress("processing", 
                                       int(10 + (i * 80) / total_modules), 
                                       f"Processing module {i}/{total_modules}: {module_info.get('title', '')}", 
                                       i, total_modules)
                
                # Create complete content for this module
                final_content = await self.create_single_module_content(module_info, i, total_modules)
                
                # Save the file
                self.save_content_to_file(filename, final_content)
                
                # Send the completed module data to frontend
                module_data = {
                    "filename": filename,
                    "content": final_content,
                    "module_number": i,
                    "title": module_info.get('title', f'Module {i}'),
                    "completed": True,
                    "topic_folder": self.folder_name  # Add topic folder information
                }
                
                progress = int(10 + ((i) * 80) / total_modules)
                await self.send_progress("module_complete", 
                                       progress, 
                                       f"Module {i}/{total_modules} completed and exported: {filename}", 
                                       i, total_modules, 
                                       module_data)
                
                # Small delay between modules
                await asyncio.sleep(1)
                
            except Exception as e:
                await self.send_progress("error", 
                                       int(10 + (i * 80) / total_modules), 
                                       f"Error processing module {i}: {str(e)}", 
                                       i, total_modules)
                
                # Create fallback content
                fallback_content = f"# {module_info.get('title', f'Module {i}')}\n\n[Content generation failed. Please regenerate.]\n"
                filename = module_info.get('filename', f'module_{i:02d}.md')
                self.save_content_to_file(filename, fallback_content)
        
        # Final completion
        await self.send_progress("complete", 100, "Sequential course creation completed!", None, None, {
            "total_modules": total_modules,
            "course_directory": str(self.course_directory),
            "topic_folder": self.folder_name,  # Add topic folder information
            "all_modules_exported": True
        })
        
        return course_structure

# Helper function to organize courses into folders
def organize_courses_into_folders():
    """Organize existing courses into topic folders based on filename patterns"""
    course_dir = Path("course_content")
    
    if not course_dir.exists():
        return {"status": "error", "message": "Course directory not found"}
    
    # Find all markdown files in the root directory
    md_files = list(course_dir.glob("*.md"))
    
    # Group files by topic
    topic_groups = {}
    for md_file in md_files:
        # Extract topic from filename (e.g., "matlab" from "02_matlab_module_2.md")
        match = re.search(r'(\d+)_([a-zA-Z0-9_]+)_', md_file.name)
        if match:
            topic = match.group(2)
            if topic not in topic_groups:
                topic_groups[topic] = []
            topic_groups[topic].append(md_file)
        else:
            # Handle files that don't match the pattern (like introduction_roadmap)
            if "introduction_roadmap" in md_file.name:
                # Try to find which topic it belongs to based on other files
                for topic in topic_groups:
                    if any(f"_{topic}_" in file.name for file in md_files):
                        if topic not in topic_groups:
                            topic_groups[topic] = []
                        topic_groups[topic].append(md_file)
                        break
                else:
                    # If no match, put in "general" folder
                    if "general" not in topic_groups:
                        topic_groups["general"] = []
                    topic_groups["general"].append(md_file)
            elif "expert_roadmap" in md_file.name:
                # Similar logic for expert_roadmap
                for topic in topic_groups:
                    if any(f"_{topic}_" in file.name for file in md_files):
                        if topic not in topic_groups:
                            topic_groups[topic] = []
                        topic_groups[topic].append(md_file)
                        break
                else:
                    if "general" not in topic_groups:
                        topic_groups["general"] = []
                    topic_groups["general"].append(md_file)
            else:
                # For any other files that don't match
                if "general" not in topic_groups:
                    topic_groups["general"] = []
                topic_groups["general"].append(md_file)
    
    # Move files to their respective topic folders
    for topic, files in topic_groups.items():
        topic_dir = course_dir / topic
        topic_dir.mkdir(exist_ok=True)
        
        for file in files:
            # Only move if the file is in the root directory
            if file.parent == course_dir:
                target_path = topic_dir / file.name
                # Copy instead of move to avoid issues with files in use
                shutil.copy2(file, target_path)
    
    return {
        "status": "success", 
        "message": f"Organized {sum(len(files) for files in topic_groups.values())} files into {len(topic_groups)} topic folders",
        "topics": list(topic_groups.keys())
    }

# API Routes
@app.post("/api/create-course")
async def create_course(request: CourseRequest):
    """Start sequential course creation process"""
    session_id = str(uuid.uuid4())
    
    # Store session info
    course_sessions[session_id] = {
        "topic": request.topic,
        "images_per_module": request.images_per_module,
        "videos_per_module": request.videos_per_module,
        "status": "starting",
        "created_at": time.time(),
        "completed_modules": []
    }
    
    # Start course creation in background
    async def create_course_task():
        try:
            system = SequentialCourseCreationSystemWithFolders(
                session_id, 
                request.topic,
                request.images_per_module, 
                request.videos_per_module
            )
            await system.run_sequential_course_creation(request.topic)
            course_sessions[session_id]["status"] = "completed"
        except Exception as e:
            await manager.send_progress(session_id, {
                "session_id": session_id,
                "stage": "error",
                "progress": 0,
                "message": f"Course creation failed: {str(e)}",
                "timestamp": time.time()
            })
            course_sessions[session_id]["status"] = "failed"
    
    # Run in background
    asyncio.create_task(create_course_task())
    
    return {"session_id": session_id, "message": "Sequential course creation started"}

@app.get("/api/courses")
async def get_courses():
    """Get all available courses organized by topic folders"""
    topic_folders = {}
    course_dir = Path("course_content")
    
    if course_dir.exists():
        # First, check for topic folders
        for folder in [d for d in course_dir.iterdir() if d.is_dir()]:
            topic_name = folder.name
            topic_courses = []
            
            for md_file in folder.glob("*.md"):
                try:
                    with open(md_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        # Remove ```markdown prefix and suffix if present
                        if content.startswith('```markdown'):
                            content = content.replace('```markdown\n', '', 1)
                            if content.endswith('```'):
                                content = content[:-3]
                        # Remove any triple backticks at the beginning or end of the content
                        content = re.sub(r'^```\s*\n', '', content)
                        content = re.sub(r'\n```\s*$', '', content)
                        title = content.split('\n')[0].replace('#', '').strip() if content else md_file.stem
                        
                    topic_courses.append({
                        "filename": md_file.name,
                        "title": title,
                        "content": content,
                        "created_at": md_file.stat().st_mtime,
                        "topic_folder": topic_name
                    })
                except Exception as e:
                    print(f"Error reading {md_file}: {e}")
            
            if topic_courses:
                topic_folders[topic_name] = sorted(topic_courses, key=lambda x: x["filename"])
        
        # Then check for files in the root directory (not in any folder)
        root_courses = []
        for md_file in course_dir.glob("*.md"):
            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Remove ```markdown prefix and suffix if present
                    if content.startswith('```markdown'):
                        content = content.replace('```markdown\n', '', 1)
                        if content.endswith('```'):
                            content = content[:-3]
                    # Remove any triple backticks at the beginning or end of the content
                    content = re.sub(r'^```\s*\n', '', content)
                    content = re.sub(r'\n```\s*$', '', content)
                    title = content.split('\n')[0].replace('#', '').strip() if content else md_file.stem
                    
                root_courses.append({
                    "filename": md_file.name,
                    "title": title,
                    "content": content,
                    "created_at": md_file.stat().st_mtime,
                    "topic_folder": None
                })
            except Exception as e:
                print(f"Error reading {md_file}: {e}")
        
        if root_courses:
            topic_folders["uncategorized"] = sorted(root_courses, key=lambda x: x["filename"])
    
    # Flatten the structure for backward compatibility
    all_courses = []
    for topic, courses in topic_folders.items():
        all_courses.extend(courses)
    
    return {
        "courses": sorted(all_courses, key=lambda x: x["filename"]),
        "topic_folders": topic_folders
    }

@app.get("/api/course/{topic_folder}/{filename}")
async def get_course_content_in_folder(topic_folder: str, filename: str):
    """Get specific course content from a topic folder"""
    course_dir = Path("course_content")
    file_path = course_dir / topic_folder / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Course file not found")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Remove ```markdown prefix and suffix if present
            if content.startswith('```markdown'):
                content = content.replace('```markdown\n', '', 1)
                if content.endswith('```'):
                    content = content[:-3]
            # Remove any triple backticks at the beginning or end of the content
            content = re.sub(r'^```\s*\n', '', content)
            content = re.sub(r'\n```\s*$', '', content)
            title = content.split('\n')[0].replace('#', '').strip() if content else filename
            
        return {
            "filename": filename,
            "title": title,
            "content": content,
            "created_at": file_path.stat().st_mtime,
            "topic_folder": topic_folder
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading course file: {str(e)}")

@app.get("/api/course/{filename}")
async def get_course_content(filename: str):
    """Get specific course content (backward compatibility)"""
    course_dir = Path("course_content")
    
    # First try to find the file in the root directory
    file_path = course_dir / filename
    if file_path.exists():
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Remove ```markdown prefix and suffix if present
                if content.startswith('```markdown'):
                    content = content.replace('```markdown\n', '', 1)
                    if content.endswith('```'):
                        content = content[:-3]
                # Remove any triple backticks at the beginning or end of the content
                content = re.sub(r'^```\s*\n', '', content)
                content = re.sub(r'\n```\s*$', '', content)
                title = content.split('\n')[0].replace('#', '').strip() if content else filename
                
            return {
                "filename": filename,
                "title": title,
                "content": content,
                "created_at": file_path.stat().st_mtime,
                "topic_folder": None
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading course file: {str(e)}")
    
    # If not found in root, search in topic folders
    for folder in [d for d in course_dir.iterdir() if d.is_dir()]:
        potential_path = folder / filename
        if potential_path.exists():
            try:
                with open(potential_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Remove ```markdown prefix and suffix if present
                    if content.startswith('```markdown'):
                        content = content.replace('```markdown\n', '', 1)
                        if content.endswith('```'):
                            content = content[:-3]
                    # Remove any triple backticks at the beginning or end of the content
                    content = re.sub(r'^```\s*\n', '', content)
                    content = re.sub(r'\n```\s*$', '', content)
                    title = content.split('\n')[0].replace('#', '').strip() if content else filename
                    
                return {
                    "filename": filename,
                    "title": title,
                    "content": content,
                    "created_at": potential_path.stat().st_mtime,
                    "topic_folder": folder.name
                }
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error reading course file: {str(e)}")
    
    # If not found anywhere
    raise HTTPException(status_code=404, detail="Course file not found")

@app.post("/api/organize-courses")
async def organize_courses():
    """Organize existing courses into topic folders"""
    result = organize_courses_into_folders()
    return result

@app.get("/api/session/{session_id}")
async def get_session_info(session_id: str):
    """Get session information"""
    if session_id not in course_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return course_sessions[session_id]

@app.delete("/api/course/{filename}")
async def delete_course(filename: str):
    """Delete a specific course file"""
    course_dir = Path("course_content")
    file_path = course_dir / filename
    
    if not file_path.exists():
        # Check in topic folders
        for folder in [d for d in course_dir.iterdir() if d.is_dir()]:
            potential_path = folder / filename
            if potential_path.exists():
                file_path = potential_path
                break
        else:
            raise HTTPException(status_code=404, detail="Course file not found")
    
    try:
        file_path.unlink()
        return {"message": f"Course {filename} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting course: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint with configuration status"""
    try:
        from config import get_config
        from api_client import test_api_connections
        
        config = get_config()
        
        # Test API connections
        api_tests = test_api_connections()
        
        # Count working providers
        working_providers = [p for p, r in api_tests.items() if r["success"]]
        
        return {
            "status": "healthy" if working_providers else "degraded",
            "configuration": {
                "is_valid": config.validation_result.is_valid,
                "errors": config.validation_result.errors,
                "warnings": config.validation_result.warnings
            },
            "providers": api_tests,
            "working_providers": working_providers,
            "media_search": {
                "images": config.is_media_search_enabled(),
                "youtube": config.is_youtube_search_enabled()
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "message": "Health check failed"
        }

@app.post("/api/regenerate-module")
async def regenerate_module(request: dict):
    """Regenerate a specific module"""
    filename = request.get('filename')
    session_id = request.get('session_id')
    module_info = request.get('module_info')
    topic = request.get('topic')
    
    if not all([filename, session_id, module_info]):
        raise HTTPException(status_code=400, detail="Missing required parameters")
    
    # Create a temporary system for regeneration
    system = SequentialCourseCreationSystemWithFolders(session_id, topic or "general", 1, 1)
    
    try:
        # Regenerate the module content
        final_content = await system.create_single_module_content(
            module_info, 
            module_info.get('module_number', 1), 
            1
        )
        
        # Save the regenerated content
        system.save_content_to_file(filename, final_content)
        
        return {
            "filename": filename,
            "content": final_content,
            "message": f"Module {filename} regenerated successfully",
            "topic_folder": system.folder_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error regenerating module: {str(e)}")

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time progress updates"""
    await manager.connect(websocket, session_id)
    
    try:
        while True:
            # Keep connection alive and listen for any messages
            try:
                # Wait for messages with timeout
                message = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                # Handle any client messages if needed
                print(f"Received message from {session_id}: {message}")
            except asyncio.TimeoutError:
                # Send ping to keep connection alive
                await websocket.ping()
    except WebSocketDisconnect:
        manager.disconnect(session_id)
        print(f"Client {session_id} disconnected")
    except Exception as e:
        print(f"WebSocket error for {session_id}: {e}")
        manager.disconnect(session_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)