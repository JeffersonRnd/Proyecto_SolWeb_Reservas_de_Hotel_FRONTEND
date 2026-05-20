# 🏨 Reservas Hotel Frontend
Aplicación frontend para la gestión de reservas de hotel, desarrollada con *Angular 21* y *TypeScript*.
---
## 📋 Requisitos previos
Antes de ejecutar el proyecto, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) v18 o superior (recomendado: v24.x)
- [npm](https://www.npmjs.com/) v9 o superior
- [Angular CLI](https://angular.dev/tools/cli) v21
Puedes verificar tus versiones con:
bash
node -v
npm -v
ng version

---
## ⚙️ Instalación
1. Descarga el proyecto y descomprímelo en la carpeta deseada.
2. Abre la carpeta del proyecto y en tu terminal mediante el siguiente comando instala las dependencias:
bash
npm install

---
## ▶️ Ejecución en desarrollo
Para iniciar el servidor, en la misma terminal ejecuta:
bash
ng serve

Luego abre el navegador en: [http://localhost:4200](http://localhost:4200)
La aplicación se recargará automáticamente al detectar cambios en los archivos fuente.

---

## 🗂️ Archivos creados


src/app/model/          → reserva, detalle-reserva, habitacion, huesped, tipo-habitacion
src/app/services/       → generic, generic-signal, habitacion, huesped, reserva, tipo-habitacion
src/app/pages/          → layout, habitacion, huesped, reserva, tipo-habitacion (cada uno con su componente de edición)
src/environments/       → environment.ts, environment.development.ts
src/material-theme.scss


---

## 📦 Dependencias adicionales

Además de las dependencias base de Angular, este proyecto incluye:

- [@angular/material](https://material.angular.io/) v21 — Componentes UI de Material Design
- [@angular/cdk](https://material.angular.io/cdk/categories) v21 — Kit de desarrollo de componentes
- [prettier](https://prettier.io/) — Formateador de código
- [vitest](https://vitest.dev/) — Framework de testing
