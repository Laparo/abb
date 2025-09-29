# ABB - Female Empowerment Platform 🌟

> Empowering women through education, coaching, and community

[![Azure Static Web Apps CI/CD](https://github.com/Laparo/abb/actions/workflows/azure-swa.yml/badge.svg)](https://github.com/Laparo/abb/actions/workflows/azure-swa.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

## ✨ Über das Projekt

ABB ist eine innovative Plattform, die speziell für die Stärkung von Frauen durch Bildung und Coaching entwickelt wurde. Unser Ziel ist es, eine sichere und unterstützende Umgebung zu schaffen, in der Frauen ihre Potentiale entdecken und entwickeln können.

### 🎯 Mission

- **Bildung**: Hochwertige Kurse und Lernmaterialien
- **Coaching**: Persönliche Begleitung und Mentoring
- **Community**: Vernetzung gleichgesinnter Frauen
- **Empowerment**: Stärkung des Selbstvertrauens und der Fähigkeiten

## 🚀 Features

- 📚 **Kurs-Management**: Erstellen, buchen und verwalten von Kursen
- 👩‍🏫 **Coach-Profil**: Detaillierte Profile für Coaches und Mentoren
- 📅 **Buchungssystem**: Einfache Terminbuchung und -verwaltung
- 🔐 **Sichere Authentifizierung**: Azure Entra ID Integration
- 📱 **Responsive Design**: Optimiert für alle Geräte
- ♿ **Barrierefreiheit**: WCAG 2.1 AA konform

## Quick Start

### Prerequisites

- Node.js 20+
- Optional: Python 3.13+ (für Specify CLI), UV Package Manager

### Setup

````bash
# Abhängigkeiten installieren
npm install

# (Optional) .env erzeugen
cp -n .env.example .env || true

# Prisma Client generieren (nach Bedarf)
npm run prisma:generate

# (Optional) Migration für SQLite (Entwicklung)
npm run prisma:migrate

## 🛠️ Technologie-Stack

### Frontend
- **Framework**: [Nuxt.js 3](https://nuxt.com/) mit Vue 3 Composition API
- **UI Library**: [Vuetify 3](https://vuetifyjs.com/) mit Material Design 3
- **Sprache**: TypeScript (Strict Mode)
- **Styling**: CSS-in-JS mit Vuetify theming

### Backend & Datenbank
- **ORM**: [Prisma](https://prisma.io/) mit SQLite (dev) / PostgreSQL (prod)
- **API**: Nuxt Server API mit serverless functions
- **Authentifizierung**: Azure Entra ID (ehemals Azure AD)

### Deployment & DevOps
- **Hosting**: [Azure Static Web Apps](https://azure.microsoft.com/services/app-service/static/)
- **CI/CD**: GitHub Actions
- **Testing**: Vitest (Unit) + Playwright (E2E)
- **Code Quality**: ESLint + Prettier + TypeScript

## 🏃‍♀️ Quick Start

### Voraussetzungen
- Node.js 18+
- npm 9+
- Git

### Installation

```bash
# Repository klonen
git clone https://github.com/Laparo/abb.git
cd abb

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
````

### Verfügbare Scripts

```bash
# Entwicklung
npm run dev          # Entwicklungsserver mit HMR
npm run dev:stable   # Stabiler Entwicklungsserver

# Build & Deployment
npm run build        # Production Build
npm run preview      # Preview des Production Builds

# Testing
npm test             # Unit Tests mit Vitest
npm run e2e          # E2E Tests mit Playwright
npm run test:coverage # Test Coverage Report

# Code Quality
npm run lint         # ESLint Check
npm run lint:fix     # ESLint Auto-Fix
npm run typecheck    # TypeScript Type Check
```

### Production Requirements

- ✅ **2+ reviewer approvals** for production PRs
- ✅ **All quality gates pass**: lint, typecheck, unit tests, e2e tests
- ✅ **Database migration review** for schema changes
- ✅ **Zero downtime deployment** with health checks

### Environment Configuration

Create these GitHub repository secrets for production deployment:

```yaml
Secrets (Production Environment):
  PRODUCTION_DATABASE_URL: 'sqlserver://...'
  AZURE_STATIC_WEB_APPS_API_TOKEN_PROD: 'deployment-token'

Variables:
  AZURE_DEPLOYMENT_ENABLED: 'true' # Enable Azure deployments
```

### Emergency Hotfixes

For critical production issues:

```bash
# Create hotfix branch
git checkout production
git checkout -b hotfix/critical-fix

# Create PR: hotfix/critical-fix → production
# After merge, backport to main:
# Create PR: production → main
```

## 📁 Projektstruktur

```text
abb/
├── pages/              # Nuxt.js File-based Routing
├── components/         # Vue 3 Komponenten
├── composables/        # Business Logic & State
├── server/api/         # Nuxt Server API Routes
├── prisma/             # Datenbank Schema & Migrations
├── plugins/            # Nuxt Plugins (Vuetify, etc.)
├── middleware/         # Route Middleware
├── assets/             # Uncompiled Assets
├── public/             # Static Assets
├── .specify/           # Spec-driven Development
└── docs/               # Dokumentation
```

## 🧪 Testing

### Unit Tests

```bash
npm test                    # Alle Unit Tests
npm run test:watch         # Watch Mode
npm run test:coverage      # Coverage Report
```

### E2E Tests

```bash
npm run e2e                # Alle E2E Tests
npm run e2e:headed        # Mit Browser UI
npm run e2e:debug         # Debug Mode
```

## 🔧 Development Guidelines

### Code Style

- **TypeScript**: Strict Mode, keine `any` Types
- **Vue 3**: Composition API, `<script setup>` Syntax
- **Vuetify**: Material Design 3 Komponenten verwenden
- **ESLint**: Nuxt.js empfohlene Regeln

### Git Workflow

```bash
# Feature Branch erstellen
git checkout -b feature/amazing-feature

# Commits (Conventional Commits)
git commit -m "feat: add course booking feature"
git commit -m "fix: resolve authentication issue"

# Pull Request erstellen
```

## 🚀 Deployment

### Azure Static Web Apps

```bash
# Automatisches Deployment via GitHub Actions
git push origin main  # Trigger Deployment
```

## 📖 Dokumentation

- 📋 [Contributing Guide](CONTRIBUTING.md) - Contribution Guidelines
- 🔐 [Authentifizierung](docs/AUTH-ENTRA.md) - Azure Entra ID Setup
- ☁️ [Azure Deployment](docs/AZURE-SWA-SETUP.md) - Azure Static Web Apps

## 🤝 Contributing

Wir freuen uns über Contributions! Bitte lies unsere [Contributing Guidelines](CONTRIBUTING.md) für Details.

### Prioritäre Bereiche

- 🎯 **Accessibility**: WCAG 2.1 AA Compliance
- 🌍 **Internationalization**: Multi-Language Support
- ⚡ **Performance**: Core Web Vitals Optimization
- 📱 **Mobile**: Progressive Web App Features

## 📊 Project Status

### 🟢 Completed

- ✅ Grundlegende Projektstruktur
- ✅ Nuxt.js 3 + Vue 3 + Vuetify 3 Setup
- ✅ Azure Entra ID Authentifizierung
- ✅ Prisma ORM Integration
- ✅ Azure Static Web Apps Deployment

### 🟡 In Progress

- 🔄 Coach Profil Features
- 🔄 Erweiterte Buchungsfunktionen
- 🔄 Admin Dashboard

## 💬 Community & Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Laparo/abb/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Laparo/abb/discussions)
- 📧 **Email**: [hello@laparo.biz](mailto:hello@laparo.biz)

## 📄 License

Dieses Projekt ist unter der MIT License lizenziert - siehe [LICENSE](LICENSE) für Details.

---

## 🌟 Vision

**Gemeinsam schaffen wir eine Welt, in der jede Frau ihre Träume verwirklichen kann.**

Made with ❤️ for female empowerment
