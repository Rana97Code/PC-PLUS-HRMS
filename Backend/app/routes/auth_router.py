from fastapi import APIRouter, Depends, HTTPException,status,File, UploadFile, Form
from typing import Annotated
from datetime import datetime, timedelta
from app.models.user_model import UserCreateSchema,User,TokenData,UserInDB,SigninRequest,Token, TokenJson,UserRead
from app.db.database import get_db, engine
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import passlib.hash as _hash
import bcrypt
from jose import JWTError,jwt
from fastapi.encoders import jsonable_encoder
from pathlib import *

# IMAGEDIR = Path('app/img/')
IMAGEDIR = Path('../react-ant/public/images/')


#make a secretkey it's optional
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
#make if for user ensure using @user_router.post("/token")
oath2pass = OAuth2PasswordBearer(tokenUrl="/pcplus/api/auth")


auth_router = APIRouter()

def get_user(user_email: str, db:Session=Depends(get_db)):
    if user_email in db:
        user_dict = db[user_email]
        return UserInDB(**user_dict)


#check email is exist or not
def get_user_by_email(user_email: str,db:Session=Depends(get_db)):
    return db.query(User).filter(User.user_email == user_email).first()


def create_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=55)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)
    # return dict(access_token=encoded_jwt, token_type="bearer")
    return encoded_jwt

OFFICE_VERIFY_TOKEN = "office34"

@auth_router.post("/pcplus/api/create_user")
async def create(user: UserCreateSchema, db: Session = Depends(get_db)):

    if user.office_token != OFFICE_VERIFY_TOKEN:
        raise HTTPException(
            status_code=403,
            detail="Invalid office verification token"
        )

    u_email = get_user_by_email(
        user_email=user.user_email,
        db=db
    )

    if u_email:
        raise HTTPException(
            status_code=400,
            detail="This user email already exists"
        )

    hash_password = _hash.bcrypt.hash(user.user_password)

    srv = User(
        user_name=user.user_name,
        user_phone=user.user_phone,
        user_email=user.user_email,
        user_password=hash_password,
        confirm_password=hash_password
    )

    db.add(srv)
    db.commit()
    db.refresh(srv)

    access_token_expires = timedelta(minutes=55)

    return create_token(
        {"user_email": user.user_email},
        expires_delta=access_token_expires
    )


def authenticate_user(user_email: str, user_password: str, db:Session=Depends(get_db)):

        results = db.query(User).filter(User.user_email == user_email).first()
        user = results
        if not user:
            return False
        if not user.verify_password(user_password=user_password): #there verify_password is from model
            return False
        return user



@auth_router.post("/pcplus/api/auth")
async def generate_token(form_data: OAuth2PasswordRequestForm= Depends(),  db:Session=Depends(get_db)):
    user = authenticate_user(
        user_email=form_data.username,
        user_password=form_data.password,
        db=db
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password"
        )

    access_token = create_token(
        data={"user_email": user.user_email},
        expires_delta=timedelta(minutes=200)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@auth_router.post("/pcplus/api/signin")
async def generate_token(signin_request: SigninRequest,  db:Session=Depends(get_db)):
    user = authenticate_user(signin_request.user_email, signin_request.user_password , db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=200)
    access_token = create_token( data={"user_email": user.user_email}, expires_delta=access_token_expires )
    return {"access_token": access_token, "user_email": user.user_email, "token_type": "bearer"}



# @user_router.get("/current_user")
async def get_current_user(token: Annotated[str, Depends(oath2pass)], db:Session=Depends(get_db)):
#   with Session(engine) as session:
    credentials_exception = HTTPException( status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials",
     headers={"WWW-Authenticate": "Bearer"}, )
    try:

        # payload = jwt.decode(token, SECRET_KEY, [ALGORITHM])
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("user_email")
        if email is None:
            raise credentials_exception
        token_data = TokenData(user_email=email)
        # print(token_data)
    except JWTError:
        raise HTTPException(status_code=401, detail="JWT Error.")
    result = db.query(User).filter(User.user_email==token_data.user_email).first()
    user = result
    # print(jsonable_encoder(user))
    if user is None:
        raise HTTPException(status_code=401, detail="User Error")
    return user
    # return token_data



async def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]):
    if current_user is None:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

0


 