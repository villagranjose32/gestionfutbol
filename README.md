# ⚽ Proyecto CACC – Sistema de Gestión de Juveniles

## 📌 Descripción del proyecto

Este es un proyecto académico para la materia Practica Profesionalizante II de la Tecnicatura Superior en Desarrollo de Software.
Es un sistema web desarrollado para que el club de fútbol Club Atlético Central Córdoba lleve un seguimiento integral de los jugadores juveniles. Se registrará información deportiva, médica, física, familiar, entre otros aspectos relevantes, permitiendo así una mejor organización y control de cada jugador por parte del cuerpo técnico y responsables del club.

---

## 📁 Descripción del repositorio

Este repositorio está organizado como un proyecto **Fullstack**, dividido en dos carpetas principales:

- `frontend/`: contiene el cliente de la aplicación hecho con **React + Vite** y estilos con **TailwindCSS**.
- `backend/`: contiene el servidor desarrollado con **Node.js + Express**.

La estructura básica ya está creada y lista para trabajar:

```bash
proyecto-cacc/              # Carpeta raíz del repositorio
│
├── frontend/               # Proyecto del frontend con React + Vite + Tailwind
│   ├── index.html
│   ├── package.json        # Dependencias del frontend
│   ├── tailwind.config.js  # Configuración de TailwindCSS
│   ├── vite.config.js      # Configuración de Vite
│   └── src/                # Código fuente del frontend (componentes, estilos, etc.)
│
├── backend/                # Proyecto del backend con Node.js + Express
│   ├── package.json        # Dependencias del backend
│   └── src/
│       └── index.js        # Servidor básico con Express
│
└── README.md               # Este archivo con la documentación del proyecto
```
---

## 🛠️ Cómo clonar y preparar el proyecto localmente

Cada integrante debe seguir estos pasos:

### Paso 1: Clonar el repositorio


Abrir la terminal (Git Bash) y clonar el repositorio ejecutando los siguientes comandos:

   `git clone https://github.com/juancruzvenier/proyecto-cacc.git`
   y luego
   `cd proyecto-cacc`


### Paso 2: Cambiar a la rama de desarrollo (¡muy importante!)

Este proyecto tiene dos ramas principales:

`main`: para la versión estable y final del proyecto, sin errores.

`desarrollo`: donde trabajamos todos los días, programamos, probamos y corregimos errores.

🔴 No trabajes sobre `main`. Siempre trabajá sobre `desarrollo`.

Para cambiarte a la rama correcta, hacé:
`git checkout desarrollo`

### 🔁 ¿Qué hacer todos los días ANTES de empezar a trabajar?

Una vez que ya tienes el proyecto clonado, cada día antes de tocar cualquier archivo, **actualizá tu repositorio local con los últimos cambios**.

Desde la raíz del proyecto (la carpeta `proyecto-cacc`, donde clonaste el repo), ejecutá:

`cd proyecto-cacc` --> entras a la carpeta del proyecto
`git pull origin desarrollo` --> traes los últimos cambios de la rama 'desarrollo'

## Para el FRONTEND: 
### Cómo levantar el frontend (React + Vite + TailwindCSS)

`cd frontend`  --> entrar a la carpeta frontend

`npm install`  --> Este comando instala automáticamente todas las dependencias listadas en el package.json, incluyendo React, Tailwind, Vite, etc.

`npm run dev`  --> Esto va a levantar la aplicación React en algo como: http://localhost:(puerto)

## Para el BACKEND: 
### Cómo levantar el backend (Node.js + Express)

`cd backend`  --> Ir a la carpeta del backend

`npm install`  --> Esto instalará Express y cualquier dependencia que se agregue en el futuro.

node src/index.js  --> Esto iniciará el servidor y deberías ver este mensaje en consola: Servidor escuchando en http://localhost:(puerto)

## ¿Por qué usamos la rama desarrollo?

Para mantener el proyecto limpio, ordenado y sin errores en producción.
`desarrollo` --> rama donde trabajamos todos los días, probamos funcionalidades nuevas y desarrollamos.

`main` --> rama final, limpia, con funcionalidades estables y testeadas.

✔️ Solo haremos merge a main cuando estemos completamente seguros de que lo que hicimos en desarrollo funciona bien y está terminado. Se estima que sería en etapas finales del proyecto.


## Cómo subir tus cambios a la rama desarrollo

### Paso 1: Asegurate de estar en la rama correcta
`git checkout desarrollo`

### Paso 2: Ver el estado para saber si hay cambios para guardar
`git status`

### Paso 3: Guardar los archivos que modificaste
`git add nombre-del-archivo.js`

### Paso 4: Hacer el commit con un mensaje claro
`git commit -m "Descripción de lo que hiciste, por ejemplo: Agregada funcionalidad de login"`

### Paso 5: Subir los cambios al repositorio
`git push origin desarrollo`

🔴 Nunca hagas push a `main` directamente. Solo trabajamos en `desarrollo`.

## 💪🏻 Buenas prácticas
- Siempre trabajá sobre la rama desarrollo.
- Nunca subas directo a main.
- Avisá al grupo si vas a tocar algo importante.
- Si encontrás errores o necesitás investigar algo, comentá en el grupo para que todos estemos al tanto y evitar trabajo duplicado.

## 🎨 ¿Por qué usamos TailwindCSS y no archivos .css?
En lugar de tener múltiples archivos `.css` con clases que quizás se repiten, Tailwind CSS nos permite escribir estilos directamente en los elementos HTML/JSX usando clases, lo que:
- Acelera el desarrollo.
- Mantiene el CSS limpio y modular.
- Evita crear archivos CSS largos y desorganizados.
- Es ideal para trabajar en equipo, porque todos usan las mismas clases de utilidad.
- Ya está instalado y listo para usar en el proyecto React.