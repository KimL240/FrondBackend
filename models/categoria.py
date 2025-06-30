from sqlmodel import SQLModel , Field, Relationship
from typing import Optional , List , TYPE_CHECKING

if TYPE_CHECKING:
    from models.producto import Producto

class Categoria(SQLModel, table=True):
    id : Optional[int] = Field(primary_key=True)
    nombre_categoria : str

    producto : List["Producto"] = Relationship(back_populates="categoria")
