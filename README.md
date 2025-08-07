desde esta version del dia 30/12
En que trabajar?
sin en vargo la app no esta completa, las tareas que me prodia olvidar de hacer serian las siguientes:
* Agregarle lazy y suspense a los componentes para que carguen cuando yo diga que carguen, "CARGA PERESOZA"
* AcTUAliazar: el reducer del carrito sincronizarlo con un contador del carritito del front para que halla una colicion de error,;a colisirion se craria asi: seria crear una funcion donde verifique si quantity sobrepasa el numero de stock de las cards, para que no allan intervenientes para mi al momento de hacer los envios.
- Seria mas por si quiero dejar un mensaje en el front de que no hay stock
- Para que me envien una notificacion por si alguien esta haciendo un pedido que sobrepasa el stock y darle prioridad
* cambiar los path por algo asi const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

* RUTAS INTELIGENTE, QUE SEPAN DONDE ESTABA EL CLIENTES ANTES DE AVANZAR O RETROCEDER

* IMPORTANTE EN ADMIN.JSX NO PUEDE DESPACHAR LA PETICION DE CREACION SIN ANTES LLENAR TODOS LOS CAMPOS REQUERIDOS, SI NO SE ROMPE LA APP

* Stock antes de que el cliente haga la compra se debe evaluar si el quiantity es igual o menos al stock para proseguir.







Buenas Prácticas de Seguridad en Desarrollo Web y React
1. Validación y Sanitización de Datos
Validar siempre datos que entran al backend, incluso si también lo hiciste en frontend.

Sanitizar inputs para evitar inyección de código (XSS, SQL Injection, etc).

En React, evita usar dangerouslySetInnerHTML si no es absolutamente necesario.

2. Autenticación y Autorización
Usa protocolos estándar como OAuth2, JWT, OpenID Connect para autenticar usuarios.

Implementa control de acceso (roles, permisos) en backend y frontend.

No guardes tokens en localStorage si podés usar cookies con HttpOnly y Secure.

3. Protección contra Cross-Site Scripting (XSS)
Escapa o sanitiza datos antes de renderizarlos.

Usa Content Security Policy (CSP) para restringir qué scripts pueden ejecutarse.

Evita incluir librerías o scripts externos de fuentes no confiables.

4. Protección contra Cross-Site Request Forgery (CSRF)
Usa tokens CSRF para validar requests sensibles.

Si usás cookies para sesiones, asegurate que estén configuradas con SameSite y Secure.

5. Seguridad en API Keys y Secrets
No expongas API keys ni credenciales en el frontend.

Almacena claves en variables de entorno y en el backend.

Limita el scope y permisos de las API keys.

6. Cifrado
Usa HTTPS siempre para proteger la comunicación.

Cifra datos sensibles en la base de datos (como contraseñas con bcrypt o argon2).

Cifra información sensible en reposo y tránsito.

7. Manejo de Errores
No reveles información sensible en mensajes de error (p. ej., stack traces).

Loguea errores en backend para auditoría, pero muestra mensajes genéricos al usuario.

8. Actualizaciones y Dependencias
Mantén siempre actualizadas las librerías y dependencias.

Usa herramientas como npm audit para detectar vulnerabilidades.

9. Seguridad en React
Evita usar eval() o funciones que ejecuten código arbitrario.

Controla que las props y estados no puedan ser manipulados maliciosamente.

Usa herramientas como ESLint con reglas de seguridad.

10. Headers de Seguridad HTTP
Configura headers como:

Content-Security-Policy

X-Frame-Options

X-Content-Type-Options

Strict-Transport-Security

11. Protección contra ataques de fuerza bruta
Limita intentos de login.

Usa CAPTCHA o autenticación multifactor.

12. Testing de seguridad
Realiza análisis de vulnerabilidades con herramientas (OWASP ZAP, Snyk, etc).

Haz pruebas de penetración periódicas.