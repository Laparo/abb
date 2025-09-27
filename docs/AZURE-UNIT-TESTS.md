# Azure Static Web Apps Unit Tests Konfiguration

## Übersicht

Die Unit-Tests für ABB werden jetzt direkt in Azure's Free-Tier-Umgebung ausgeführt, um die CI/CD-Pipeline zu optimieren und Azure's native Build-Features zu nutzen.

## Konfiguration

### Azure Build Pipeline

Die Unit-Tests sind in die Azure Static Web Apps Build-Pipeline integriert:

```yaml
# .github/workflows/azure-static-web-apps.yml
app_build_command: |
  npm ci --prefer-offline --no-audit &&
  npm run test -- --reporter=dot --run &&
  npm run build
```

### Static Web App Konfiguration

Die `staticwebapp.config.json` definiert die Build-Konfiguration für Azure:

```json
{
  "buildConfig": {
    "nodeVersion": "20",
    "installCommand": "npm ci --prefer-offline --no-audit",
    "buildCommand": "npm run test -- --reporter=dot --run && npm run build",
    "outputLocation": ".output/public",
    "apiLocation": ".output/server"
  }
}
```

## Vorteile der Azure-Integration

### 🆓 Free Tier Optimierung

- **Keine zusätzlichen GitHub Actions Minuten** für Unit-Tests
- **Native Azure Build-Umgebung** mit optimierter Performance
- **Integrierte Fehlerbehandlung** - Deployment schlägt bei Test-Fehlern fehl

### ⚡ Performance

- **Parallele Ausführung** von Tests und Build-Vorbereitung
- **Azure's optimierte Node.js-Umgebung** für schnellere Test-Ausführung
- **Reduzierte CI/CD-Pipeline-Zeit** durch weniger GitHub Actions Jobs

### 🔧 Wartbarkeit

- **Einheitliche Umgebung** für Tests und Deployment
- **Weniger Konfigurationsdateien** zu verwalten
- **Automatische Skalierung** bei größeren Test-Suites

## Test-Ausführung

### Lokale Entwicklung

```bash
# Tests lokal ausführen (wie gewohnt)
npm run test

# Tests mit Azure-kompatiblen Flags
npm run test -- --reporter=dot --run
```

### Azure Deployment

1. **Push zu `main` Branch** oder **PR erstellen**
1. **Streamlined CI** führt TypeScript-Check und Build-Validation aus
1. **Azure Static Web Apps** führt Unit-Tests in der Build-Pipeline aus
1. **Deployment erfolgt nur bei erfolgreichen Tests**

## Monitoring und Debugging

### Azure Portal

- **Build-Logs** in Azure Static Web Apps Dashboard
- **Test-Ergebnisse** in der Deployment-Historie
- **Performance-Metriken** für Build-Zeit

### GitHub Actions

- **Streamlined CI Status** für TypeScript und E2E Tests
- **Azure Deployment Status** mit Test-Ergebnissen
- **Fehler-Logs** bei fehlgeschlagenen Tests

## Fallback-Strategie

Falls Azure-Tests fehlschlagen:

1. **Lokale Reproduktion**:

   ```bash
   npm run test -- --reporter=dot --run
   ```

1. **CI-Fallback** (temporär):

   ```bash
   # In streamlined-ci.yml wieder aktivieren
   npm run test -- --reporter=dot
   ```

1. **Debug-Modus**:

   ```bash
   # Detaillierte Test-Ausgabe
   npm run test -- --reporter=verbose
   ```

## Migration von GitHub Actions

### Vorher (GitHub Actions)

```yaml
- name: Unit Tests
  run: npm run test -- --reporter=dot
```

### Nachher (Azure Build Pipeline)

```yaml
app_build_command: |
  npm ci --prefer-offline --no-audit &&
  npm run test -- --reporter=dot --run &&
  npm run build
```

## Kostenoptimierung

### GitHub Actions Minuten gespart

- **~2-3 Minuten pro PR** für Unit-Tests
- **~50-100 Builds pro Monat** = 100-300 Minuten gespart
- **Free Tier bleibt unter Limit** für andere kritische Tests

### Azure Free Tier Limits

- **100 GB Bandbreite/Monat** (mehr als ausreichend)
- **0.5 GB Storage** für Build-Artefakte
- **Unbegrenzte Builds** in Free Tier

## Troubleshooting

### Häufige Probleme

1. **Tests schlagen in Azure fehl, lokal aber nicht**
   - Node.js Version prüfen (sollte 20 sein)
   - Environment Variables in Azure konfigurieren

1. **Build-Zeit zu lang**
   - `--prefer-offline` Flag nutzen
   - Dependencies optimieren

1. **Test-Output nicht sichtbar**
   - Azure Portal Build-Logs prüfen
   - `--reporter=dot` für kompakte Ausgabe

### Support

- **Azure Static Web Apps Dokumentation**: [docs.microsoft.com](https://docs.microsoft.com/azure/static-web-apps/)
- **GitHub Issues**: Für projektspezifische Probleme
- **Azure Support**: Für plattformspezifische Issues
