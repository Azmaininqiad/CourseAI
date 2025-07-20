from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import asyncio
import json
import os
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
import threading
from concurrent.futures import ThreadPoolExecutor
import uuid

# Import your existing course creation system
from paste import EnhancedCourseCreationSystem

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

class EnhancedCourseCreationSystemWithProgress(EnhancedCourseCreationSystem):
    def __init__(self, session_id: str, images_per_module: int = 1, videos_per_module: int = 1):
        super().__init__(images_per_module, videos_per_module)
        self.session_id = session_id
        
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
        
    async def run_enhanced_course_creation_with_progress(self, course_topic: str):
        """Enhanced course creation with real-time progress updates"""
        
        await self.send_progress("starting", 0, f"Starting course creation for: {course_topic}")
        
        # Create agents
        course_planner, content_creator, keyword_generator, media_collector, content_enhancer = self.create_agents()
        
        # Step 1: Create course structure
        await self.send_progress("structure", 10, "Creating course structure...")
        structure_task = self.create_structure_task(course_topic, course_planner)
        
        structure_crew = self.create_crew([course_planner], [structure_task])
        structure_result = structure_crew.kickoff()
        
        # Parse structure result
        try:
            course_structure = self.parse_structure_result(structure_result, course_topic)
            await self.send_progress("structure", 20, f"Course structure created: {len(course_structure.get('modules', []))} modules")
        except Exception as e:
            await self.send_progress("error", 20, f"Structure creation failed: {str(e)}")
            course_structure = self.create_default_structure(course_topic)
        
        # Step 2: Generate keywords
        await self.send_progress("keywords", 25, "Generating search keywords...")
        keyword_task = self.create_keyword_generation_task(course_structure, keyword_generator)
        
        keyword_crew = self.create_crew([keyword_generator], [keyword_task])
        keyword_result = keyword_crew.kickoff()
        
        try:
            keywords_data = self.parse_keyword_result(keyword_result, course_structure)
            await self.send_progress("keywords", 30, f"Keywords generated for {len(keywords_data.get('modules', []))} modules")
        except Exception as e:
            await self.send_progress("error", 30, f"Keyword generation failed: {str(e)}")
            keywords_data = self.create_default_keywords(course_structure)
        
        # Step 3: Search media
        await self.send_progress("media", 35, "Searching for images and videos...")
        media_data = await self.search_media_with_progress(keywords_data)
        
        total_images = sum(len(module.get('images', [])) for module in media_data.get('modules', []))
        total_videos = sum(len(module.get('videos', [])) for module in media_data.get('modules', []))
        await self.send_progress("media", 50, f"Media collection complete: {total_images} images, {total_videos} videos")
        
        # Step 4: Create content
        await self.send_progress("content", 55, "Creating course content...")
        content_tasks = self.create_content_tasks(course_structure, content_creator)
        
        basic_content = {}
        total_modules = len(content_tasks)
        
        for i, task in enumerate(content_tasks, 1):
            current_progress = 55 + (i * 25) // total_modules
            await self.send_progress("content", current_progress, f"Creating content for module {i}/{total_modules}", i, total_modules)
            
            try:
                task_crew = self.create_crew([content_creator], [task])
                result = task_crew.kickoff()
                filename = course_structure['modules'][i-1]['filename']
                basic_content[filename] = str(result.raw)
                
                # Save basic content immediately
                self.save_content_to_file(filename, basic_content[filename])
                
                # Send the completed module data
                module_data = {
                    "filename": filename,
                    "content": basic_content[filename],
                    "module_number": i,
                    "title": course_structure['modules'][i-1].get('title', f'Module {i}')
                }
                await self.send_progress("module_complete", current_progress, f"Module {i} completed", i, total_modules, module_data)
                
                await asyncio.sleep(1)  # Rate limiting
                
            except Exception as e:
                await self.send_progress("error", current_progress, f"Error creating module {i}: {str(e)}", i, total_modules)
                filename = course_structure['modules'][i-1]['filename']
                basic_content[filename] = f"# Module {i}\n\n[Content generation failed. Please regenerate.]\n"
                self.save_content_to_file(filename, basic_content[filename])
        
        # Step 5: Enhance with media
        await self.send_progress("enhancement", 80, "Enhancing content with media...")
        
        for i, module in enumerate(media_data.get('modules', []), 1):
            filename = module.get('filename', '')
            if filename in basic_content:
                current_progress = 80 + (i * 15) // len(media_data.get('modules', []))
                await self.send_progress("enhancement", current_progress, f"Enhancing module {i} with media", i, len(media_data.get('modules', [])))
                
                try:
                    enhancement_task = self.create_content_enhancement_task(
                        filename, basic_content[filename], module, content_enhancer
                    )
                    
                    enhancement_crew = self.create_crew([content_enhancer], [enhancement_task])
                    enhanced_result = enhancement_crew.kickoff()
                    enhanced_content = str(enhanced_result.raw)
                    
                    self.save_content_to_file(filename, enhanced_content)
                    
                    # Send updated module data
                    module_data = {
                        "filename": filename,
                        "content": enhanced_content,
                        "module_number": i,
                        "title": course_structure['modules'][i-1].get('title', f'Module {i}'),
                        "enhanced": True
                    }
                    await self.send_progress("module_enhanced", current_progress, f"Module {i} enhanced", i, len(media_data.get('modules', [])), module_data)
                    
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    await self.send_progress("error", current_progress, f"Error enhancing module {i}: {str(e)}")
        
        await self.send_progress("complete", 100, "Course creation completed!", None, None, {
            "total_modules": len(course_structure.get('modules', [])),
            "total_images": total_images,
            "total_videos": total_videos,
            "course_directory": str(self.course_directory)
        })
        
        return course_structure, media_data
    
    async def search_media_with_progress(self, keywords_data: Dict) -> Dict:
        """Search for media with progress updates"""
        all_results = {"modules": []}
        total_modules = len(keywords_data.get('modules', []))
        
        for i, module in enumerate(keywords_data.get('modules', []), 1):
            filename = module.get('filename', '')
            progress = 35 + (i * 15) // total_modules
            await self.send_progress("media", progress, f"Searching media for module {i}/{total_modules}: {filename}", i, total_modules)
            
            module_results = {
                "filename": filename,
                "images": [],
                "videos": []
            }
            
            # Search images
            for keyword in module.get('image_keywords', []):
                try:
                    result = self.image_search_tool._run(keyword, self.images_per_module)
                    if result and not result.startswith("Error") and not result.startswith("No images"):
                        images = json.loads(result)
                        module_results["images"].extend(images)
                        await asyncio.sleep(0.5)
                except Exception as e:
                    await self.send_progress("error", progress, f"Error searching images: {str(e)}")
            
            # Search videos
            for keyword in module.get('video_keywords', []):
                try:
                    result = self.youtube_search_tool._run(keyword, self.videos_per_module)
                    if result and not result.startswith("Error") and not result.startswith("No videos"):
                        videos = json.loads(result)
                        module_results["videos"].extend(videos)
                        await asyncio.sleep(0.5)
                except Exception as e:
                    await self.send_progress("error", progress, f"Error searching videos: {str(e)}")
            
            all_results["modules"].append(module_results)
        
        return all_results
    
    def create_crew(self, agents, tasks):
        """Create crew with proper imports"""
        from crewai import Crew, Process
        return Crew(
            agents=agents,
            tasks=tasks,
            verbose=True,
            process=Process.sequential
        )
    
    def parse_structure_result(self, result, course_topic):
        """Parse structure result with error handling"""
        import re
        raw_output = str(result.raw)
        json_match = re.search(r'\{.*\}', raw_output, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            return json.loads(json_str)
        else:
            return self.create_default_structure(course_topic)
    
    def parse_keyword_result(self, result, course_structure):
        """Parse keyword result with error handling"""
        import re
        raw_output = str(result.raw)
        json_match = re.search(r'\{.*\}', raw_output, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            return json.loads(json_str)
        else:
            return self.create_default_keywords(course_structure)

# API Routes
@app.post("/api/create-course")
async def create_course(request: CourseRequest):
    """Start course creation process"""
    session_id = str(uuid.uuid4())
    
    # Store session info
    course_sessions[session_id] = {
        "topic": request.topic,
        "images_per_module": request.images_per_module,
        "videos_per_module": request.videos_per_module,
        "status": "starting",
        "created_at": time.time()
    }
    
    # Start course creation in background
    async def create_course_task():
        try:
            system = EnhancedCourseCreationSystemWithProgress(
                session_id, 
                request.images_per_module, 
                request.videos_per_module
            )
            await system.run_enhanced_course_creation_with_progress(request.topic)
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
    
    return {"session_id": session_id, "message": "Course creation started"}

@app.get("/api/courses")
async def get_courses():
    """Get all available courses"""
    courses = []
    course_dir = Path("course_content")
    
    if course_dir.exists():
        for md_file in course_dir.glob("*.md"):
            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    title = content.split('\n')[0].replace('#', '').strip() if content else md_file.stem
                    
                courses.append({
                    "filename": md_file.name,
                    "title": title,
                    "content": content,
                    "created_at": md_file.stat().st_mtime
                })
            except Exception as e:
                print(f"Error reading {md_file}: {e}")
    
    return {"courses": sorted(courses, key=lambda x: x["filename"])}

@app.get("/api/course/{filename}")
async def get_course_content(filename: str):
    """Get specific course content"""
    course_dir = Path("course_content")
    file_path = course_dir / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Course file not found")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            title = content.split('\n')[0].replace('#', '').strip() if content else filename
            
        return {
            "filename": filename,
            "title": title,
            "content": content,
            "created_at": file_path.stat().st_mtime
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading course file: {str(e)}")

@app.get("/api/session/{session_id}")
async def get_session_info(session_id: str):
    """Get session information"""
    if session_id not in course_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return course_sessions[session_id]

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time progress updates"""
    await manager.connect(websocket, session_id)
    
    try:
        while True:
            # Keep connection alive
            await asyncio.sleep(10)
            await websocket.ping()
    except WebSocketDisconnect:
        manager.disconnect(session_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(session_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)