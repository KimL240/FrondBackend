from sqlmodel import SQLModel, Session, create_engine
from fastapi import FastAPI

sql=r'fronbac.db'
url=f'sqlite:///{sql}'
engine=create_engine(url,echo=True)

def get_session():
    with Session(engine) as session:
        yield session 