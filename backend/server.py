from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import io
import csv
import certifi

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(
    mongo_url,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=10000
)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

class ApplicationBase(BaseModel):
    # Section 1: Personal Information
    full_name: str
    age: int
    residence: str
    email: EmailStr
    whatsapp: str
    
    # Section 1: Background & Interests
    main_field: List[str]  # checkbox - multiple selection
    main_field_other: Optional[str] = None
    has_game_project: str  # radio - yes/no/trying
    game_project_details: Optional[str] = None
    
    # Section 1: Technical Skills
    known_tools: List[str]  # checkbox - multiple selection
    known_tools_other: Optional[str] = None
    work_preference: str  # radio - solo/team/both
    time_commitment: str  # radio - fully/maybe/no
    internet_stability: str  # radio - yes/mostly/no/different
    
    # Section 2: Idea & Motivation
    has_game_idea: str  # radio - yes/no/thinking
    game_idea_details: Optional[str] = None
    join_reason: str  # textarea
    
    # Section 2: Elite Stage
    wants_elite_stage: str  # radio - yes/no/maybe
    final_notes: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class Application(ApplicationBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"  # pending, accepted, rejected

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None

# Admin credentials (simple auth)
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'sgl2025')

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    token: str
    message: str

# ============== TALKTECH BLOOM MODELS ==============

class TalkTechApplicationBase(BaseModel):
    # Section 1: Basic Info
    full_name: str
    phone: str  # WhatsApp
    email: EmailStr
    
    # Section 2: Category
    category: str  # student, graduate, working, other
    category_other: Optional[str] = None
    
    # Section 3: Tech Interests (multiple)
    tech_interests: List[str]
    tech_interests_other: Optional[str] = None
    
    # Section 4: Goal
    goal: str  # choose_path, understand_market, networking, inspiration, other
    goal_other: Optional[str] = None
    
    # Section 5: Attendance Confirmation
    confirmed_attendance: bool = False

class TalkTechApplicationCreate(TalkTechApplicationBase):
    pass

