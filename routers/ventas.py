from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.ventas import Venta

router = APIRouter()

@router.get("/venta/", response_model=List[Venta], summary="Obtener Ventas")
async def get_ventas(session: Session = Depends(get_session)):
    return session.exec(select(Venta)).all()

@router.get("/venta/{id_venta}", response_model=Venta, summary="Obtener Venta por ID")
async def get_venta_id(id_venta: int, session: Session = Depends(get_session)):
    venta = session.get(Venta, id_venta)
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return venta

@router.post("/venta/", response_model=Venta, summary="Crear Venta")
async def create_venta(venta: Venta, session: Session = Depends(get_session)):
    session.add(venta)
    session.commit()
    session.refresh(venta)
    return venta

@router.put("/venta/{id_venta}", response_model=Venta, summary="Actualizar Venta")
async def update_venta(id_venta: int, venta: Venta, session: Session = Depends(get_session)):
    existente = session.get(Venta, id_venta)
    if not existente:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    existente.sqlmodel_update(venta)
    session.add(existente)
    session.commit()
    session.refresh(existente)
    return existente

@router.delete("/venta/{id_venta}", status_code=204, summary="Eliminar Venta")
async def delete_venta(id_venta: int, session: Session = Depends(get_session)):
    venta = session.get(Venta, id_venta)
    if not venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    session.delete(venta)
    session.commit()