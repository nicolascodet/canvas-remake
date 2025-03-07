from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Canvas Student API")

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Course(BaseModel):
    id: str
    code: str
    name: str
    color: Optional[str] = None
    section: Optional[str] = None
    term: Optional[str] = None
    description: Optional[str] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Assignment(BaseModel):
    id: str
    course_id: str
    title: str
    due_date: datetime
    points: Optional[int] = None
    status: Optional[str] = None  # "graded", "submitted", "not submitted"
    description: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Event(BaseModel):
    id: str
    title: str
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    course_id: Optional[str] = None
    description: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Announcement(BaseModel):
    id: str
    source: str
    title: str
    content: str
    date: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class DiscussionPost(BaseModel):
    id: str
    course_id: str
    title: str
    content: str
    author: str
    created_at: datetime
    replies_count: int = 0
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class DiscussionReply(BaseModel):
    id: str
    post_id: str
    content: str
    author: str
    created_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_option: int
    points: int = 1

class Quiz(BaseModel):
    id: str
    course_id: str
    title: str
    description: Optional[str] = None
    due_date: datetime
    time_limit_minutes: Optional[int] = None
    questions: List[QuizQuestion]
    total_points: int
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class QuizSubmission(BaseModel):
    quiz_id: str
    student_id: str
    answers: List[int]
    score: Optional[float] = None
    submitted_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Sample data with funny content
sample_courses = [
    Course(
        id="MEME-420",
        code="MEME-420",
        name="Advanced Memeology",
        color="#4682b4",
        section="Section 69",
        term="Spring 2025",
        description="A comprehensive study of internet culture, focusing on the evolution of memes from Doge to modern TikTok trends."
    ),
    Course(
        id="NAPS-303",
        code="NAPS-303",
        name="Strategic Napping Techniques",
        color="#32cd32",
        section="Section ZZZ",
        term="Spring 2025",
        description="Master the art of sleeping through meetings while appearing attentive. Special focus on Zoom camera angles."
    ),
    Course(
        id="PROCR-101",
        code="PROCR-101",
        name="Professional Netflix Binging",
        color="#6a5acd",
        section="Section 404",
        term="Spring 2025",
        description="Learn to optimize your streaming schedule while maintaining the illusion of productivity."
    ),
    Course(
        id="PIZZA-505",
        code="PIZZA-505",
        name="Advanced Pizza Studies",
        color="#dc143c",
        section="Section NOM",
        term="Spring 2025",
        description="Explore the controversial topics in pizza culture, including the ongoing pineapple debate and optimal crust thickness."
    )
]

sample_assignments = [
    Assignment(
        id="hw1",
        course_id="PROCR-101",
        title="Binge Watch Entire Series of The Office",
        due_date=datetime.now() + timedelta(days=1),
        points=69,
        status="not submitted",
        description="Watch all seasons of The Office and analyze the evolution of Michael Scott's management style."
    ),
    Assignment(
        id="hw2",
        course_id="MEME-420",
        title="Create a Viral Cat Meme Portfolio",
        due_date=datetime.now() + timedelta(hours=4),
        points=42,
        status="graded",
        description="Curate and analyze a collection of cat memes. Bonus points for including Grumpy Cat references."
    ),
    Assignment(
        id="hw4",
        course_id="NAPS-303",
        title="Perfect the Art of Looking Awake in Zoom Meetings",
        due_date=datetime.now() + timedelta(days=2),
        points=50,
        status="not submitted",
        description="Develop and demonstrate techniques for appearing alert while actually sleeping during virtual meetings."
    ),
    Assignment(
        id="hw6",
        course_id="PIZZA-505",
        title="Debate: Pineapple on Pizza Ethics",
        due_date=datetime.now() + timedelta(hours=6),
        points=75,
        status="submitted",
        description="Present a scholarly argument for or against pineapple as a pizza topping. Citations required."
    )
]

