from pydantic import BaseModel
from typing import Optional
class UsuarioBase(BaseModel):
    nombre: str
    email: str
    contraseña: str
    rol: str

class UsuarioCreate(UsuarioBase):
    pass
class UsuarioRead(UsuarioBase):
    id: int

    class Config:
        orm_mode = True
class UsuarioUpdate(BaseModel):
    nombre: Optional[str]
    email: Optional[str]
    contraseña: Optional[str]
    rol: Optional[str]