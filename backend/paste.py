

import os
import json
import time
import re
from pathlib import Path
from typing import List, Dict, Any, Optional, Type
from crewai import Agent, Task, Crew, Process
from crewai.llms.base_llm import BaseLLM
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration
OPENROUTER_API_KEY = "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"
MODEL_NAME = "deepseek/deepseek-r1-0528:free"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Google API Configuration
GOOGLE_API_KEY = "AIzaSyBHusvort5npkkN_v_9Ts3s49Ilq-8Mzfk"
SEARCH_ENGINE_ID = "b41120c0291c9472d"
YOUTUBE_API_KEY = "AIzaSyA53M-JUnQgKFflmvf6OZlt7HG8Rwqugkw"

# Set environment variables
os.environ["OPENROUTER_API_KEY"] = OPENROUTER_API_KEY
os.environ["OPENROUTER_URL"] = OPENROUTER_URL
os.environ["MODEL_NAME"] = MODEL_NAME
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
os.environ["SEARCH_ENGINE_ID"] = SEARCH_ENGINE_ID
os.environ["YOUTUBE_API_KEY"] = YOUTUBE_API_KEY

class OpenRouterLLM(BaseLLM):
    """Custom LLM wrapper for OpenRouter API with DeepSeek R1"""

    def __init__(self, model: str = MODEL_NAME, api_key: str = OPENROUTER_API_KEY, base_url: str = OPENROUTER_URL, **kwargs):
        super().__init__(model=model)
        self.api_key = api_key
        self.base_url = base_url
        self.max_tokens = 100000
        self.temperature = 0.8

    def call(self, messages: List[Dict[str, str]], **kwargs: Any) -> str:
        """Make API call to OpenRouter"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://colab.research.google.com/",
            "X-Title": "CrewAI Course Creator"
        }

        data = {
            "model": self.model,
            "messages": messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "stream": False
        }

        try:
            response = requests.post(self.base_url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"API Error: {e}")
            return f"Error generating content: {str(e)}"

# Tool Classes
class ImageSearchInput(BaseModel):
    """Input schema for ImageSearchTool."""
    query: str = Field(..., description="Search query for finding relevant images")
    num_results: int = Field(default=1, description="Number of images to return")

class ImageSearchTool(BaseTool):
    name: str = "image_search_tool"
    description: str = "Search for relevant images using Google Custom Search API"
    args_schema: Type[BaseModel] = ImageSearchInput

    def _run(self, query: str, num_results: int = 1) -> str:
        """Execute the image search."""
        try:
            api_key = os.getenv("GOOGLE_API_KEY")
            search_engine_id = os.getenv("SEARCH_ENGINE_ID")

            url = "https://www.googleapis.com/customsearch/v1"
            params = {
                'key': api_key,
                'cx': search_engine_id,
                'q': query,
                'searchType': 'image',
                'num': min(num_results, 10),
                'safe': 'active',
                'imgType': 'photo',
                'imgSize': 'large'
            }

            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()

            if 'items' not in data:
                return f"No images found for query: {query}"

            results = []
            for item in data['items']:
                image_info = {
                    'url': item.get('link', ''),
                    'title': item.get('title', ''),
                    'context': item.get('snippet', ''),
                    'thumbnail': item.get('image', {}).get('thumbnailLink', ''),
                    'size': f"{item.get('image', {}).get('width', 'Unknown')}x{item.get('image', {}).get('height', 'Unknown')}"
                }
                results.append(image_info)

            return json.dumps(results, indent=2)

        except requests.RequestException as e:
            return f"Error searching for images: {str(e)}"
        except Exception as e:
            return f"Unexpected error in image search: {str(e)}"

class YouTubeSearchInput(BaseModel):
    """Input schema for YouTubeSearchTool."""
    query: str = Field(..., description="Search query for finding relevant YouTube videos")
    num_results: int = Field(default=1, description="Number of videos to return")

class YouTubeSearchTool(BaseTool):
    name: str = "youtube_search_tool"
    description: str = "Search for relevant YouTube videos using YouTube Data API"
    args_schema: Type[BaseModel] = YouTubeSearchInput

    def _run(self, query: str, num_results: int = 1) -> str:
        """Execute the YouTube search."""
        try:
            api_key = os.getenv("YOUTUBE_API_KEY")

            url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                'part': 'snippet',
                'maxResults': min(num_results, 25),
                'q': query,
                'type': 'video',
                'key': api_key,
                'order': 'relevance',
                'safeSearch': 'strict',
                'videoDefinition': 'high'
            }

            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()

            if 'items' not in data:
                return f"No videos found for query: {query}"

            # Get video details including duration
            video_ids = [item['id']['videoId'] for item in data['items']]
            details_url = "https://www.googleapis.com/youtube/v3/videos"
            details_params = {
                'part': 'contentDetails,statistics',
                'id': ','.join(video_ids),
                'key': api_key
            }

            details_response = requests.get(details_url, params=details_params)
            details_response.raise_for_status()
            details_data = details_response.json()

            # Create a mapping of video ID to details
            video_details = {}
            for item in details_data.get('items', []):
                video_details[item['id']] = {
                    'duration': item.get('contentDetails', {}).get('duration', 'Unknown'),
                    'viewCount': item.get('statistics', {}).get('viewCount', '0')
                }

            results = []
            for item in data['items']:
                video_id = item['id']['videoId']
                video_url = f"https://www.youtube.com/watch?v={video_id}"

                video_info = {
                    'title': item['snippet']['title'],
                    'url': video_url,
                    'channel': item['snippet']['channelTitle'],
                    'description': item['snippet']['description'][:200] + "..." if len(item['snippet']['description']) > 200 else item['snippet']['description'],
                    'published': item['snippet']['publishedAt'],
                    'duration': video_details.get(video_id, {}).get('duration', 'Unknown'),
                    'views': video_details.get(video_id, {}).get('viewCount', '0')
                }
                results.append(video_info)

            return json.dumps(results, indent=2)

        except requests.RequestException as e:
            return f"Error searching YouTube: {str(e)}"
        except Exception as e:
            return f"Unexpected error in YouTube search: {str(e)}"

class EnhancedCourseCreationSystem:
    """Enhanced system for course creation with media integration"""

    def __init__(self, images_per_module: int = 1, videos_per_module: int = 1):
        self.llm = OpenRouterLLM()
        self.course_directory = Path("course_content")
        self.course_directory.mkdir(exist_ok=True)

        # Configurable media counts
        self.images_per_module = images_per_module
        self.videos_per_module = videos_per_module

        # Initialize tools
        self.image_search_tool = ImageSearchTool()
        self.youtube_search_tool = YouTubeSearchTool()

    def create_agents(self) -> tuple:
        """Create specialized agents"""

        # Agent 1: Course Structure Creator
        course_planner = Agent(
            role='Course Structure Planner',
            goal='Create a comprehensive course outline and structure with 15 markdown files',
            backstory="""You are an expert educational designer who specializes in creating
            well-structured learning paths. You understand how to break down complex topics
            into digestible modules and create logical learning progressions.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

        # Agent 2: Content Creator
        content_creator = Agent(
            role='Course Content Creator',
            goal='Generate detailed course content for each module based on the structure',
            backstory="""You are an expert content creator and educator who excels at
            transforming course outlines into engaging, comprehensive learning materials.
            You create content that is both educational and engaging, suitable for
            self-paced learning.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

        # Agent 3: Keyword Generator
        keyword_generator = Agent(
            role='Search Keyword Generator',
            goal='Generate relevant search keywords for images and videos based on course content',
            backstory="""You are an expert at analyzing educational content and generating
            precise search keywords that will find the most relevant visual and video content
            to enhance learning materials.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

        # Agent 4: Media Collector
        media_collector = Agent(
            role='Media Content Collector',
            goal='Search and collect relevant images and videos for course modules',
            backstory="""You are a skilled researcher who excels at finding high-quality
            visual and video content that enhances educational materials. You know how to
            search effectively and select the most appropriate media.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm,
            tools=[self.image_search_tool, self.youtube_search_tool]
        )

        # Agent 5: Content Enhancer
        content_enhancer = Agent(
            role='Content Enhancement Specialist',
            goal='Integrate media content into course modules to make them more attractive',
            backstory="""You are an expert at enhancing educational content by seamlessly
            integrating relevant images and videos. You know how to place media content
            strategically to improve learning outcomes.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

        return course_planner, content_creator, keyword_generator, media_collector, content_enhancer

    def create_structure_task(self, course_topic: str, agent: Agent) -> Task:
        """Create task for course structure planning"""

        task = Task(
            description=f"""
            Create a comprehensive course structure for the topic: "{course_topic}"

            Requirements:
            1. Create exactly 15 markdown files with logical progression
            2. Start with "01_introduction_roadmap.md"
            3. End with "15_expert_roadmap.md"
            4. Each file should represent 10-12 minutes of reading content
            5. Total course should be approximately 3 hours

            For each file, provide:
            - File name (following the pattern: XX_descriptive_name.md)
            - Main topic/title
            - Key subtopics to cover
            - Learning objectives
            - Difficulty level
            - Estimated reading time

            Structure the course to flow logically from beginner to advanced concepts.
            Include practical examples, exercises, and real-world applications.

            Return the structure as a JSON format with file details.
            """,
            expected_output="A detailed JSON structure containing 15 course modules with filenames, topics, subtopics, and guidelines",
            agent=agent
        )

        return task

    def create_keyword_generation_task(self, course_structure: Dict, agent: Agent) -> Task:
        """Create task for generating search keywords"""

        task = Task(
            description=f"""
            Analyze the course structure and generate search keywords for each module.

            Course Structure: {json.dumps(course_structure, indent=2)}

            For each of the 15 modules, generate:
            1. {self.images_per_module} image search keywords - focused on visual concepts, diagrams, illustrations
            2. {self.videos_per_module} video search keywords - focused on tutorials, explanations, demonstrations

            Requirements:
            - Keywords should be specific and relevant to the module content
            - Image keywords should focus on visual learning aids
            - Video keywords should focus on educational content
            - Each keyword should be 2-4 words maximum
            - Keywords should be different from each other to get diverse results

            Return as JSON with structure:
            {{
                "modules": [
                    {{
                        "filename": "01_introduction_roadmap.md",
                        "image_keywords": ["keyword1", "keyword2", ...],
                        "video_keywords": ["keyword1", "keyword2", ...]
                    }},
                    ...
                ]
            }}
            """,
            expected_output="JSON structure with image and video keywords for each module",
            agent=agent
        )

        return task

    def create_media_collection_task(self, keywords_data: Dict, agent: Agent) -> Task:
        """Create task for collecting media content"""

        task = Task(
            description=f"""
            Search and collect images and videos for all course modules using the provided keywords.

            Keywords Data: {json.dumps(keywords_data, indent=2)}

            For each module:
            1. Search for {self.images_per_module} images using image keywords
            2. Search for {self.videos_per_module} videos using video keywords
            3. Use the image_search_tool and youtube_search_tool provided

            Instructions:
            - Use each keyword to search for relevant content
            - Collect high-quality, educational content
            - Ensure content is appropriate for learning
            - Return organized results by module

            Return results as JSON with structure:
            {{
                "modules": [
                    {{
                        "filename": "01_introduction_roadmap.md",
                        "images": [...],
                        "videos": [...]
                    }},
                    ...
                ]
            }}
            """,
            expected_output="JSON structure with collected images and videos for each module",
            agent=agent
        )

        return task

    def create_content_tasks(self, course_structure: Dict, agent: Agent) -> List[Task]:
        """Create content creation tasks for each module"""

        tasks = []

        for i, module in enumerate(course_structure.get('modules', []), 1):
            task = Task(
                description=f"""
                Create comprehensive content for module {i}: {module.get('title', '')}

                File: {module.get('filename', '')}

                Requirements:
                - Write 10-12 minutes of reading content (approximately 1200-1500 words)
                - Include the following subtopics: {', '.join(module.get('subtopics', []))}
                - Learning objectives: {', '.join(module.get('objectives', []))}
                - Difficulty level: {module.get('difficulty', 'Beginner')}

                Content should include:
                1. Clear introduction and overview
                2. Detailed explanations of concepts
                3. Practical examples and code snippets (if applicable)
                4. Step-by-step tutorials or guides
                5. Key takeaways and summary
                6. Practice exercises or questions
                7. References and further reading

                Format as markdown with proper headers, code blocks, and formatting.
                Make it engaging and educational for self-paced learning.
                Leave placeholder sections for [IMAGES] and [VIDEOS] to be added later.
                """,
                expected_output=f"Complete markdown content for {module.get('filename', '')} with comprehensive educational material",
                agent=agent
            )
            tasks.append(task)

        return tasks

    def create_content_enhancement_task(self, filename: str, content: str, media_data: Dict, agent: Agent) -> Task:
        """Create task for enhancing content with media"""

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

    def save_content_to_file(self, filename: str, content: str):
        """Save content to markdown file"""
        file_path = self.course_directory / filename
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Saved: {filename}")

    def search_media_parallel(self, keywords_data: Dict) -> Dict:
        """Search for media content in parallel"""
        print("🔍 Searching for media content...")

        all_results = {"modules": []}

        for module in keywords_data.get('modules', []):
            filename = module.get('filename', '')
            print(f"📸 Searching media for: {filename}")

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
                        time.sleep(0.5)  # Rate limiting
                except Exception as e:
                    print(f"❌ Error searching images for '{keyword}': {e}")

            # Search videos
            for keyword in module.get('video_keywords', []):
                try:
                    result = self.youtube_search_tool._run(keyword, self.videos_per_module)
                    if result and not result.startswith("Error") and not result.startswith("No videos"):
                        videos = json.loads(result)
                        module_results["videos"].extend(videos)
                        time.sleep(0.5)  # Rate limiting
                except Exception as e:
                    print(f"❌ Error searching videos for '{keyword}': {e}")

            all_results["modules"].append(module_results)

        return all_results

    def create_default_structure(self, course_topic: str) -> Dict:
        """Create a default course structure if JSON parsing fails"""

        base_name = course_topic.lower().replace(' ', '_').replace('-', '_')

        modules = []
        for i in range(1, 16):
            if i == 1:
                title = f"Introduction and Roadmap to {course_topic}"
                filename = f"01_introduction_roadmap.md"
                subtopics = ["Course Overview", "Learning Path", "Prerequisites", "Goals"]
            elif i == 15:
                title = f"Expert Roadmap and Advanced {course_topic}"
                filename = f"15_expert_roadmap.md"
                subtopics = ["Advanced Concepts", "Expert Resources", "Career Paths", "Next Steps"]
            else:
                title = f"{course_topic} - Module {i}"
                filename = f"{i:02d}_{base_name}_module_{i}.md"
                subtopics = [f"Topic {i}.1", f"Topic {i}.2", f"Topic {i}.3"]

            modules.append({
                "filename": filename,
                "title": title,
                "subtopics": subtopics,
                "objectives": [f"Understand {title}"],
                "difficulty": "Intermediate" if i > 10 else "Beginner",
                "estimated_time": "10-12 minutes"
            })

        return {"modules": modules}

    def run_enhanced_course_creation(self, course_topic: str):
        """Main method to run the enhanced course creation process"""

        print(f"🚀 Starting enhanced course creation for: {course_topic}")
        print("=" * 60)

        # Create agents
        course_planner, content_creator, keyword_generator, media_collector, content_enhancer = self.create_agents()

        # Step 1: Create course structure
        print("\n📋 Step 1: Creating course structure...")
        structure_task = self.create_structure_task(course_topic, course_planner)

        structure_crew = Crew(
            agents=[course_planner],
            tasks=[structure_task],
            verbose=True,
            process=Process.sequential
        )

        structure_result = structure_crew.kickoff()

        # Parse structure result
        try:
            raw_output = str(structure_result.raw)
            json_match = re.search(r'\{.*\}', raw_output, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                course_structure = json.loads(json_str)
                print(f"✅ Parsed course structure: {len(course_structure.get('modules', []))} modules")
            else:
                print("⚠️ Using default structure")
                course_structure = self.create_default_structure(course_topic)
        except Exception as e:
            print(f"❌ JSON parsing failed: {e}")
            course_structure = self.create_default_structure(course_topic)

        # Step 2: Generate keywords for media search
        print("\n🔑 Step 2: Generating search keywords...")
        keyword_task = self.create_keyword_generation_task(course_structure, keyword_generator)

        keyword_crew = Crew(
            agents=[keyword_generator],
            tasks=[keyword_task],
            verbose=True,
            process=Process.sequential
        )

        keyword_result = keyword_crew.kickoff()

        # Parse keyword result
        try:
            raw_output = str(keyword_result.raw)
            json_match = re.search(r'\{.*\}', raw_output, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                keywords_data = json.loads(json_str)
                print(f"✅ Generated keywords for {len(keywords_data.get('modules', []))} modules")
            else:
                print("⚠️ Using default keywords")
                keywords_data = self.create_default_keywords(course_structure)
        except Exception as e:
            print(f"❌ Keyword parsing failed: {e}")
            keywords_data = self.create_default_keywords(course_structure)

        # Step 3: Search and collect media content
        print("\n🔍 Step 3: Searching and collecting media content...")
        media_data = self.search_media_parallel(keywords_data)

        total_images = sum(len(module.get('images', [])) for module in media_data.get('modules', []))
        total_videos = sum(len(module.get('videos', [])) for module in media_data.get('modules', []))
        print(f"✅ Collected {total_images} images and {total_videos} videos")

        # Step 4: Create basic content for each module
        print("\n📝 Step 4: Creating course content...")
        content_tasks = self.create_content_tasks(course_structure, content_creator)

        basic_content = {}
        for i, task in enumerate(content_tasks, 1):
            print(f"📄 Creating content for module {i}/15...")

            try:
                task_crew = Crew(
                    agents=[content_creator],
                    tasks=[task],
                    verbose=True,
                    process=Process.sequential
                )

                result = task_crew.kickoff()
                filename = course_structure['modules'][i-1]['filename']
                basic_content[filename] = str(result.raw)
                time.sleep(2)  # Rate limiting

            except Exception as e:
                print(f"❌ Error creating content for module {i}: {e}")
                filename = course_structure['modules'][i-1]['filename']
                basic_content[filename] = f"# Module {i}\n\n[Content generation failed. Please regenerate.]\n"

        # Step 5: Enhance content with media
        print("\n🎨 Step 5: Enhancing content with media...")

        for module in media_data.get('modules', []):
            filename = module.get('filename', '')
            if filename in basic_content:
                print(f"🎬 Enhancing: {filename}")

                try:
                    enhancement_task = self.create_content_enhancement_task(
                        filename,
                        basic_content[filename],
                        module,
                        content_enhancer
                    )

                    enhancement_crew = Crew(
                        agents=[content_enhancer],
                        tasks=[enhancement_task],
                        verbose=True,
                        process=Process.sequential
                    )

                    enhanced_result = enhancement_crew.kickoff()
                    enhanced_content = str(enhanced_result.raw)

                    # Save enhanced content
                    self.save_content_to_file(filename, enhanced_content)
                    time.sleep(2)  # Rate limiting

                except Exception as e:
                    print(f"❌ Error enhancing {filename}: {e}")
                    # Save basic content as fallback
                    self.save_content_to_file(filename, basic_content[filename])

        print(f"\n🎉 Enhanced course creation completed!")
        print(f"📁 All files saved in: {self.course_directory}")
        print(f"📚 Total modules created: {len(course_structure.get('modules', []))}")
        print(f"🖼️ Total images collected: {total_images}")
        print(f"🎬 Total videos collected: {total_videos}")

        # List all created files
        print("\n📋 Created files:")
        for file in sorted(self.course_directory.glob("*.md")):
            print(f"  - {file.name}")

    def create_default_keywords(self, course_structure: Dict) -> Dict:
        """Create default keywords if generation fails"""
        keywords_data = {"modules": []}

        for module in course_structure.get('modules', []):
            title = module.get('title', '')
            keywords_data["modules"].append({
                "filename": module.get('filename', ''),
                "image_keywords": [f"{title} tutorial", f"{title} guide", f"{title} example"],
                "video_keywords": [f"{title} tutorial", f"{title} explanation", f"{title} demo"]
            })

        return keywords_data

# Main execution function
def create_enhanced_course(course_topic: str, images_per_module: int = 1, videos_per_module: int = 1):
    """Main function to create an enhanced course with media"""

    print("🎓 Enhanced CrewAI Course Creation System")
    print("=" * 60)
    print(f"📖 Course Topic: {course_topic}")
    print(f"🖼️ Images per module: {images_per_module}")
    print(f"🎬 Videos per module: {videos_per_module}")
    print("=" * 60)

    # Initialize system
    system = EnhancedCourseCreationSystem(images_per_module, videos_per_module)

    # Run enhanced course creation
    system.run_enhanced_course_creation(course_topic)

    return system.course_directory

# Example usage
if __name__ == "__main__":
    # Get course topic from user
    course_topic = input("Enter the course topic: ")

    # Optional: Customize media counts
    images_per_module = 1
    videos_per_module = 1

    # Create the enhanced course
    course_directory = create_enhanced_course(course_topic, images_per_module, videos_per_module)

    print(f"\n✨ Enhanced course creation completed!")
    print(f"📂 Check your course files in: {course_directory}")

# For Google Colab, you can also run directly:
# create_enhanced_course("Python Programming for Beginners", 3, 3)