from pydantic import BaseModel
from typing import Optional
class categoriaBase(BaseModel):
    nombre: str 
    unidad: str

class categoriaCreate(categoriaBase):
    pass
class categoriaRead(categoriaBase):
    id: int

    class confing:
        orm_mode=True
class categriaUpdate(BaseModel):
    nombre: Optional[str] = None
    unidad: Optional[str] = None