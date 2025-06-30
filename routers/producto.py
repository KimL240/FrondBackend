from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.producto import Producto

router = APIRouter()

@router.get("/producto/", response_model=List[Producto], summary="Obtener Productos")
async def get_productos(session: Session = Depends(get_session)):
    return session.exec(select(Producto)).all()

@router.get("/producto/{id_producto}", response_model=Producto, summary="Obtener Producto por ID")
async def get_producto_id(id_producto: int, session: Session = Depends(get_session)):
    producto = session.get(Producto, id_producto)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@router.post("/producto/", response_model=Producto, summary="Crear Producto")
async def create_producto(producto: Producto, session: Session = Depends(get_session)):
    existente = session.exec(select(Producto).where(Producto.nombre == producto.nombre)).first()
    if existente:
        raise HTTPException(status_code=409, detail="El producto ya existe")
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto

@router.put("/producto/{id_producto}", response_model=Producto, summary="Actualizar Producto")
async def update_producto(id_producto: int, producto: Producto, session: Session = Depends(get_session)):
    existente = session.get(Producto, id_producto)
    if not existente:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    existente.sqlmodel_update(producto)
    session.add(existente)
    session.commit()
    session.refresh(existente)
    return existente

@router.delete("/producto/{id_producto}", status_code=204, summary="Eliminar Producto")
async def delete_producto(id_producto: int, session: Session = Depends(get_session)):
    producto = session.get(Producto, id_producto)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    session.delete(producto)
    session.commit()