from pydantic import BaseModel
from typing import Optional

class proveedorBase(BaseModel):
    nombre_empresa:str
    correo: str
    telefono: str

class proveedorCreate(proveedorBase):
    pass
class proveedorRead(proveedorBase):
    id: int
    
    class confing:
        orm_mode=True
class proveedorUpdate(BaseModel):
    nombre_empresa: Optional[str]=None
    correo:Optional[str]=None
    telefono: Optional[str]=None  