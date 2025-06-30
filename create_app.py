from fastapi import FastAPI
from sqlmodel import SQLModel
from database import engine
from fastapi.middleware.cors import CORSMiddleware
from routers.ventas import router as router_ventas
from routers.categoria import router as router_categoria
from routers.producto import router  as router_producto
from routers.proveedor import router as router_proveedor
from routers.usuario import router as router_usuario

def create_app():
    app = FastAPI()
    SQLModel.metadata.create_all(bind=engine)
    app.include_router(router_ventas)
    app.include_router(router_categoria)
    app.include_router(router_producto)
    app.include_router(router_proveedor)
    app.include_router(router_usuario)
    
    origins =[
        'http://localhost',
        'http://localhost:8000',
        'http://127.0.0.1:5500',
    ]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )
    
    return app