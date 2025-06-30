from sqlmodel import SQLModel, Field # importo lo necesario para armar el modelo
from typing import Optional # para usar tipos opcionales en los campos

# Clase para el modelo de Proveedores
class proveedores(SQLModel, table=True): # table=True dice que esto se convierte en tabla
    id: Optional[int] = Field(default=None, primary_key=True) # identificador único, se genera solo
    nombre_empresa: str # nombre de la empresa del proveedor
    correo: str # correo del proveedor
    telefono: str # número de contacto
