from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
if TYPE_CHECKING:
    from models.producto import Producto
class categoria(SQLModel, table=True):
    id: Optional[int]= Field(default=None, primary_key=True)
    nombre: str
    unidad: str
    productos: List['Producto']=Relationship(back_populates='categoria')