sample_events = [
    Event(
        id="event1",
        title="Emergency Meme Review",
        start_time=datetime.now() + timedelta(days=1, hours=2),
        end_time=datetime.now() + timedelta(days=1, hours=4),
        location="Virtual Meme Lab",
        course_id="MEME-420",
        description="Urgent analysis of viral cat videos. Bring your best reaction GIFs."
    ),
    Event(
        id="event2",
        title="Advanced Napping Workshop",
        start_time=datetime.now() + timedelta(days=2),
        end_time=datetime.now() + timedelta(days=2, hours=3),
        location="Comfy Couch Auditorium",
        course_id="NAPS-303",
        description="Learn to perfect the art of sleeping with your eyes open during Zoom calls."
    ),
    Event(
        id="event3",
        title="Pizza vs Pineapple Debate",
        start_time=datetime.now() + timedelta(days=3),
        end_time=datetime.now() + timedelta(days=3, hours=2),
        location="Virtual Pizza Kitchen",
        course_id="PIZZA-505",
        description="A heated debate on the controversial topic of pineapple on pizza. Snacks provided (no pineapples allowed)."
    ),
    Event(
        id="event4",
        title="Netflix Marathon Training",
        start_time=datetime.now() + timedelta(days=4),
        end_time=datetime.now() + timedelta(days=4, hours=8),
        location="Your Favorite Couch",
        course_id="PROCR-101",
        description="Endurance training for binge-watching. BYOS (Bring Your Own Snacks)."
    )
]

sample_announcements = [
    Announcement(
        id="ann1",
        source="DEPARTMENT OF MEMEOLOGY",
        title="URGENT: New Meme Format Just Dropped",
        content="Students are required to study the latest viral cat meme for tomorrow's surprise meme quiz. Extra credit for anyone who can make their professor laugh with a SpongeBob reference.",
        date=datetime.now() - timedelta(hours=2)
    ),
    Announcement(
        id="ann2",
        source="PROCRASTINATION STUDIES",
        title="Deadline Extension Workshop: How to Ask for More Time",
        content="Join us for an interactive workshop on crafting the perfect 'my dog ate my homework' email. Guest speaker: That one student who's never turned anything in on time but somehow has an A.",
        date=datetime.now() - timedelta(hours=1)
    ),
    Announcement(
        id="ann3",
        source="CRAFT BEER STUDIES",
        title="Important: Beer Tasting Lab Rescheduled",
        content="Due to the professor's unexpected hangover, today's beer tasting lab will be moved to tomorrow. Remember to bring your designated driver permission slips.",
        date=datetime.now() - timedelta(minutes=30)
    )
]

# Add sample discussions
sample_discussions = [
    # Memeology Discussions
    DiscussionPost(
        id="disc1",
        course_id="MEME-420",
        title="The Philosophy of Doge",
        content="Much discuss, very academic. What makes a meme truly timeless? Let's analyze the staying power of Doge.",
        author="Meme Scholar",
        created_at=datetime.now() - timedelta(days=2),
        replies_count=2
    ),
    DiscussionPost(
        id="disc2",
        course_id="MEME-420",
        title="Evolution of SpongeBob Memes",
        content="From 'Imagination' to 'Mocking SpongeBob', let's trace the evolution of SpongeBob's impact on meme culture.",
        author="Bikini Bottom Researcher",
        created_at=datetime.now() - timedelta(days=1),
        replies_count=1
    ),
    DiscussionPost(
        id="disc3",
        course_id="MEME-420",
        title="Cat Memes: A Scientific Classification",
        content="Proposing a new taxonomy for categorizing cat memes. From Grumpy Cat to Keyboard Cat, where do they all fit?",
        author="Feline Memeologist",
        created_at=datetime.now() - timedelta(hours=5),
        replies_count=4
    ),
    
    # Napping Discussions
    DiscussionPost(
        id="disc4",
        course_id="NAPS-303",
        title="Best Positions for Zoom Naps",
        content="Share your tried and tested positions for looking engaged while actually sleeping.",
        author="Professional Napper",
        created_at=datetime.now() - timedelta(days=1),
        replies_count=3
    ),
    DiscussionPost(
        id="disc5",
        course_id="NAPS-303",
        title="Advanced Camera Angle Techniques",
        content="How to position your camera to maximize nap potential while maintaining the illusion of attention.",
        author="Zoom Master",
        created_at=datetime.now() - timedelta(hours=8),
        replies_count=2
    ),
    
    # Netflix Binging Discussions
    DiscussionPost(
        id="disc6",
        course_id="PROCR-101",
        title="Optimal Snack Placement for Marathon Sessions",
        content="Strategic snack positioning can make or break a binge session. Let's discuss optimal layouts.",
        author="Snack Strategist",
        created_at=datetime.now() - timedelta(hours=12),
        replies_count=5
    ),
    DiscussionPost(
        id="disc7",
        course_id="PROCR-101",
        title="The Psychology of 'One More Episode'",
        content="Analyzing the cognitive mechanisms behind the 'just one more episode' phenomenon.",
        author="Binge Psychologist",
        created_at=datetime.now() - timedelta(hours=3),
        replies_count=2
    ),
    
    # Pizza Studies Discussions
    DiscussionPost(
        id="disc8",
        course_id="PIZZA-505",
        title="Pineapple on Pizza: A Scientific Analysis",
        content="Let's settle this debate once and for all with empirical evidence.",
        author="Pizza Scientist",
        created_at=datetime.now() - timedelta(hours=12),
        replies_count=1
    ),
    DiscussionPost(
        id="disc9",
        course_id="PIZZA-505",
        title="The Perfect Crust-to-Sauce Ratio",
        content="A mathematical approach to optimizing the fundamental pizza equation.",
        author="Pizza Mathematician",
        created_at=datetime.now() - timedelta(hours=6),
        replies_count=3
    )
]

