# Sistema de Datos Unificado

## Descripción
Sistema completamente refactorizado que elimina los datos mock y usa únicamente el backend real. Garantiza que páginas públicas y admin accedan a exactamente los mismos datos.

## Servicios Principales

### 1. `api.js` - Servicios API Reales
Conecta directamente con los endpoints del backend:

- **propertyService**: `/API/Propiedad/*`
- **clientService**: `/API/Cliente/*` 
- **contactService**: `/API/Contacto/*`
- **tasacionService**: `/API/Tasacion/*`
- **statsService**: Calcula estadísticas en tiempo real

### 2. `unifiedDataService.js` - Servicio Unificado
Garantiza consistencia entre páginas públicas y admin:

```javascript
import { unifiedDataService } from '../services/unifiedDataService';

// En páginas públicas
const properties = await unifiedDataService.searchProperties({
  transaccionTipo: 'Venta'
});

// En admin - usa exactamente los mismos datos
const properties = await propertyService.search({
  transaccionTipo: 'Venta'  
});
```

## Cómo Actualizar Páginas Públicas

### Ejemplo: Actualizar página de Alquiler

**ANTES** (con datos mock/duplicados):
```javascript
const fetchPropiedades = async () => {
  const response = await fetch(`${API_BASE_URL}/Propiedad/Buscar?...`);
  // lógica duplicada para mapear datos
};
```

**DESPUÉS** (con servicio unificado):
```javascript
import { usePublicProperties } from '../services/unifiedDataService';

const { searchProperties } = usePublicProperties();

const fetchPropiedades = async () => {
  const response = await searchProperties({
    transaccionTipo: 'Alquiler',
    barrio: filtros.barrio,
    precioMin: filtros.precioMin
  });
  // Los datos ya vienen en el formato correcto
  return response.value;
};
```

## Beneficios

1. **Eliminación Completa de Mock Data** - Solo datos reales
2. **Consistencia Total** - Admin y público ven los mismos datos
3. **Sin Duplicación** - Un solo punto de acceso a datos
4. **Cache Inteligente** - Optimización automática de llamadas
5. **Tipado Consistente** - Misma estructura en toda la app

## Endpoints Mapeados

| Funcionalidad | Endpoint Backend | Servicio Frontend |
|---------------|------------------|-------------------|
| Todas las propiedades | `/API/Propiedad/Obtener` | `propertyService.getAll()` |
| Buscar propiedades | `/API/Propiedad/Buscar` | `propertyService.search(filters)` |
| Propiedad por ID | `/API/Propiedad/Obtener/:id` | `propertyService.getById(id)` |
| Todos los clientes | `/API/Cliente/Obtener` | `clientService.getAll()` |
| Crear cliente | `/API/Cliente/Crear` | `clientService.create(data)` |
| Crear contacto | `/API/Contacto/Crear` | `contactService.create(data)` |

## Próximos Pasos

- [ ] Actualizar todas las páginas públicas para usar `unifiedDataService`
- [ ] Probar consistencia de datos entre admin y público
- [ ] Implementar endpoints para pagos y reservas cuando estén disponibles
- [ ] Optimizar cache y rendimiento
