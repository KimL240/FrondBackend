from sqlmodel import SQLModel , Field, Relationship
from typing import List , Optional , TYPE_CHECKING

if TYPE_CHECKING:
    from models.ventas import Venta

class Usuario(SQLModel, table=True):
    id : Optional[int]= Field(primary_key=True)
    nombre : str
    apellido : str
    edad : int
    correo : str

    venta: List["Venta"] = Relationship(back_populates="usuario")