# Add sample discussion replies
sample_discussion_replies = [
    # Memeology Replies
    DiscussionReply(
        id="reply1",
        post_id="disc1",
        content="Wow, such insight, very academic!",
        author="Doge Fan",
        created_at=datetime.now() - timedelta(days=1)
    ),
    DiscussionReply(
        id="reply2",
        post_id="disc1",
        content="I believe the key to Doge's longevity lies in its versatility.",
        author="Meme Historian",
        created_at=datetime.now() - timedelta(hours=12)
    ),
    DiscussionReply(
        id="reply3",
        post_id="disc2",
        content="The transition from reaction images to meta-commentary was fascinating.",
        author="Meme Anthropologist",
        created_at=datetime.now() - timedelta(hours=6)
    ),
    
    # Napping Replies
    DiscussionReply(
        id="reply4",
        post_id="disc4",
        content="The classic 'thoughtful nodding while sleeping' technique never fails.",
        author="Sleep Expert",
        created_at=datetime.now() - timedelta(hours=6)
    ),
    DiscussionReply(
        id="reply5",
        post_id="disc5",
        content="Pro tip: Slightly tilted camera angle suggests deep contemplation.",
        author="Nap Architect",
        created_at=datetime.now() - timedelta(hours=2)
    ),
    
    # Netflix Replies
    DiscussionReply(
        id="reply6",
        post_id="disc6",
        content="The 'snack radius' theory changed my binging game completely!",
        author="Couch Potato PhD",
        created_at=datetime.now() - timedelta(hours=4)
    ),
    
    # Pizza Replies
    DiscussionReply(
        id="reply7",
        post_id="disc8",
        content="Your control group needs a blind taste test to be valid.",
        author="Statistical Pizza Expert",
        created_at=datetime.now() - timedelta(hours=3)
    )
]

