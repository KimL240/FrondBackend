from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.producto import Producto
from schemas.producto import productoBase, productoCreate, productoRead, productoUpdate

router = APIRouter(prefix="/productos", tags=["productos"])

@router.get("/", response_model=List[productoRead])
def get_productos(session: Session = Depends(get_session)):
    productos = session.exec(select(Producto)).all()
    return productos

@router.get("/{id}", response_model=productoRead)
def get_producto(id: int, session: Session = Depends(get_session)):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="No encontrado")
    return producto

@router.post("/", response_model=productoRead, status_code=201)
def create_producto(data: productoBase, session: Session = Depends(get_session)):
    nuevo = Producto(**data.dict())
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo

@router.put("/{id}", response_model=productoRead)
def update_producto(id: int, data: productoCreate, session: Session = Depends(get_session)):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="No encontrado")
    for key, value in data.dict().items():
        setattr(producto, key, value)
    session.commit()
    session.refresh(producto)
    return producto

@router.patch("/{id}", response_model=productoRead)
def patch_producto(id: int, data: productoUpdate, session: Session = Depends(get_session)):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="No encontrado")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(producto, key, value)
    session.commit()
    session.refresh(producto)
    return producto

@router.delete("/{id}")
def delete_producto(id: int, session: Session = Depends(get_session)):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="No encontrado")
    session.delete(producto)
    session.commit()
    return {"ok": True, "mensaje": "Producto eliminado correctamente"}
