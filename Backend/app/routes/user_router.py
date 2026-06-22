from fastapi import APIRouter, Depends, HTTPException,status,File, UploadFile, Form
from app.db.database import get_db, engine
from app.models.user_model import User,UserRead,UserSchema
from app.routes.auth_router import get_current_active_user;
from sqlalchemy.orm import Session
from pathlib import *
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
IMAGEDIR = BASE_DIR / "uploads" / "images"
IMAGEDIR.mkdir(parents=True, exist_ok=True)

user_router = APIRouter()

@user_router.get("/pcplus/api/my_profile", response_model=UserRead)
async def get_user(current_user: User= Depends(get_current_active_user)):
    user = UserRead(user_name=current_user.user_name, user_email = current_user.user_email, user_role=current_user.user_role)
    return user

@user_router.get("/pcplus/api/me", response_model=UserRead)
def read_own_items(current_user:  User= Depends(get_current_active_user)):
    return [{"user_email": current_user.user_email}]

@user_router.get("/pcplus/api/get_me/{user_email}", dependencies=[Depends(get_current_active_user)])
async def get_itm(user_email:str,db:Session=Depends(get_db)):
    try:
        u=db.query(User).filter(User.user_email == user_email).first()
        # print(jsonable_encoder(u))
        return (u)
    except:
        return HTTPException(status_code=422, details="Unit not found")


@user_router.put("/update_user/{user_id}", dependencies=[Depends(get_current_active_user)])
async def update(user_id:int, user:UserSchema, file: UploadFile, db:Session=Depends(get_db)):
    try:
        u=db.query(User).filter(User.id==user_id).first()
        u.user_img=file.filename,
        # u.user_name=user.user_name,
        # u.user_email=user.user_email,
        # u.user_phone=user.user_phone,
        # print(jsonable_encoder(u))
        db.add(u)
        db.commit()
        return {"Message":"Successfully Update"}
    except:
        return HTTPException(status_code=404,detail="Update Uncessfull")
    
@user_router.put("/file_upload/{user_id}", dependencies=[Depends(get_current_active_user)])
async def create_upload_files(user_id:int, user_img: UploadFile = File(...), db:Session=Depends(get_db)):
        u=db.query(User).filter(User.id==user_id).first()
        u.user_img=user_img.filename,
        # u.user_name=form.user_name,
        # u.user_email=form.user_email,

        content = await user_img.read()
        # print(user_img)
        with open(f"{IMAGEDIR}/{user_img.filename}","wb") as f:
            f.write(content)

        db.add(u)
        db.commit()
        # junit = jsonable_encoder(u)
        # return JSONResponse(content=junit)
        return {"Message":"Successfully Update"}
