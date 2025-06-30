from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.proveedor import proveedores

router = APIRouter()

@router.get("/proveedor/", response_model=List[proveedores], summary="Obtener Proveedores")
async def get_proveedores(session: Session = Depends(get_session)):
    return session.exec(select(proveedores)).all()

@router.get("/proveedor/{id_proveedor}", response_model=proveedores, summary="Obtener Proveedor por ID")
async def get_proveedor_id(id_proveedor: int, session: Session = Depends(get_session)):
    proveedor = session.get(proveedores, id_proveedor)
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return proveedor

@router.post("/proveedor/", response_model=proveedores, summary="Crear Proveedor")
async def create_proveedor(proveedor: proveedores, session: Session = Depends(get_session)):
    existente = session.exec(select(proveedores).where(proveedores.correo == proveedor.correo)).first()
    if existente:
        raise HTTPException(status_code=409, detail="El proveedor ya existe")
    session.add(proveedor)
    session.commit()
    session.refresh(proveedor)
    return proveedor

@router.put("/proveedor/{id_proveedor}", response_model=proveedores, summary="Actualizar Proveedor")
async def update_proveedor(id_proveedor: int, proveedor: proveedores, session: Session = Depends(get_session)):
    existente = session.get(proveedores, id_proveedor)
    if not existente:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    existente.sqlmodel_update(proveedor)
    session.add(existente)
    session.commit()
    session.refresh(existente)
    return existente

@router.delete("/proveedor/{id_proveedor}", status_code=204, summary="Eliminar Proveedor")
async def delete_proveedor(id_proveedor: int, session: Session = Depends(get_session)):
    proveedor = session.get(proveedores, id_proveedor)
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    session.delete(proveedor)
    session.commit()