from fastapi import FastAPI
from sqlmodel import SQLModel
from database import engine
def create_app():
    app = FastAPI()
    SQLModel.metadata.create_all(bind=engine)