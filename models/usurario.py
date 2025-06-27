from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
if TYPE_CHECKING:
    pass
class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: str
    contraseña: str
    rol: str
