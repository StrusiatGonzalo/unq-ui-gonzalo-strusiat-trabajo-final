# Palabras Encadenadas

Trabajo Final Integrador de la materia Interfaces de Usuario (UNQ, 2° cuatrimestre
2026). Es una aplicación web desarrollada con React que implementa un juego de palabras
en cadena.

La idea es escribir palabras del diccionario español, una detrás de otra, de modo que
cada una comience con la letra en la que terminó la anterior. Cuanto más larga sea la
cadena que logres sostener antes de que el reloj llegue a cero, más puntos sumás.

## Requisitos

- [Node.js](https://nodejs.org/) (`v18.0.0` o superior)
- npm

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/StrusiatGonzalo/unq-ui-gonzalo-strusiat-trabajo-final.git
   cd unq-ui-gonzalo-strusiat-trabajo-final
   ```

2. Instalar las dependencias y crear el archivo de entorno:

   ```bash
   npm install
   cp .env.example .env
   ```

3. Ejecutar el proyecto:

   ```bash
   npm run dev
   ```

## Cómo se juega

- La primera palabra puede ser cualquier palabra válida del diccionario español.
- A partir de la segunda, cada palabra tiene que empezar con la última letra de la anterior.
- No se puede repetir una palabra durante la partida.
- Cada letra de una palabra válida suma 1 punto.
- Cada turno dura 15 segundos. El contador arranca con la primera palabra válida y vuelve
  a 15 con cada palabra válida. Si llega a 0, la partida termina.
- Al finalizar, se muestra el puntaje total, la cantidad de palabras y un botón para
  jugar de nuevo sin recargar la página.
- Si el puntaje entra en el Top 10, se puede guardar en el ranking con un nombre.

## Decisiones de diseño

### Validación de palabras

Se valida localmente todo lo posible antes de llamar a la API: se revisa que no esté
vacía, que sea una sola palabra, que contenga solo letras, que tenga el mínimo de
caracteres, que respete la regla de encadenamiento y que no esté repetida. Solo se
consulta la API para saber si la palabra existe en el diccionario.

- **Mínimo de 2 letras:** se exige un mínimo de 2 letras, rechazando palabras de una
  sola letra (como "a" o "y") para que las cadenas sean más interesantes.
- **Tildes y la Ñ:** para comparar si una palabra encadena o está repetida, el sistema
  normaliza el texto (pasa todo a minúsculas y elimina las tildes de las vocales), pero
  conserva la "ñ" y la "ü" para respetar el idioma español. Las palabras se muestran en
  pantalla con sus tildes originales (por ejemplo, "árbol").
- **Espacios:** no se permiten espacios en el input. Si el jugador escribe dos palabras
  separadas por un espacio, el sistema lo detecta y lo rechaza antes de llamar a la API.
- **Manejo de errores de red:** si la API falla (por ejemplo, por falta de conexión a
  internet), el juego muestra el mensaje "No pudimos verificar la palabra". No asume que
  la palabra no existe. Las palabras inválidas no descuentan tiempo.

### Tiempo

- **El contador se calcula con la hora real:** para evitar
  desincronizaciones (por ejemplo, si el navegador se pausa o se cambia de pestaña), el
  reloj guarda la hora de finalización en un `useRef` y calcula cuánto falta comparándola
  con el reloj de la computadora.

### Ranking

- **Top 10 de puntajes:** el ranking guarda los 10 mejores puntajes, ordenados de mayor a
  menor. Cuando ya hay 10 puestos, un puntaje solo entra si supera al último; un puntaje
  de 0 nunca entra.
- **Guardado en el navegador:** se usa `localStorage`, así que el ranking se mantiene al
  recargar la página, pero es propio de cada navegador (no hay servidor de por medio). Si
  la lectura o la escritura falla, el error se captura y el juego sigue funcionando.
- **Qué se guarda:** nombre, puntaje, cantidad de palabras y fecha de la partida.
- **Nombre del jugador:** al terminar una partida que entra en el Top 10, se pide un
  nombre de hasta 15 caracteres. No se puede guardar con el nombre vacío, y una vez
  guardado el puntaje no se puede volver a enviar.
- **Ventana de ranking:** los puntajes se muestran en un modal llamado "Mejores Puntajes".
  Si todavía no hay ninguno, se invita al jugador a jugar una partida.
  
### Experiencia de usuario

- **Input deshabilitado durante la consulta:** el input se deshabilita mientras se espera
  la respuesta de la API para evitar que el jugador envíe dos palabras al mismo tiempo.
- **Foco automático:** el input recupera el foco automáticamente después de cada envío
  (sea válido o inválido) para agilizar el ritmo del juego y no tener que hacer clic con
  el mouse cada vez.
- **Mensajes de colores:** si la palabra es válida, el mensaje se muestra en verde. Si
  hay un error, se muestra en rojo.
- **Cartel de ayuda inicial:** al entrar por primera vez, aparece un modal con las
  instrucciones. Se guarda en el `localStorage` para que no vuelva a aparecer en cada
  recarga, pero el jugador puede volver a abrirlo tocando el botón "?".

## Estructura del proyecto

```
src/
├── components/
│   ├── Game.jsx             // Lógica principal, inputs y vista de la partida
│   ├── GameMessage.jsx      // Mensajes de validación (verde si es válida, rojo si hay error)
│   ├── GameOver.jsx         // Pantalla de fin de partida con el resultado
│   ├── HowToPlayModal.jsx   // Instrucciones del juego usando el Modal
│   ├── MetricsBar.jsx       // Tiempo restante, puntaje y barra de tiempo
│   ├── Modal.jsx            // Componente visual de ventana reutilizable
│   ├── RankingModal.jsx     // Ventana con el ranking de puntajes usando el Modal
│   └── WordChain.jsx        // Cadena de palabras ingresadas durante la partida
├── hooks/
│   ├── useFirstVisit.js     // Controla si es la primera visita para abrir el modal
│   ├── useRanking.js        // Lógica del ranking de puntajes
│   └── useTimer.js          // Lógica del reloj con cuenta regresiva y reset
├── service/
│   └── api.js               // API de validación con axios
├── utils/
│   └── validations.js       // Reglas de validación de palabras, normalización y limpieza
├── App.jsx                  // Componente raíz que renderiza Game
├── index.css                // Estilos personalizados (estética retro)
└── main.jsx                 // Punto de entrada e importación de estilos
```

## Stack

- React + Vite
- Bootstrap (para la estructura y grilla)
- axios para las llamadas HTTP
- CSS personalizado para la estética retro (bordes negros, sombras duras y fuente Space Mono)