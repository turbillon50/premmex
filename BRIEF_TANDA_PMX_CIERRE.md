# BRIEF TANDAS PREMMEX — CIERRE ETAPA 3 (7-jul-2026)
Repo: raiz de este directorio. Prod: premmex.life. Stack existente: Next.js App Router, Neon Postgres (SQL directo via API routes), auth propio 3 roles (admin password, cobrador PIN, socio telefono+PIN). SPA por roles: src/components/AdminApp.tsx, CobradorApp.tsx, SocioApp.tsx. page.tsx hoy = login directo.

REGLAS INVIOLABLES (Vulcano Standard v3):
- NO Lucide React, NO shadcn. Iconos SVG inline (patron VFIcons en shared.tsx si existe, o crearlo).
- Paleta obsidiana: void #03020a, bg #0a0814, blanco nacarado #f0f4ff, acentos existentes del proyecto.
- Framer Motion en transiciones y entradas.
- NUNCA mostrar precios ni contenido de planes en vistas publicas. Regla del dueño por competencia.
- Commit + push a main POR TANDA solo si `npm run build` pasa limpio. Si una tanda truena, documentala en RESULTADO.md y sigue con la siguiente.
- No borrar ni degradar funcionalidad existente (14 pantallas operativas). Solo sumar y pulir.

TANDA A — MINI LANDING PREMIUM + LEADS
1. Nueva landing publica en / : cinematografica, obsidiana, hero con nombre PREMMEX y mensaje de prevision funeraria digna (Capilla de Guadalupe, Tepatitlan, Jalisco). Secciones: quienes somos breve, beneficios GENERICOS (personal profesional, recoleccion y traslado, asesoria en tramites, atencion 24/7) SIN precios ni detalle de planes, testimonial/confianza, CTA formulario.
2. Formulario de leads: nombre, telefono, domicilio/colonia, mensaje opcional. POST a nueva API /api/leads que inserta en tabla leads (crearla: id, nombre, telefono, domicilio, mensaje, estado default 'nuevo', created_at). Confirmacion animada "un asesor te contactara".
3. Login se mueve a /acceso con la misma UI actual. Boton discreto "Acceso" en el nav de la landing. Redirects: usuarios ya logueados que entren a / van a su app.
4. En AdminApp: nuevo modulo Leads — lista con estado (nuevo/contactado/convertido/descartado), cambio de estado, telefono clicable (tel: y wa.me).

TANDA B — MAPAS (Leaflet + OpenStreetMap, sin API keys de pago)
1. Agregar lat/lng opcionales a clientes (ALTER TABLE si faltan) y campo direccion ya existente.
2. CobradorApp: mapa de la ruta del dia con pins de sus clientes (los que tengan coords), popup con nombre, saldo, dias de atraso y boton para registrar cobro. Import dinamico (next/dynamic ssr:false) y CSS de Leaflet importado correctamente (leccion Mitcan: importar leaflet/dist/leaflet.css y fijar iconos por URL CDN).
3. AdminApp: modulo Mapa general — todos los clientes geolocalizados, filtro por cobrador y por estado de pago (al corriente / atrasado), colores de pin segun estado.
4. En alta/edicion de cliente en admin: campos lat/lng con boton "usar mi ubicacion" (geolocation API) para capturar en campo.

TANDA C — PANEL ADMIN POWER-UP
1. Verificar y blindar matematica financiera: saldo = precio_plan - (inversion_inicial + bonificacion). Inversion inicial puede ser 0. Resumen calculado en vivo en alta de contrato. Regla confirmada por cliente 18-jun.
2. Numeracion contrato/solicitud consecutiva editable con validacion de duplicado en tiempo real: verificar que funciona tras merge 1e23950, corregir si no.
3. Reportes: cobranza por cobrador (cobrado hoy/semana/mes), contratos atrasados (dias de atraso, monto vencido), proyeccion de ingresos por aportaciones pactadas. Tarjetas + tablas, exportable a CSV.
4. Gestion de cancelaciones y reestructuracion: estado de contrato (activo/suspendido/cancelado), registro de motivo, y regla de negocio: cancelacion deja lo invertido como deposito a favor (clausula tercera de contratos).

TANDA D — GENERADOR PDF DE CONTRATOS
1. Insumo: PLANTILLA_SUPREMMEX_MAX.md, PLANTILLA_SUPREMMEX.md, PLANTILLA_PREMMEDIO.md, PLANTILLA_ECOMMEX.md (en la raiz). Son los contratos reales del cliente con merge fields <<[Campo]>>.
2. Crear ruta /api/contratos/[id]/pdf que renderiza HTML fiel a la plantilla del plan del contrato (texto completo, clausulas, tabla de beneficios de ESE plan) con los datos reales: NContrato, Solicitud, dia/mes/anio, cliente, domicilio, colonia, municipio, estado civil, ocupacion, plan, inversion total (numero y letra), inversion inicial, bonificacion, saldo, cuotas, aportacion, tipo de aportacion. Numero a letras en espanol (funcion propia, sin dependencia pesada).
3. Render a PDF server-side (playwright-core o @sparticuz/chromium si el peso lo permite en Vercel; si no, vista imprimible HTML con window.print y CSS @media print de pagina carta). Boton "Contrato PDF" en el detalle del contrato en admin.
4. Encabezado con telefono 378 138 26 70 y domicilio Vicente Guerrero #134 como en plantillas.

TANDA E — RECIBOS WHATSAPP
1. Al registrar un cobro, generar texto de recibo (folio, fecha, cliente, contrato, monto, saldo restante) y boton "Enviar por WhatsApp" que abre wa.me/52<telefono> con el texto urlencoded. Tambien boton copiar e imprimir (vista print del recibo).
2. En SocioApp: historial de pagos con opcion de ver/descargar recibo.

QA FINAL: npm run build limpio, probar login de los 3 roles con seeds, verificar landing publica sin precios, mapa carga sin romper SSR. Escribir /home/vagent/premmex-work/RESULTADO.md con: tandas completadas, commits, pendientes, y como probar cada cosa.
