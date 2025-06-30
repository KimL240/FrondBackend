from sqlmodel import SQLModel , Field, Relationship # importo lo básico para armar modelos con SQLModel
from typing import Optional , List , TYPE_CHECKING # para manejar tipos opcionales y listas

# Esto sirve pa' evitar referencias circulares cuando uso relaciones entre modelos
if TYPE_CHECKING:
    from models.producto import Producto # solo lo uso para ayudar al tipado en tiempo de desarrollo

# Modelo de Categoría para la base de datos
class Categoria(SQLModel, table=True): # table=True hace que se cree tabla con esto
    id : Optional[int] = Field(primary_key=True) # el ID es opcional, se genera solo
    nombre_categoria : str # nombre que se le da a la categoría

    producto : List["Producto"] = Relationship(back_populates="categoria") # relación: una categoría puede tener varios productos
