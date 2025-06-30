from sqlmodel import SQLModel , Field, Relationship
from typing import  Optional , TYPE_CHECKING

if TYPE_CHECKING:
    from models.usuario import  Usuario
    from models.producto import Producto

class Venta(SQLModel, table = True):
    id : Optional[int] = Field(primary_key=True)
    fecha : str
    
    fk_usuario : Optional[int] = Field(foreign_key="usuario.id")
    usuario : Optional["Usuario"] = Relationship(back_populates="venta")

    fk_producto : Optional[int] = Field(foreign_key="producto.id")
    producto : Optional["Producto"] = Relationship(back_populates="venta")

