from pydantic import BaseModel
from typing import Optional

class ventasBase(BaseModel):
    fecha: str
    Usuario_id: int
    Producto_id: int
class ventasCreate(ventasBase):
    pass
class ventasRead(ventasBase):
    id: int
    class confing:
        orm_mode=True
class ventasUpdate(BaseModel):
    fecha: Optional[str]=None
    Usuario_id: int
    Producto_id: int