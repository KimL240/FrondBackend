from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_session
from models.proveedor import proveedores
from schemas.proveedor import proveedorBase, proveedorCreate, proveedorRead, proveedorUpdate

router= APIRouter(prefix='/proveedores', tags=['proveedores'])

@router.get('/', response_model=List[proveedorRead])
def get_proveedores(session:Session=Depends(get_session)):
    proveedores=session.exe(select(proveedores)).all()
    
@router.get('/{id}', response_model=proveedorRead)
def get_proveedores(id: int, session: Session=Depends(get_session)):
    proveedores= session.get(proveedores, id)
    if not proveedores:
        raise HTTPException(status_code=404, detail='No encontrado')
    return proveedores

@router.post('/', response_model=proveedorRead, status_code=201)
def create_producto(data:proveedorBase, session: Session=Depends(get_session)):
    nuevo=proveedores(**data.dict())
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo

@router.put('/{id}', response_model=proveedorRead)
def update_proveedores(id: int, data: proveedorCreate, session: Session=Depends(get_session)):
    proveedores=session.get(proveedores, id)
    if not proveedores:
        raise HTTPException(status_code=404, detail='No encontrado')
    for key, value in data.dict().items():
        setattr(proveedores, key, value)
    session.commit()
    session.refresh(proveedores)
    return proveedores

@router.patch('/{id}', response_model=proveedorRead)
def patch_proveedores(id: int, data: proveedorUpdate, session: Session=Depends(get_session)):
    proveedores= session.get(proveedores, id)
    if not proveedores:
        raise HTTPException(status_code=404, detail='No encontrado')
    for key, value in data.dict(exclude_unset=True).items():
        setattr(proveedores, key, value)
    session.commit()
    session.refresh(proveedores)
    return proveedores

@router.delete('/{id}')
def delete_proveedores(id: int, session: Session=Depends(get_session)):
    proveedores=session.get(proveedores, id)
    if not proveedores:
        raise HTTPException(status_code=404, detail='No encontrado')
    session.delete(proveedores)
    session.commit()
    return {'ok': True, 'Mensaje':'proveedor eliminado correctamente'}