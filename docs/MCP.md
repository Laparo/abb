# MCP (Model Context Protocol) – Lokale Nutzung

MCP ist in diesem Projekt optional und ausschließlich als lokales Dev-Tool gedacht. Es ist KEINE Build- oder Runtime-Abhängigkeit.

## Prisma MCP lokal starten

Voraussetzungen:

- Node.js 20+
- Abhängigkeiten installiert (`npm install`)

Start (ephemer, lokal):

```bash
npm run mcp:prisma
```

Dies startet den Prisma MCP Server lokal (SSE, Standard: `http://127.0.0.1:8765/sse`).

## VS Code Anbindung (optional)

Lege eine Nutzer-spezifische MCP-Konfiguration an (Pfad ist OS-abhängig). Beispiel-Inhalt:

```json
{
  "servers": {
    "prisma": {
      "command": "npx",
      "args": ["-y", "prisma", "mcp"],
      "transport": {
        "type": "sse",
        "url": "http://127.0.0.1:8765/sse"
      }
    }
  }
}
```

Hinweise:

- Keine Secrets in Prompts verwenden.
- MCP nur lokal/ephemer nutzen; nicht in CI/Produktion.
- Generierte Outputs müssen TypeScript-Checks bestehen und durch Code-Review gehen.
