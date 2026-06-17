-- =============================================
-- PREMMEX ERP — Schema completo
-- =============================================

DROP TABLE IF EXISTS recibos CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS contratos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS invitaciones CASCADE;
DROP TABLE IF EXISTS cobradores CASCADE;
DROP TABLE IF EXISTS planes CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Admins del sistema
CREATE TABLE admins (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nombre      TEXT NOT NULL,
  telefono    TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Planes funerarios reales
CREATE TABLE planes (
  id          SERIAL PRIMARY KEY,
  clave       TEXT NOT NULL UNIQUE,
  nombre      TEXT NOT NULL,
  traslado    TEXT NOT NULL,
  ataud       TEXT NOT NULL,
  descripcion TEXT,
  activo      BOOLEAN DEFAULT true
);

-- Cobradores (se registran por invitación)
CREATE TABLE cobradores (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nombre      TEXT NOT NULL,
  telefono    TEXT NOT NULL UNIQUE,
  password    TEXT,
  zona        TEXT,
  activo      BOOLEAN DEFAULT true,
  registrado  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Invitaciones de registro para cobradores
CREATE TABLE invitaciones (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cobrador_id TEXT REFERENCES cobradores(id),
  token       TEXT NOT NULL UNIQUE,
  usado       BOOLEAN DEFAULT false,
  expira_at   TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Clientes / titulares del contrato
CREATE TABLE clientes (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nombre      TEXT NOT NULL,
  telefono    TEXT,
  domicilio   TEXT,
  colonia     TEXT,
  municipio   TEXT DEFAULT 'Capilla de Guadalupe',
  estado      TEXT DEFAULT 'Jalisco',
  estado_civil TEXT,
  ocupacion   TEXT,
  cobrador_id TEXT REFERENCES cobradores(id),
  activo      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Contratos (financiamiento)
CREATE TABLE contratos (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ncontrato         TEXT NOT NULL UNIQUE,
  solicitud         TEXT,
  cliente_id        TEXT REFERENCES clientes(id),
  plan_id           INT  REFERENCES planes(id),
  beneficiario      TEXT,
  -- Financiamiento
  inversion_total   DECIMAL(10,2) NOT NULL,
  inversion_inicial DECIMAL(10,2) DEFAULT 0,
  bonificacion      DECIMAL(10,2) DEFAULT 0,
  saldo_pendiente   DECIMAL(10,2) NOT NULL,
  num_cuotas        INT NOT NULL,
  monto_cuota       DECIMAL(10,2) NOT NULL,
  tipo_aportacion   TEXT DEFAULT 'mensual',
  -- Control
  dia_pago          INT DEFAULT 1,
  fecha_inicio      DATE DEFAULT CURRENT_DATE,
  fecha_limite      DATE,
  meses_pagados     INT DEFAULT 0,
  estado            TEXT DEFAULT 'al_corriente',  -- al_corriente, atrasado, cancelado, liquidado
  -- Metadata
  cobrador_id       TEXT REFERENCES cobradores(id),
  activo            BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Pagos registrados
CREATE TABLE pagos (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  contrato_id   TEXT REFERENCES contratos(id),
  cliente_id    TEXT REFERENCES clientes(id),
  cobrador_id   TEXT REFERENCES cobradores(id),
  monto         DECIMAL(10,2) NOT NULL,
  metodo        TEXT DEFAULT 'efectivo',  -- efectivo, transferencia, tarjeta
  fecha         TIMESTAMPTZ DEFAULT NOW(),
  notas         TEXT,
  recibo_id     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Recibos generados
CREATE TABLE recibos (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  folio         TEXT NOT NULL UNIQUE,
  pago_id       TEXT REFERENCES pagos(id),
  contrato_id   TEXT REFERENCES contratos(id),
  cliente_id    TEXT REFERENCES clientes(id),
  monto         DECIMAL(10,2) NOT NULL,
  enviado_wa    BOOLEAN DEFAULT false,
  enviado_email BOOLEAN DEFAULT false,
  impreso       BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SEED
-- =============================================

-- Admin inicial
INSERT INTO admins (nombre, telefono, password) VALUES
('José Prudencio García', '3916100449', 'premmex2026');

-- Planes reales
INSERT INTO planes (clave, nombre, traslado, ataud, descripcion) VALUES
('ECOMMEX',      'ECOMMEX',      '50 km en Capilla de Guadalupe',              'Tapizada económico o metálico económico', 'Plan básico de previsión funeraria'),
('PREMMEDIO',    'PREMMEDIO',    '50 km en Capilla de Guadalupe',              'Pino tapa plana',                         'Plan intermedio de previsión funeraria'),
('SUPREMMEX',    'SUPREMMEX',    '100 km · Capilla, Tepatitlán y Guadalajara', 'Pino en bóveda',                          'Plan completo de previsión funeraria'),
('SUPREMMEX_MAX','SUPREMMEX MAX','100 km + opción cremación',                  'Pino en bóveda + urna básica',            'Plan premium con cremación incluida');

-- Cobradores demo (ya registrados)
INSERT INTO cobradores (id, nombre, telefono, password, zona, registrado) VALUES
('cob1', 'Juan Pérez Gómez',   '3911000001', 'cobrador1', 'Centro',  true),
('cob2', 'Rosa Hernández Ruiz','3911000002', 'cobrador2', 'Norte',   true),
('cob3', 'Miguel Torres Leal', '3911000003', 'cobrador3', 'Oriente', true);

-- Clientes demo
INSERT INTO clientes (id, nombre, telefono, domicilio, colonia, cobrador_id) VALUES
('cli1','María González Pérez', '3911100001','Av. Morelos 23',      'Centro',    'cob1'),
('cli2','José Ramírez Luna',    '3911100002','Calle Hidalgo 45',    'Centro',    'cob1'),
('cli3','Lucía Vázquez Torres', '3911100003','López Mateos 78',     'Guadalupe', 'cob1'),
('cli4','Carlos Medina Ramos',  '3911100004','Juárez 12',           'Centro',    'cob1'),
('cli5','Ana Flores Ruiz',      '3911100005','Insurgentes 34',      'Norte',     'cob2'),
('cli6','Roberto Sánchez Mora', '3911100006','Reforma 89',          'Norte',     'cob2'),
('cli7','Gloria Pérez Lara',    '3911100007','Av. Juárez 201',      'Oriente',   'cob3'),
('cli8','Ernesto Leal Moreno',  '3911100008','Calle Independencia 5','Centro',   'cob1');

-- Contratos demo
INSERT INTO contratos (ncontrato, cliente_id, plan_id, beneficiario, inversion_total, inversion_inicial, bonificacion, saldo_pendiente, num_cuotas, monto_cuota, dia_pago, fecha_inicio, fecha_limite, meses_pagados, estado, cobrador_id) VALUES
('PMX-2026-001','cli1',3,'Pedro González',    18000,2000,500,13000,10,1300,5,'2026-01-05','2026-10-05',4,'al_corriente','cob1'),
('PMX-2026-002','cli2',1,'Carmen Ramírez',     9000,1000,0,  7560, 8, 945, 1,'2026-02-01','2026-09-01',2,'atrasado',   'cob1'),
('PMX-2026-003','cli3',4,'Antonio Vázquez',   24000,3000,800,18200,12,1767,10,'2026-01-10','2027-01-10',3,'al_corriente','cob1'),
('PMX-2026-004','cli4',2,'Rosa Medina',       12000,1500,0,  8250, 9,1083,15,'2026-01-15','2026-10-15',4,'al_corriente','cob1'),
('PMX-2026-005','cli5',3,'Luis Flores',       18000,2000,500,4000, 10,1300,20,'2025-08-20','2026-06-20',9,'por_liquidar','cob2'),
('PMX-2026-006','cli6',1,'Teresa Sánchez',     9000,1000,0,  4725, 8, 945,25,'2025-12-25','2026-08-25',4,'al_corriente','cob2'),
('PMX-2026-007','cli7',2,'Jorge Pérez',       12000,1500,0, 12000,  9,1083,10,'2026-03-10','2027-01-10',0,'atrasado',   'cob3'),
('PMX-2026-008','cli8',3,'Sandra Leal',       18000,2000,500,    0, 10,1300,1,'2025-06-01','2026-03-01',10,'liquidado',  'cob1');

-- Pagos demo
INSERT INTO pagos (contrato_id, cliente_id, cobrador_id, monto, metodo, fecha) VALUES
('PMX-2026-001','cli1','cob1',1300,'efectivo',    NOW()-INTERVAL '5 days'),
('PMX-2026-002','cli2','cob1', 945,'transferencia',NOW()-INTERVAL '3 days'),
('PMX-2026-003','cli3','cob1',1767,'efectivo',    NOW()-INTERVAL '1 day'),
('PMX-2026-005','cli5','cob2',1300,'efectivo',    NOW()-INTERVAL '7 days'),
('PMX-2026-006','cli6','cob2', 945,'efectivo',    NOW()-INTERVAL '2 days'),
('PMX-2026-008','cli8','cob1',1300,'efectivo',    NOW()-INTERVAL '40 days');

-- Recibos demo
INSERT INTO recibos (folio, contrato_id, cliente_id, monto) VALUES
('REC-2026-001','PMX-2026-001','cli1',1300),
('REC-2026-002','PMX-2026-002','cli2', 945),
('REC-2026-003','PMX-2026-003','cli3',1767);