# Add sample quizzes
sample_quizzes = [
    # Memeology Quizzes
    Quiz(
        id="quiz1",
        course_id="MEME-420",
        title="Meme History 101",
        description="Test your knowledge of classic memes",
        due_date=datetime.now() + timedelta(days=7),
        time_limit_minutes=30,
        questions=[
            QuizQuestion(
                id="q1",
                question="What year did the 'Doge' meme first appear?",
                options=["2010", "2013", "2015", "2017"],
                correct_option=1,
                points=5
            ),
            QuizQuestion(
                id="q2",
                question="Which platform popularized 'Rickrolling'?",
                options=["4chan", "Reddit", "YouTube", "MySpace"],
                correct_option=0,
                points=5
            ),
            QuizQuestion(
                id="q3",
                question="Who was the original 'Grumpy Cat'?",
                options=["Tardar Sauce", "Colonel Meow", "Lil Bub", "Maru"],
                correct_option=0,
                points=5
            )
        ],
        total_points=15
    ),
    Quiz(
        id="quiz2",
        course_id="MEME-420",
        title="Advanced Meme Analysis",
        description="Demonstrate your understanding of complex meme evolution",
        due_date=datetime.now() + timedelta(days=14),
        time_limit_minutes=45,
        questions=[
            QuizQuestion(
                id="q4",
                question="Which factor most influences a meme's longevity?",
                options=["Versatility", "Initial popularity", "Platform of origin", "Creator fame"],
                correct_option=0,
                points=10
            ),
            QuizQuestion(
                id="q5",
                question="What makes a crossover meme successful?",
                options=[
                    "Compatible contexts",
                    "Similar popularity levels",
                    "Same platform origin",
                    "Matching color schemes"
                ],
                correct_option=0,
                points=10
            )
        ],
        total_points=20
    ),
    
    # Napping Quizzes
    Quiz(
        id="quiz3",
        course_id="NAPS-303",
        title="Advanced Napping Techniques",
        description="Prove your mastery of strategic napping",
        due_date=datetime.now() + timedelta(days=3),
        time_limit_minutes=20,
        questions=[
            QuizQuestion(
                id="q6",
                question="What's the optimal nap duration for maximum productivity?",
                options=["10 minutes", "20 minutes", "30 minutes", "2 hours"],
                correct_option=1,
                points=10
            ),
            QuizQuestion(
                id="q7",
                question="Best position for appearing attentive during video calls?",
                options=[
                    "Chin resting on hand",
                    "Leaning back thoughtfully",
                    "Constant nodding",
                    "Frequent position changes"
                ],
                correct_option=0,
                points=10
            )
        ],
        total_points=20
    ),
    
    # Netflix Binging Quizzes
    Quiz(
        id="quiz4",
        course_id="PROCR-101",
        title="Binge-Watching Fundamentals",
        description="Essential knowledge for professional streaming",
        due_date=datetime.now() + timedelta(days=5),
        time_limit_minutes=25,
        questions=[
            QuizQuestion(
                id="q8",
                question="Optimal break duration between episodes?",
                options=["No breaks", "2 minutes", "5 minutes", "15 minutes"],
                correct_option=1,
                points=5
            ),
            QuizQuestion(
                id="q9",
                question="Best snack for minimal keyboard mess?",
                options=["Popcorn", "Chips", "Chocolate", "Fruit slices"],
                correct_option=3,
                points=5
            )
        ],
        total_points=10
    ),
    
    # Pizza Studies Quizzes
    Quiz(
        id="quiz5",
        course_id="PIZZA-505",
        title="Pizza Theory Fundamentals",
        description="Test your knowledge of pizza science",
        due_date=datetime.now() + timedelta(days=5),
        time_limit_minutes=45,
        questions=[
            QuizQuestion(
                id="q10",
                question="What is the ideal pizza crust thickness?",
                options=["Thin as paper", "Medium", "Thick", "Chicago deep dish"],
                correct_option=1,
                points=5
            ),
            QuizQuestion(
                id="q11",
                question="At what temperature should pizza be baked?",
                options=["350°F", "450°F", "650°F", "800°F"],
                correct_option=2,
                points=5
            ),
            QuizQuestion(
                id="q12",
                question="Most controversial pizza topping historically?",
                options=["Pineapple", "Anchovies", "Chocolate", "Eggs"],
                correct_option=0,
                points=5
            )
        ],
        total_points=15
    )
]

# Routes
@app.get("/")
async def root():
    return {"message": "Canvas Student API is running"}

@app.get("/courses", response_model=List[Course])
async def get_courses():
    return sample_courses

@app.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: str):
    for course in sample_courses:
        if course.id == course_id:
            return course
    raise HTTPException(status_code=404, detail="Course not found")

@app.get("/assignments", response_model=List[Assignment])
async def get_assignments():
    return sample_assignments

@app.get("/assignments/{assignment_id}", response_model=Assignment)
async def get_assignment(assignment_id: str):
    for assignment in sample_assignments:
        if assignment.id == assignment_id:
            return assignment
    raise HTTPException(status_code=404, detail="Assignment not found")

@app.get("/events", response_model=List[Event])
async def get_events():
    return sample_events

@app.get("/announcements", response_model=List[Announcement])
async def get_announcements():
    return sample_announcements

