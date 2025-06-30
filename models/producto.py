from sqlmodel import SQLModel , Field , Relationship
from typing import Optional , List,TYPE_CHECKING

if TYPE_CHECKING:
    from models.categoria import Categoria
    from models.ventas import Venta

class Producto(SQLModel , table = True):

    id : Optional[int] = Field(primary_key=True)
    nombre : str

    fk_categoria : Optional[int] =  Field(foreign_key="categoria.id")
    categoria : Optional["Categoria"] = Relationship(back_populates="producto")

    precio: float 

    venta : List["Venta"] = Relationship(back_populates="producto")