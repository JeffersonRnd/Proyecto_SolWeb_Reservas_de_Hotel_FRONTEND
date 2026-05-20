# Frontend para Aplicación de Alquileres

Este proyecto ha sido generado usando [Angular CLI](https://github.com/angular/angular-cli) version 21.2.5.

Este proyecto es desarrollado como parte del curso Soluciones Web y Aplicaciones Distribuidas con NRC 5206, correspondiente al período UPN 2026-1

## A considerar

Cuando clone el proyecto, para que la aplicación descargue las devependencias, desde la línea de comandos navegue a la línea de comandos y ejecute:

```bash
npm install
```

Se ha deshabilitado el modo estricto de typescript en el archivo `tsconfig.json`
```bash
"strict": false,
```

Y para un comportamiento según versiones de angular anteriores se agregó en `angular.json` la siguiente configuración:

```bash
    "schematics": {
        "@schematics/angular:component": { "type": "component" },
        "@schematics/angular:service": { "type": "service" },
        "@schematics/angular:pipe": { "typeSeparator": "." },
        "@schematics/angular:module": { "typeSeparator": "." }
      }
```

## Development server

Para iniciar un servidor local de desarrollo, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abre tu navegador y accede a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques alguno de los archivos fuente.

## Code scaffolding

Angular CLI incluye potentes herramientas para la generación de código. 
Para generar un nuevo componente, ejecute:

```bash
ng generate component component-name
```

Para generar un nuevo servicio ejecute:

```bash
ng generate service service-name
```

Para generar los archivos para configurar las variables de entorno:

```bash
ng generate environments
```


Para obtener una lista completa de los esquemas disponibles (como `components`, `directives`, or `pipes`), ejecute:

```bash
ng generate --help
```

## Building

Para compilar el proyecto, ejecute:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los archivos generados en el directorio `dist/`. Por defecto, la compilación de producción optimiza tu aplicación para mejorar el rendimiento y la velocidad.

## Running unit tests

Para ejecutar pruebas unitarias con el ejecutor de pruebas [Vitest](https://vitest.dev/), utilice el siguiente comando:

```bash
ng test
```

## Running end-to-end tests

Para realizar pruebas de end-to-end(e2e), ejecute:

```bash
ng e2e
```

Angular CLI no incluye un marco de pruebas integral por defecto. Puedes elegir el que mejor se adapte a tus necesidades.

## Additional Resources

Para obtener más información sobre el uso de Angular CLI, incluidas referencias detalladas de comandos, visite la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
