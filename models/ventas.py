from sqlmodel import SQLModel , Field, Relationship # traigo lo necesario pa' armar el modelo y las relaciones
from typing import Optional , TYPE_CHECKING # tipos opcionales y chequeo para evitar errores entre modelos

# Esto se usa para ayudar con los tipos sin causar errores al importar otros modelos
if TYPE_CHECKING:
    from models.usuario import Usuario # para referenciar al usuario
    from models.producto import Producto # para referenciar al producto

# Modelo de Venta, representa cada compra registrada en el sistema
class Venta(SQLModel, table=True): # table=True pa' que se cree la tabla en la BD
    id : Optional[int] = Field(primary_key=True) # identificador único, se genera solo
    fecha : str # fecha en la que se hizo la venta

    fk_usuario : Optional[int] = Field(foreign_key="usuario.id") # ID del usuario que compró
    usuario : Optional["Usuario"] = Relationship(back_populates="venta") # relación con el modelo Usuario

    fk_producto : Optional[int] = Field(foreign_key="producto.id") # ID del producto vendido
    producto : Optional["Producto"] = Relationship(back_populates="venta") # relación con el modelo Producto
