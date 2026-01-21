# CxJS Skill for Claude Code

## Overview

CxJS Skill je specijalizovani Claude Code skill dizajniran za rad sa CxJS framework-om. Fokusira se na code quality, održavanje, i najbolje prakse.

## Funkcionalnosti

### 1. Pattern Recognition
- Prepoznaje CxJS pattern-e u kodu (widgets, controllers, stores)
- Identifikuje anti-pattern-e i predlaže poboljšanja
- Detektuje prilike za refactoring ka idiomatskom CxJS kodu

### 2. Component Generation
- Generiše CxJS komponente prema konvencijama
- Koristi pravilne TypeScript tipove
- Implementira proper data binding i lifecycle metode

### 3. Data Binding & Store Management
- Dizajnira efikasne store strukture
- Implementira pravilne accessor chains
- Postavlja computed values koristeći controllers

### 4. Debugging & Troubleshooting
- Identifikuje česte CxJS probleme
- Nudi step-by-step debugging strategije
- Referenciše CxJS dokumentaciju i primjere

## Kako koristiti

### Lokalno

1. Skill je već konfigurisan u `.claude/commands/cxjs.md`
2. Pozovi ga sa:
   ```
   /cxjs [tvoj zahtjev]
   ```

### Primjeri upotrebe

**Analiza postojećeg koda:**
```
/cxjs Analiziraj komponente u gallery/ direktoriju i predloži poboljšanja
```

**Generisanje nove komponente:**
```
/cxjs Kreiraj Grid komponentu sa CRUD operacijama za user management
```

**Debugging:**
```
/cxjs Pomozi mi da debugujem zašto se binding ne ažurira u UserProfile komponenti
```

**Refactoring:**
```
/cxjs Refaktoriši ovaj controller da koristi najbolje prakse za computed values
```

## Struktura Skill-a

```
.claude/
└── commands/
    ├── cxjs.md          # Glavni skill definicija
    └── README.md        # Ova dokumentacija
```

## Priprema za Objavu

Da bi CxJS skill postao javno dostupan plugin, potrebno je:

### 1. Kreirati Plugin Package

```json
{
  "name": "cxjs-skill",
  "version": "1.0.0",
  "description": "CxJS framework expert skill for code quality and maintenance",
  "main": "index.js",
  "keywords": ["cxjs", "claude-code", "skill", "framework"],
  "author": "Codaxy",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/codaxy/cxjs-skill"
  }
}
```

### 2. Kreirati Plugin Manifest

```json
{
  "name": "cxjs-skill",
  "version": "1.0.0",
  "type": "skill",
  "description": "CxJS framework expert for code quality and maintenance",
  "capabilities": [
    "pattern-recognition",
    "code-generation",
    "debugging",
    "refactoring"
  ],
  "commands": {
    "cxjs": {
      "description": "Analyze, generate, or improve CxJS code with framework expertise",
      "prompt": "cxjs.md"
    }
  },
  "dependencies": {
    "claude-code": ">=1.0.0"
  }
}
```

### 3. Organizovati Fajlove

```
cxjs-skill/
├── package.json
├── manifest.json
├── README.md
├── LICENSE
├── prompts/
│   └── cxjs.md           # Glavni skill prompt
├── examples/
│   ├── component-generation.md
│   ├── debugging.md
│   └── refactoring.md
└── docs/
    ├── installation.md
    └── usage.md
```

### 4. Testiranje

Prije objave, testiraj skill sa različitim scenarijima:
- [ ] Pattern recognition na postojećem CxJS kodu
- [ ] Generisanje novih komponenti
- [ ] Debugging čestih problema
- [ ] Refactoring kompleksnih struktura
- [ ] Integracija sa TypeScript projektima

### 5. Dokumentacija za Objavu

Pripremi:
- Detaljnu README.md sa primjerima
- CHANGELOG.md za verzionisanje
- CONTRIBUTING.md za zajednicu
- Primjere upotrebe
- Video demonstraciju (opcionalno)

### 6. Objava

Opcije za distribuciju:

#### A. Claude Plugin Registry (kada bude dostupan)
```bash
claude plugin publish
```

#### B. GitHub Package
```bash
git tag v1.0.0
git push origin v1.0.0
```

#### C. npm Package
```bash
npm publish
```

Korisnici bi zatim mogli instalirati sa:
```bash
claude plugin install cxjs-skill
# ili
claude plugin install codaxy/cxjs-skill
```

## Održavanje

- Redovno ažuriraj skill sa novim CxJS pattern-ima
- Dodaj nove primjere i use case-ove
- Implementiraj feedback od korisnika
- Prati CxJS releases i ažuriraj najbolje prakse

## Doprinos

Skill je open source i prihvata doprinose. Oblasti za poboljšanje:
- Više template-a za komponente
- Dodatni debugging scenariji
- Performance optimization patterns
- Accessibility guidelines
- Internacionalizacija primjera

## Podrška

Za pitanja i podršku:
- GitHub Issues: https://github.com/codaxy/cxjs
- Discord: https://discord.gg/cxjs
- Documentation: https://docs.cxjs.io

## Licenca

MIT License - Slobodno koristi, modifikuj i distribuiraj.
