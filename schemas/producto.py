from pydantic import BaseModel
from typing import Optional
class productoBase(BaseModel):
    nombre: str
    precio: float
    categoria_id: int

class productoCreate(productoBase):
    pass

class productoRead(productoBase):
    id: int

    class config:
        orm_mode = True
class productoUpdate(BaseModel):
    nombre: Optional[str]
    precio: Optional[float]
    categoria_id: Optional[int]