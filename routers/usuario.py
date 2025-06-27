from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models.usurario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioRead, UsuarioUpdate

router = APIRouter()

@router.get("/", response_model=list[UsuarioRead])
def get_usuarios(session: Session = Depends(get_session)):
    return session.exec(select(Usuario)).all()

@router.get("/{id}", response_model=UsuarioRead)
def get_usuario(id: int, session: Session = Depends(get_session)):
    usuario = session.get(Usuario, id)
    if not usuario:
        raise HTTPException(status_code=404, detail="No encontrado")
    return usuario

@router.post("/", response_model=UsuarioRead)
def create_usuario(usuario: UsuarioCreate, session: Session = Depends(get_session)):
    nuevo = Usuario(**usuario.dict())
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo

@router.put("/{id}", response_model=UsuarioRead)
def update_usuario(id: int, data: UsuarioCreate, session: Session = Depends(get_session)):
    usuario = session.get(Usuario, id)
    if not usuario:
        raise HTTPException(status_code=404, detail="No encontrado")
    for key, value in data.dict().items():
        setattr(usuario, key, value)
    session.commit()
    return usuario

@router.patch("/{id}", response_model=UsuarioRead)
def patch_usuario(id: int, data: UsuarioUpdate, session: Session = Depends(get_session)):
    usuario = session.get(Usuario, id)
    if not usuario:
        raise HTTPException(status_code=404, detail="No encontrado")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(usuario, key, value)
    session.commit()
    return usuario

@router.delete("/{id}")
def delete_usuario(id: int, session: Session = Depends(get_session)):
    usuario = session.get(Usuario, id)
    if not usuario:
        raise HTTPException(status_code=404, detail="No encontrado")
    session.delete(usuario)
    session.commit()
    return {"ok": True}
