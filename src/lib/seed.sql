-- Schema PREMMEX
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS contratos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS cobradores CASCADE;
DROP TABLE IF EXISTS paquetes CASCADE;

CREATE TABLE paquetes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  servicios JSONB,
  activo BOOLEAN DEFAULT true
);

CREATE TABLE cobradores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  zona VARCHAR(50),
  contratos_asignados INT DEFAULT 0,
  cobrado_mes DECIMAL(10,2) DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  colonia VARCHAR(100),
  municipio VARCHAR(100) DEFAULT 'Cancún',
  cobrador_id INT REFERENCES cobradores(id),
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contratos (
  id SERIAL PRIMARY KEY,
  folio VARCHAR(20) UNIQUE NOT NULL,
  cliente_id INT REFERENCES clientes(id),
  paquete_id INT REFERENCES paquetes(id),
  monto_total DECIMAL(10,2) NOT NULL,
  monto_mensual DECIMAL(10,2) NOT NULL,
  saldo_pendiente DECIMAL(10,2) NOT NULL,
  meses_pagados INT DEFAULT 0,
  dia_pago INT DEFAULT 5,
  fecha_inicio DATE DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  beneficiario VARCHAR(150),
  activo BOOLEAN DEFAULT true,
  estado VARCHAR(20) DEFAULT 'al_corriente',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  contrato_id INT REFERENCES contratos(id),
  cliente_id INT REFERENCES clientes(id),
  cobrador_id INT REFERENCES cobradores(id),
  monto DECIMAL(10,2) NOT NULL,
  metodo VARCHAR(20) DEFAULT 'efectivo',
  fecha TIMESTAMP DEFAULT NOW(),
  recibo_num VARCHAR(30),
  notas TEXT,
  enviado_whatsapp BOOLEAN DEFAULT false
);

-- SEED PAQUETES
INSERT INTO paquetes (nombre, descripcion, precio, servicios) VALUES
('Serenidad Básico', 'Servicio digno y accesible', 15000.00, '["Traslado local","Velación 24h","Ataúd básico","Trámites legales"]'),
('Paz Familiar', 'Paquete completo para toda la familia', 28000.00, '["Traslado ilimitado","Velación 48h","Ataúd premium","Trámites legales","Flores","Recordatorios"]'),
('Eternidad Plus', 'El mejor homenaje para quien más quieres', 45000.00, '["Traslado nacional","Velación 72h","Ataúd de lujo","Trámites legales","Flores premium","Transmisión en vivo","Nicho incluido"]');

-- SEED COBRADORES
INSERT INTO cobradores (nombre, telefono, zona, contratos_asignados, cobrado_mes) VALUES
('Roberto Méndez', '998-100-1001', 'Norte', 45, 18500.00),
('Carmen Lucía Torres', '998-100-1002', 'Sur', 38, 15200.00),
('Javier Hernández', '998-100-1003', 'Centro', 52, 22100.00),
('Daniela Ruiz', '998-100-1004', 'Oriente', 29, 11800.00);

-- SEED CLIENTES
INSERT INTO clientes (nombre, telefono, direccion, colonia, cobrador_id, lat, lng) VALUES
('María González Pérez', '998-200-0001', 'Av. Tulum 123', 'Centro', 1, 21.1619, -86.8515),
('José Luis Ramírez', '998-200-0002', 'Calle Jazmín 45', 'Jardines', 1, 21.1589, -86.8490),
('Ana Patricia Flores', '998-200-0003', 'Blvd. Kukulcán 78', 'Zona Hotelera', 2, 21.1045, -86.7818),
('Carlos Eduardo Morales', '998-200-0004', 'Av. López Portillo 200', 'Las Américas', 2, 21.1800, -86.8234),
('Lucía Martínez Vidal', '998-200-0005', 'Calle Cedro 12', 'Bonampak', 3, 21.1656, -86.8587),
('Roberto Silva Castro', '998-200-0006', 'Av. Cobá 340', 'Supermanzana 5', 3, 21.1634, -86.8512),
('Esperanza Díaz Núñez', '998-200-0007', 'Calle Orquídea 89', 'Región 96', 3, 21.1723, -86.8445),
('Fernando López Ayala', '998-200-0008', 'Av. Yaxchilán 56', 'Supermanzana 22', 4, 21.1598, -86.8478),
('Gloria Rosas Medina', '998-200-0009', 'Retorno 1 Flamboyan', 'Supermanzana 35', 4, 21.1612, -86.8502),
('Héctor Jiménez Luna', '998-200-0010', 'Av. Nichupté 123', 'Región 100', 1, 21.1745, -86.8380);

