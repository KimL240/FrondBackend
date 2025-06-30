from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.usuario import Usuario

router = APIRouter()

@router.get("/usuario/", response_model=List[Usuario], summary="Obtener Usuarios")
async def get_usuarios(session: Session = Depends(get_session)):
    return session.exec(select(Usuario)).all()

@router.get("/usuario/{id_usuario}", response_model=Usuario, summary="Obtener Usuario por ID")
async def get_usuario_id(id_usuario: int, session: Session = Depends(get_session)):
    usuario = session.get(Usuario, id_usuario)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.post("/usuario/", response_model=Usuario, summary="Crear Usuario")
async def create_usuario(usuario: Usuario, session: Session = Depends(get_session)):
    existente = session.exec(select(Usuario).where(Usuario.correo == usuario.correo)).first()
    if existente:
        raise HTTPException(status_code=409, detail="El usuario ya existe")
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    return usuario

@router.put("/usuario/{id_usuario}", response_model=Usuario, summary="Actualizar Usuario")
async def update_usuario(id_usuario: int, usuario: Usuario, session: Session = Depends(get_session)):
    existente = session.get(Usuario, id_usuario)
    if not existente:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    existente.sqlmodel_update(usuario)
    session.add(existente)
    session.commit()
    session.refresh(existente)
    return existente

@router.delete("/usuario/{id_usuario}", status_code=204, summary="Eliminar Usuario")
async def delete_usuario(id_usuario: int, session: Session = Depends(get_session)):
    usuario = session.get(Usuario, id_usuario)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    session.delete(usuario)
    session.commit()