from fastapi import APIRouter, Depends, HTTPException,status,File, UploadFile, Form
from app.db.database import get_db, engine
from app.models.user_model import User,UserRead,UserSchema
from app.routes.auth_router import get_current_active_user;
from sqlalchemy.orm import Session
from pathlib import *
import os

IMAGEDIR = Path('../Frontend/public/assets/images/users')

user_router = APIRouter()


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



@user_router.put("/pcplus/api/update_user/{user_id}", dependencies=[Depends(get_current_active_user)])
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
            raise HTTPException(status_code=404, detail="User not found")

        u.user_name = user_name
        u.user_email = user_email
        u.user_phone = user_phone

        if user_password:
            u.user_password = user_password
            u.confirm_password = user_password

        if file:
            u.user_img = file.filename

            content = await file.read()
            with open(f"{IMAGEDIR}/{file.filename}", "wb") as f:
                f.write(content)

        db.commit()
        db.refresh(u)

        return {"message": "Successfully Updated"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Update failed: {str(e)}")
    
@user_router.put("/pcplus/api/file_upload/{user_id}", dependencies=[Depends(get_current_active_user)])
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