class TalkTechApplication(TalkTechApplicationBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"  # pending, accepted, rejected

class TalkTechApplicationUpdate(BaseModel):
    status: Optional[str] = None

# TalkTech Admin credentials
TALKTECH_ADMIN_USERNAME = os.environ.get('TALKTECH_ADMIN_USERNAME', 'admin')
TALKTECH_ADMIN_PASSWORD = os.environ.get('TALKTECH_ADMIN_PASSWORD', 'talktech2025')

# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Syria Gaming Lab - Cohort 2 API"}

# Submit application
@api_router.post("/applications", response_model=Application)
async def create_application(input: ApplicationCreate):
    # Check for duplicate email
    existing = await db.applications.find_one({"email": input.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="An application with this email already exists")
    
    app_obj = Application(**input.model_dump())
    doc = app_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.applications.insert_one(doc)
    return app_obj

# Admin login
@api_router.post("/admin/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin):
    if credentials.username == ADMIN_USERNAME and credentials.password == ADMIN_PASSWORD:
        # Simple token for demo (in production use JWT)
        token = f"sgl_admin_{uuid.uuid4().hex[:16]}"
        return AdminToken(token=token, message="Login successful")
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Get all applications (admin)
@api_router.get("/admin/applications", response_model=List[Application])
async def get_applications(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    query = {}
    if status and status != "all":
        query["status"] = status
    
    applications = await db.applications.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    # Filter by search if provided
    if search:
        search_lower = search.lower()
        applications = [
            app for app in applications 
            if search_lower in app.get('full_name', '').lower() 
            or search_lower in app.get('email', '').lower()
        ]
    
    # Convert timestamps
    for app in applications:
        if isinstance(app.get('created_at'), str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
    
    return applications

# Get single application
@api_router.get("/admin/applications/{app_id}", response_model=Application)
async def get_application(app_id: str):
    application = await db.applications.find_one({"id": app_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if isinstance(application.get('created_at'), str):
        application['created_at'] = datetime.fromisoformat(application['created_at'])
    
    return application

# Update application status
@api_router.patch("/admin/applications/{app_id}", response_model=Application)
async def update_application(app_id: str, update: ApplicationUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.applications.update_one(
        {"id": app_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return await get_application(app_id)

# Delete application
@api_router.delete("/admin/applications/{app_id}")
async def delete_application(app_id: str):
    result = await db.applications.delete_one({"id": app_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Application deleted successfully"}

# Export to CSV (Excel compatible)
@api_router.get("/admin/export")
async def export_applications(status: Optional[str] = Query(None)):
    query = {}
    if status and status != "all":
        query["status"] = status
    
    applications = await db.applications.find(query, {"_id": 0}).to_list(1000)
    
    # Create CSV
    output = io.StringIO()
    
    fieldnames = [
        'id', 'full_name', 'age', 'residence', 'email', 'whatsapp',
        'main_field', 'main_field_other', 'has_game_project', 'game_project_details',
        'known_tools', 'known_tools_other', 'work_preference', 'time_commitment', 'internet_stability',
        'has_game_idea', 'game_idea_details', 'join_reason',
        'wants_elite_stage', 'final_notes', 'status', 'created_at'
    ]
    
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    
    for app in applications:
        row = {}
        for field in fieldnames:
            value = app.get(field, '')
            if isinstance(value, list):
                value = ', '.join(value)
            row[field] = value
        writer.writerow(row)
    
    output.seek(0)
    
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8-sig')),  # utf-8-sig for Excel compatibility
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=applications.csv"}
    )

# Stats endpoint
@api_router.get("/admin/stats")
async def get_stats():
    total = await db.applications.count_documents({})
    pending = await db.applications.count_documents({"status": "pending"})
    accepted = await db.applications.count_documents({"status": "accepted"})
    rejected = await db.applications.count_documents({"status": "rejected"})
    
    return {
        "total": total,
        "pending": pending,
        "accepted": accepted,
        "rejected": rejected
    }

# ============== TALKTECH BLOOM ROUTES ==============

# Submit TalkTech application
@api_router.post("/talktech/applications", response_model=TalkTechApplication)
async def create_talktech_application(input: TalkTechApplicationCreate):
    # Check for duplicate email
    existing = await db.talktech_applications.find_one({"email": input.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="An application with this email already exists")
    
    app_obj = TalkTechApplication(**input.model_dump())
    doc = app_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.talktech_applications.insert_one(doc)
    return app_obj

# TalkTech Admin login
@api_router.post("/talktech/admin/login", response_model=AdminToken)
async def talktech_admin_login(credentials: AdminLogin):
    if credentials.username == TALKTECH_ADMIN_USERNAME and credentials.password == TALKTECH_ADMIN_PASSWORD:
        token = f"talktech_admin_{uuid.uuid4().hex[:16]}"
        return AdminToken(token=token, message="Login successful")
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Get all TalkTech applications (admin)
@api_router.get("/talktech/admin/applications", response_model=List[TalkTechApplication])
async def get_talktech_applications(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    query = {}
    if status and status != "all":
        query["status"] = status
    
    applications = await db.talktech_applications.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    if search:
        search_lower = search.lower()
        applications = [
            app for app in applications 
            if search_lower in app.get('full_name', '').lower() 
            or search_lower in app.get('email', '').lower()
        ]
    
    for app in applications:
        if isinstance(app.get('created_at'), str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
    
    return applications

# Get single TalkTech application
@api_router.get("/talktech/admin/applications/{app_id}", response_model=TalkTechApplication)
async def get_talktech_application(app_id: str):
    application = await db.talktech_applications.find_one({"id": app_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if isinstance(application.get('created_at'), str):
        application['created_at'] = datetime.fromisoformat(application['created_at'])
    
    return application

# Update TalkTech application status
@api_router.patch("/talktech/admin/applications/{app_id}", response_model=TalkTechApplication)
async def update_talktech_application(app_id: str, update: TalkTechApplicationUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.talktech_applications.update_one(
        {"id": app_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return await get_talktech_application(app_id)

# Delete TalkTech application
@api_router.delete("/talktech/admin/applications/{app_id}")
async def delete_talktech_application(app_id: str):
    result = await db.talktech_applications.delete_one({"id": app_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Application deleted successfully"}

# Export TalkTech to CSV
@api_router.get("/talktech/admin/export")
async def export_talktech_applications(status: Optional[str] = Query(None)):
    query = {}
    if status and status != "all":
        query["status"] = status
    
    applications = await db.talktech_applications.find(query, {"_id": 0}).to_list(1000)
    
    output = io.StringIO()
    
    fieldnames = [
        'id', 'full_name', 'phone', 'email',
        'category', 'category_other',
        'tech_interests', 'tech_interests_other',
        'goal', 'goal_other',
        'confirmed_attendance', 'status', 'created_at'
    ]
    
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    
    for app in applications:
        row = {}
        for field in fieldnames:
            value = app.get(field, '')
            if isinstance(value, list):
                value = ', '.join(value)
            row[field] = value
        writer.writerow(row)
    
    output.seek(0)
    
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8-sig')),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=talktech_applications.csv"}
    )

# TalkTech Stats endpoint
@api_router.get("/talktech/admin/stats")
async def get_talktech_stats():
    total = await db.talktech_applications.count_documents({})
    pending = await db.talktech_applications.count_documents({"status": "pending"})
    accepted = await db.talktech_applications.count_documents({"status": "accepted"})
    rejected = await db.talktech_applications.count_documents({"status": "rejected"})
    
    return {
        "total": total,
        "pending": pending,
        "accepted": accepted,
        "rejected": rejected
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
