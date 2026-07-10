# google-ads-mcp-server

Servidor MCP (Model Context Protocol) en TypeScript para gestionar campañas
de Google Ads desde cualquier cliente compatible con MCP (Claude Desktop,
Claude Code, etc.) usando lenguaje natural.

## Herramientas disponibles

| Tool | Descripción |
|---|---|
| `create_campaign` | Crea una campaña (y su presupuesto diario). Queda `PAUSED` por defecto. |
| `list_campaigns` | Lista campañas de la cuenta, con filtro de estado y paginación. |
| `set_campaign_status` | Pausa o activa una campaña existente. |
| `get_campaign_performance` | Impresiones, clics, costo, CTR y CPC promedio por campaña. |
| `create_ad_group` | Crea un ad group dentro de una campaña. |
| `create_ad` | Crea un anuncio de búsqueda adaptable (Responsive Search Ad). Queda `PAUSED` por defecto. |

Todas las tools devuelven JSON estructurado: `{ "success": true, "data": {...} }`
o `{ "success": false, "error": "...", "details": [...] }` con el detalle
específico que devolvió Google Ads API.

## Requisitos previos

1. Una cuenta de **Google Ads** con acceso a la API (o acceso a una MCC).
2. Un **developer token** aprobado, obtenido en
   [Google Ads API Center](https://ads.google.com/aw/apicenter).
   Un token en nivel "Test account" alcanza para probar contra cuentas de prueba.
3. Un **OAuth client ID** de tipo "Desktop app" creado en
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   con la Google Ads API habilitada en el proyecto.

## Setup

```bash
npm install
cp .env.example .env
# completar GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET y GOOGLE_ADS_DEVELOPER_TOKEN en .env
```

### Obtener el refresh token

El servidor necesita un `GOOGLE_ADS_REFRESH_TOKEN` de larga duración. Se
genera una única vez con el flujo interactivo incluido:

```bash
npm run auth
```

Esto abre un servidor local, imprime una URL para autorizar en el navegador,
y al volver captura el `refresh_token` para que lo copies a tu `.env`.

### Build y ejecución

```bash
npm run build
npm start        # ejecuta dist/server.js sobre stdio

# o, para desarrollo sin compilar:
npm run dev
```

## Configuración en un cliente MCP (ej. Claude Desktop)

```json
{
  "mcpServers": {
    "google-ads": {
      "command": "node",
      "args": ["/ruta/absoluta/a/google-ads-mcp-server/dist/server.js"],
      "env": {
        "GOOGLE_ADS_CLIENT_ID": "...",
        "GOOGLE_ADS_CLIENT_SECRET": "...",
        "GOOGLE_ADS_REFRESH_TOKEN": "...",
        "GOOGLE_ADS_DEVELOPER_TOKEN": "...",
        "GOOGLE_ADS_LOGIN_CUSTOMER_ID": ""
      }
    }
  }
}
```

## Variables de entorno

Ver [`.env.example`](./.env.example) para el detalle completo. Las
obligatorias son:

- `GOOGLE_ADS_CLIENT_ID`
- `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_REFRESH_TOKEN`
- `GOOGLE_ADS_DEVELOPER_TOKEN`

Opcionales:

- `GOOGLE_ADS_LOGIN_CUSTOMER_ID`: ID de la cuenta MCC, si se opera a través
  de una cuenta administradora.
- `GOOGLE_ADS_API_VERSION`: versión de la API (default `v17`).

## Notas de diseño

- **Transporte**: stdio, el estándar para servidores MCP locales invocados
  como subproceso por el cliente.
- **API**: se usa la interfaz **REST** de Google Ads API (no gRPC) vía
  `axios`, para no depender de stubs de protobuf generados.
- **Seguridad por defecto**: `create_campaign` y `create_ad` dejan el
  recurso creado en estado `PAUSED` salvo que se indique lo contrario, para
  evitar gasto accidental antes de una revisión manual.
- **Montos**: la API de Google Ads trabaja internamente en "micros"
  (1 unidad de moneda = 1.000.000 micros). Las tools reciben y devuelven
  montos en la unidad de moneda normal; la conversión se hace en
  `src/utils.ts`.
