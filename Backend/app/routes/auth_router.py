from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from datetime import datetime, timedelta

from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import passlib.hash as _hash
from jose import JWTError, jwt

from app.models.user_model import (
    UserCreateSchema,
    User,
    TokenData,
    SigninRequest,
)
from app.db.database import get_db


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 200

OFFICE_VERIFY_TOKEN = "office34"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/pcplus/api/auth")

auth_router = APIRouter()


def get_user_by_email(user_email: str, db: Session):
    return db.query(User).filter(User.user_email == user_email).first()


def hash_password(password: str):
    return _hash.bcrypt.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    try:
        return _hash.bcrypt.verify(plain_password, hashed_password)
    except Exception:
        return False


def create_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


@auth_router.post("/pcplus/api/create_user")
async def create_user(
    user: UserCreateSchema,
    db: Session = Depends(get_db)
):
    if user.office_token != OFFICE_VERIFY_TOKEN:
        raise HTTPException(
            status_code=403,
            detail="Invalid office verification token"
        )

    existing_user = get_user_by_email(
        user_email=user.user_email,
        db=db
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="This user email already exists"
        )

    hashed_password = hash_password(user.user_password)

    new_user = User(
        user_name=user.user_name,
        user_phone=user.user_phone,
        user_email=user.user_email,
        user_password=hashed_password,
        confirm_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_token(
        data={"user_email": new_user.user_email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_email": new_user.user_email
    }


def authenticate_user(
    user_email: str,
    user_password: str,
    db: Session
):
    user = get_user_by_email(
        user_email=user_email,
        db=db
    )

    if not user:
        return False

    if not verify_password(user_password, user.user_password):
        return False

    return user


@auth_router.post("/pcplus/api/auth")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        user_email=form_data.username,
        user_password=form_data.password,
        db=db
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_token(
        data={"user_email": user.user_email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_email": user.user_email
    }


@auth_router.post("/pcplus/api/signin")
async def signin_for_access_token(
    signin_request: SigninRequest,
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        user_email=signin_request.user_email,
        user_password=signin_request.user_password,
        db=db
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_token(
        data={"user_email": user.user_email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "user_email": user.user_email,
        "token_type": "bearer"
    }


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email: str = payload.get("user_email")

        if email is None:
            raise credentials_exception

        token_data = TokenData(user_email=email)

    except JWTError:
        raise credentials_exception

    user = get_user_by_email(
        user_email=token_data.user_email,
        db=db
    )

    if user is None:
        raise credentials_exception

    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user is None:
        raise HTTPException(
            status_code=400,
            detail="Inactive user"
        )

    return current_user