-- SEED CONTRATOS
INSERT INTO contratos (folio, cliente_id, paquete_id, monto_total, monto_mensual, saldo_pendiente, meses_pagados, beneficiario, fecha_vencimiento, estado) VALUES
('PMX-2024-001', 1, 2, 28000.00, 2800.00, 16800.00, 4, 'José González', '2027-01-15', 'al_corriente'),
('PMX-2024-002', 2, 1, 15000.00, 1500.00, 12000.00, 2, 'María Ramírez', '2026-09-10', 'atrasado'),
('PMX-2024-003', 3, 3, 45000.00, 4500.00, 36000.00, 2, 'Antonio Flores', '2027-11-22', 'al_corriente'),
('PMX-2024-004', 4, 2, 28000.00, 2800.00, 5600.00, 8, 'Rosa Morales', '2026-08-05', 'al_corriente'),
('PMX-2024-005', 5, 1, 15000.00, 1500.00, 7500.00, 5, 'Pablo Martínez', '2025-12-18', 'atrasado'),
('PMX-2024-006', 6, 2, 28000.00, 2800.00, 22400.00, 2, 'Carmen Silva', '2027-03-30', 'al_corriente'),
('PMX-2024-007', 7, 3, 45000.00, 4500.00, 0.00, 10, 'Luis Díaz', '2025-06-12', 'liquidado'),
('PMX-2024-008', 8, 1, 15000.00, 1500.00, 10500.00, 3, 'Teresa López', '2026-10-07', 'al_corriente'),
('PMX-2024-009', 9, 2, 28000.00, 2800.00, 19600.00, 3, 'Marcos Rosas', '2027-02-14', 'al_corriente'),
('PMX-2024-010', 10, 1, 15000.00, 1500.00, 3000.00, 8, 'Elena Jiménez', '2025-11-01', 'por_liquidar');

-- SEED PAGOS
INSERT INTO pagos (contrato_id, cliente_id, cobrador_id, monto, metodo, fecha, recibo_num) VALUES
(1, 1, 1, 2800.00, 'efectivo', NOW() - INTERVAL '5 days', 'REC-001'),
(2, 2, 1, 1500.00, 'transferencia', NOW() - INTERVAL '3 days', 'REC-002'),
(3, 3, 2, 4500.00, 'efectivo', NOW() - INTERVAL '1 day', 'REC-003'),
(4, 4, 2, 2800.00, 'mercado_pago', NOW() - INTERVAL '7 days', 'REC-004'),
(5, 5, 3, 1500.00, 'efectivo', NOW() - INTERVAL '2 days', 'REC-005'),
(6, 6, 3, 2800.00, 'efectivo', NOW(), 'REC-006'),
(8, 8, 4, 1500.00, 'transferencia', NOW() - INTERVAL '4 days', 'REC-007'),
(9, 9, 4, 2800.00, 'efectivo', NOW() - INTERVAL '6 days', 'REC-008'),
(10, 10, 1, 1500.00, 'mercado_pago', NOW(), 'REC-009'),
(1, 1, 1, 2800.00, 'efectivo', NOW() - INTERVAL '35 days', 'REC-010');
