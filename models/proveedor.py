from sqlmodel import SQLModel, Field
from typing import Optional

class proveedores(SQLModel,table=True):
    id:Optional[int]=Field(default=None, primary_key=True)
    nombre_empresa: str
    correo: str
    telefono: str