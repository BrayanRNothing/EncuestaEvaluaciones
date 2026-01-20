# EncuestasAPI - Sistema de Encuestas HVACR

Sistema de encuestas con diseño glassmorphism para diagnóstico integral de distribuidores HVACR.

## 🚀 Características

- ✅ Diseño glassmorphism moderno con fondo animado (Vanta.js)
- ✅ 86 preguntas organizadas en 11 categorías empresariales
- ✅ Sistema de evaluación de 5 niveles (NE, B, ED, A, BC)
- ✅ Validación de formulario completo
- ✅ Responsive design
- ✅ Conectado a backend compartido (InfiniguardSYS)

## 📋 Categorías de Evaluación

1. Clientes y Mercado (10 preguntas)
2. Estrategia y Gobierno del Negocio (9 preguntas)
3. Marketing y Generación de Demanda (11 preguntas)
4. Ventas y Ejecución Comercial (10 preguntas)
5. Portafolio de Producto y Soporte Técnico (9 preguntas)
6. Inventario y Supply Chain (9 preguntas)
7. Tecnología y Digitalización (7 preguntas)
8. Finanzas y Control de Gestión (9 preguntas)
9. Benchmarking y Mejores Prácticas (5 preguntas)
10. Talento, Cultura y Organización (9 preguntas)
11. Relación Fabricante–Distribuidor (8 preguntas)

## 🛠️ Tecnologías

- React 18
- Vite
- TailwindCSS
- Vanta.js + Three.js
- React Router DOM

## 📦 Instalación

```bash
npm install
```

## 💻 Desarrollo Local

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Build para Producción

```bash
npm run build
```

## 🔗 Backend

Este frontend se conecta al backend de InfiniguardSYS:

- **Producción**: `https://focused-presence-production-6e28.up.railway.app/api/encuestas`
- **Local**: `http://localhost:4000/api/encuestas`

Para cambiar entre local y producción, edita `src/config/api.js`

## 📤 Deploy en Vercel

1. Conecta este repositorio a Vercel
2. Vercel detectará automáticamente que es un proyecto Vite
3. Deploy automático en cada push a main

## 🎨 Escala de Evaluación

| Nivel | Código | Puntos | Descripción |
|-------|--------|--------|-------------|
| No existe | NE | 0 | No implementado |
| Básico | B | 25 | Implementación básica |
| En desarrollo | ED | 50 | En proceso de mejora |
| Avanzado | A | 75 | Bien implementado |
| Best in class | BC | 100 | Excelencia operativa |

## 📝 Licencia

Privado - Uso interno
