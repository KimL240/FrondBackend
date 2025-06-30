from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.categoria import Categoria

router = APIRouter()

@router.get("/categoria/", response_model=List[Categoria], summary="Obtener Categorías")
async def get_categorias(session: Session = Depends(get_session)):
    return session.exec(select(Categoria)).all()

@router.get("/categoria/{id_categoria}", response_model=Categoria, summary="Obtener Categoría por ID")
async def get_categoria_id(id_categoria: int, session: Session = Depends(get_session)):
    categoria = session.get(Categoria, id_categoria)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

@router.post("/categoria/", response_model=Categoria, summary="Crear Categoría")
async def create_categoria(categoria: Categoria, session: Session = Depends(get_session)):
    existente = session.exec(select(Categoria).where(Categoria.nombre_categoria == categoria.nombre_categoria)).first()
    if existente:
        raise HTTPException(status_code=409, detail="La categoría ya existe")
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria

@router.put("/categoria/{id_categoria}", response_model=Categoria, summary="Actualizar Categoría")
async def update_categoria(id_categoria: int, categoria: Categoria, session: Session = Depends(get_session)):
    existente = session.get(Categoria, id_categoria)
    if not existente:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    existente.sqlmodel_update(categoria)
    session.add(existente)
    session.commit()
    session.refresh(existente)
    return existente

@router.delete("/categoria/{id_categoria}", status_code=204, summary="Eliminar Categoría")
async def delete_categoria(id_categoria: int, session: Session = Depends(get_session)):
    categoria = session.get(Categoria, id_categoria)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    session.delete(categoria)
    session.commit()