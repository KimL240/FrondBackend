from sqlmodel import SQLModel , Field , Relationship # importo lo necesario pa' definir modelos y relaciones
from typing import Optional , List, TYPE_CHECKING # tipos opcionales, listas y verificación para evitar líos entre archivos

# Esto ayuda a evitar errores de importación circular cuando hay relaciones entre modelos
if TYPE_CHECKING:
    from models.categoria import Categoria # categoría del producto
    from models.ventas import Venta # ventas en las que aparece el producto

# Modelo para Producto en la base de datos
class Producto(SQLModel , table = True): # table=True crea la tabla en la BD

    id : Optional[int] = Field(primary_key=True) # identificador único, opcional porque se genera solo
    nombre : str # nombre del producto

    fk_categoria : Optional[int] = Field(foreign_key="categoria.id") # el ID de la categoría a la que pertenece
    categoria : Optional["Categoria"] = Relationship(back_populates="producto") # relación con el modelo de Categoría

    precio: float # precio del producto

    venta : List["Venta"] = Relationship(back_populates="producto") # todas las ventas donde aparece este producto