@app.get("/dashboard")
async def get_dashboard():
    # Group items by date for the dashboard
    today = datetime.now()
    
    # Organize events and assignments by date
    dashboard = {
        "courses": sample_courses,
        "upcoming": []
    }
    
    # Add assignments to upcoming items
    for assignment in sample_assignments:
        dashboard["upcoming"].append({
            "type": "assignment",
            "id": assignment.id,
            "course_id": assignment.course_id,
            "title": assignment.title,
            "due_date": assignment.due_date.isoformat(),
            "points": assignment.points,
            "status": assignment.status
        })
        
    # Add events to upcoming items
    for event in sample_events:
        dashboard["upcoming"].append({
            "type": "event",
            "id": event.id,
            "title": event.title,
            "start_time": event.start_time.isoformat(),
            "end_time": event.end_time.isoformat(),
            "location": event.location,
            "course_id": event.course_id
        })
        
    # Add announcements to upcoming items
    for announcement in sample_announcements:
        dashboard["upcoming"].append({
            "type": "announcement",
            "id": announcement.id,
            "source": announcement.source,
            "title": announcement.title,
            "content": announcement.content,
            "date": announcement.date.isoformat()
        })
    
    # Sort all upcoming items by date
    dashboard["upcoming"] = sorted(
        dashboard["upcoming"],
        key=lambda x: x.get("date") or x.get("due_date") or x.get("start_time")
    )
    
    return dashboard

@app.get("/courses/{course_id}/discussions", response_model=List[DiscussionPost])
async def get_course_discussions(course_id: str):
    discussions = [d for d in sample_discussions if d.course_id == course_id]
    return discussions

@app.get("/discussions/{post_id}/replies", response_model=List[DiscussionReply])
async def get_discussion_replies(post_id: str):
    replies = [r for r in sample_discussion_replies if r.post_id == post_id]
    return replies

@app.post("/courses/{course_id}/discussions", response_model=DiscussionPost)
async def create_discussion(course_id: str, title: str, content: str):
    new_post = DiscussionPost(
        id=f"disc{len(sample_discussions) + 1}",
        course_id=course_id,
        title=title,
        content=content,
        author="Current User",  # In a real app, this would come from auth
        created_at=datetime.now(),
        replies_count=0
    )
    sample_discussions.append(new_post)
    return new_post

@app.post("/discussions/{post_id}/replies", response_model=DiscussionReply)
async def create_reply(post_id: str, content: str):
    new_reply = DiscussionReply(
        id=f"reply{len(sample_discussion_replies) + 1}",
        post_id=post_id,
        content=content,
        author="Current User",  # In a real app, this would come from auth
        created_at=datetime.now()
    )
    sample_discussion_replies.append(new_reply)
    
    # Update reply count
    for post in sample_discussions:
        if post.id == post_id:
            post.replies_count += 1
            break
            
    return new_reply

@app.get("/courses/{course_id}/quizzes", response_model=List[Quiz])
async def get_course_quizzes(course_id: str):
    quizzes = [q for q in sample_quizzes if q.course_id == course_id]
    return quizzes

@app.get("/quizzes/{quiz_id}", response_model=Quiz)
async def get_quiz(quiz_id: str):
    for quiz in sample_quizzes:
        if quiz.id == quiz_id:
            return quiz
    raise HTTPException(status_code=404, detail="Quiz not found")

@app.post("/quizzes/{quiz_id}/submit", response_model=QuizSubmission)
async def submit_quiz(quiz_id: str, answers: List[int]):
    quiz = next((q for q in sample_quizzes if q.id == quiz_id), None)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    if len(answers) != len(quiz.questions):
        raise HTTPException(status_code=400, detail="Invalid number of answers")
        
    # Calculate score
    correct_answers = sum(1 for i, answer in enumerate(answers) 
                        if answer == quiz.questions[i].correct_option)
    score = (correct_answers / len(quiz.questions)) * quiz.total_points
    
    submission = QuizSubmission(
        quiz_id=quiz_id,
        student_id="current_user",  # In a real app, this would come from auth
        answers=answers,
        score=score,
        submitted_at=datetime.now()
    )
    
    return submission

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 