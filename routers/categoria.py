from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from  typing import List
from database import get_session
from models.categoria import categoria as Categoria
from schemas.categoria import categoriaRead, categoriaCreate, categoriaBase, categriaUpdate

router = APIRouter(prefix="/categorias", tags=["categorias"])

@router.get("/", response_model=list[categoriaRead])
def get_categorias(session: Session = Depends(get_session)):
    categorias = session.exec(select(Categoria)).all()
    return categorias

@router.post("/", response_model=categoriaRead)
def create_categoria(categoria: categoriaCreate, session: Session = Depends(get_session)):
    nuevo = Categoria(**categoria.dict())
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo

@router.put("/{id}", response_model=categoriaRead)
def update_categoria(id: int, data: categoriaCreate, session: Session = Depends(get_session)):
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(status_code=404, detail="No encontrado")
    for key, value in data.dict().items():
        setattr(categoria, key, value)
    session.commit()
    session.refresh(categoria)
    return categoria

@router.patch("/{id}", response_model=categoriaRead)
def patch_categoria(id: int, data: categriaUpdate, session: Session = Depends(get_session)):
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(status_code=404, detail="No encontrado")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(categoria, key, value)
    session.commit()
    session.refresh(categoria) 