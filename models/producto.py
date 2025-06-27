from typing import Optional, List, TYPE_CHECKING
# Importa herramientas para tipado: Optional para campos opcionales,
# List para listas tipadas y TYPE_CHECKING para evitar importaciones circulares

from sqlmodel import SQLModel, Field, Relationship
# Importa las clases para definir modelos, campos y relaciones en SQLModel

if TYPE_CHECKING:
    from models.categoria import categoria
class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # Campo 'id' opcional que será clave primaria autogenerada

    nombre: str
    # Nombre del producto

    precio: float
    # Precio del producto

    categoria_id: int = Field(foreign_key="categoria.id")
    # Clave foránea que referencia al id de la categoría a la que pertenece el producto

    Categoria: Optional['categoria'] = Relationship(back_populates="productos")
    # Relación opcional con el modelo 'categoria',
    # 'back_populates' indica que en categoria hay un campo 'productos' que completa la relación