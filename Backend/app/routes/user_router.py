from fastapi import APIRouter, Depends, HTTPException,status,File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from app.db.database import get_db, engine
from app.models.user_model import User,UserRead,UserSchema
from app.routes.auth_router import get_current_active_user;
from sqlalchemy.orm import Session
from pathlib import *
import os


user_router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
IMAGE_DIR = BASE_DIR / "uploads" / "images"
IMAGE_DIR.mkdir(parents=True, exist_ok=True)

@user_router.get("/pcplus/api/my_profile", response_model=UserRead)
async def get_user(current_user: User = Depends(get_current_active_user)):
    return UserRead(
        user_name=current_user.user_name,
        user_email=current_user.user_email,
        user_role=current_user.user_role or 0
    )


@user_router.get("/pcplus/api/me", response_model=UserRead)
def read_own_items(current_user: User = Depends(get_current_active_user)):
    return UserRead(
        user_name=current_user.user_name,
        user_email=current_user.user_email,
        user_role=current_user.user_role or 0
    )

@user_router.get("/pcplus/api/get_me/{user_email}", dependencies=[Depends(get_current_active_user)])
async def get_itm(user_email:str,db:Session=Depends(get_db)):
    try:
        u=db.query(User).filter(User.user_email == user_email).first()
        # print(jsonable_encoder(u))
        return (u)
    except:
        return HTTPException(status_code=422, details="Unit not found")



@user_router.put("/pcplus/api/update_user/{user_id}",
    dependencies=[Depends(get_current_active_user)]
)
async def update_user(
    user_id: int,
    user_name: str = Form(...),
    user_email: str = Form(...),
    user_phone: str = Form(...),
    user_password: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        u = db.query(User).filter(User.id == user_id).first()

        if not u:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # Update basic information
        u.user_name = user_name
        u.user_email = user_email
        u.user_phone = user_phone

        # Update password if provided
        if user_password:
            u.user_password = user_password
            u.confirm_password = user_password

        # Upload image if provided
        if file:
            file_path = IMAGE_DIR / file.filename

            content = await file.read()

            with open(file_path, "wb") as f:
                f.write(content)

            # Save filename in database
            u.user_img = file.filename

        db.commit()
        db.refresh(u)

        return {
            "message": "Successfully Updated",
            "user_id": u.id,
            "user_img": u.user_img,
            "image_url": (
                f"https://api.erp.pcplusbd.com/uploads/images/{u.user_img}"
                if u.user_img else None
            )
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Update failed: {str(e)}"
        )


@user_router.put("/pcplus/api/file_upload/{user_id}", dependencies=[Depends(get_current_active_user)])
async def upload_user_image(
    user_id: int,
    user_img: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    file_ext = Path(user_img.filename).suffix
    file_name = f"user_{user_id}_{int(time.time())}{file_ext}"

    file_path = UPLOAD_DIR / file_name

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(user_img.file, buffer)

    user.user_img = file_name

    db.commit()
    db.refresh(user)

    return {
        "message": "Successfully uploaded",
        "filename": file_name,
        "image_url": f"/uploads/images/{file_name}"
    }