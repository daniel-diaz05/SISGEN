-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-11-2025 a las 05:34:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sisgen`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_meta`
--

CREATE TABLE `inventario_meta` (
  `id` tinyint(4) NOT NULL,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_meta`
--

INSERT INTO `inventario_meta` (`id`, `ultima_actualizacion`) VALUES
(1, '2025-11-06 22:16:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `tipo` enum('entrada','salida') NOT NULL,
  `cantidad` int(11) NOT NULL CHECK (`cantidad` > 0),
  `motivo` varchar(255) DEFAULT NULL,
  `usuario` varchar(120) DEFAULT NULL,
  `rol` enum('administrador','vendedor','cliente') DEFAULT 'administrador',
  `documento` varchar(255) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id`, `producto_id`, `tipo`, `cantidad`, `motivo`, `usuario`, `rol`, `documento`, `fecha`) VALUES
(1, 3, 'entrada', 1, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:06:49'),
(2, 2, 'entrada', 1, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:06:50'),
(3, 3, 'entrada', 1, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:09:54'),
(4, 2, 'entrada', 1, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:09:54'),
(5, 2, 'entrada', 12, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:20:39'),
(6, 2, 'entrada', 100, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:22:20'),
(7, 2, 'entrada', 11, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:22:27'),
(8, 3, 'entrada', 11, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:22:27'),
(9, 1, 'entrada', 10, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:22:27'),
(10, 13, 'entrada', 9, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:22:27'),
(11, 15, 'entrada', 16, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:22:27'),
(12, 2, 'entrada', 12, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:22:30'),
(13, 3, 'entrada', 14, 'compra aprobada', NULL, 'administrador', NULL, '2025-09-30 17:29:04'),
(14, 1, 'salida', 1, 'compra aprobada', NULL, 'administrador', NULL, '2025-10-01 04:40:56'),
(15, 3, 'salida', 1, 'compra aprobada', NULL, 'administrador', NULL, '2025-10-01 04:40:56'),
(16, 2, 'salida', 1, 'compra aprobada', NULL, 'administrador', NULL, '2025-10-01 04:40:57'),
(17, 36, 'salida', 10, 'compra aprobada', NULL, 'administrador', NULL, '2025-11-06 22:16:35'),
(18, 13, 'salida', 9, 'compra aprobada', NULL, 'administrador', NULL, '2025-11-06 22:16:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `producto` varchar(120) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(80) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `codigo` varchar(60) DEFAULT NULL,
  `precio_compra` int(11) NOT NULL DEFAULT 0,
  `precio_venta` int(11) NOT NULL DEFAULT 0,
  `imagen` varchar(255) DEFAULT NULL,
  `acciones` varchar(255) DEFAULT NULL,
  `carrito` tinyint(1) DEFAULT 0,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `producto`, `descripcion`, `categoria`, `stock`, `codigo`, `precio_compra`, `precio_venta`, `imagen`, `acciones`, `carrito`, `ultima_actualizacion`) VALUES
(1, 'Martillo', 'Martillo de carpintero con cabeza de acero forjado y mango de madera resistente, adecuado para clavar y reitrar clavos.', 'Herramientas manuales', 19, 'MART_01', 15000, 35000, 'martillo.jpg', 'editar, eliminar', 0, '2025-10-01 04:40:56'),
(2, 'Tornillo Philips 2\" pulgadas', 'Tornillo de acero inoxidable con cabeza Philips, ideal para unir piezas de madera y metal', 'Tornillería', 6136, 'TORN_01', 100, 300, 'tornillo.png', 'editar, eliminar', 0, '2025-10-01 04:40:57'),
(3, 'Taladro Inalámbrico 12V', 'Taladro inalámbrico con batería recargable de 12V, velocidad variable y función de reversa, ideal para perforación y atornillado.', 'Herramientas eléctricas', 126, 'TALA_01', 120000, 180000, 'taladro.png', 'editar, eliminar', 0, '2025-10-01 04:40:57'),
(13, 'Llave Ajustable 10 pulgadas', 'Llave ajustable de acero al carbono, con mordazas móviles para ajustarse a diferentes tamaños de tuercas y pernos', 'Herramientas manuales', 200, 'LLAV_01', 20000, 42000, 'llave.jpg', NULL, 0, '2025-11-06 22:16:35'),
(15, 'Broca para Concreto de 5/16\"', 'Broca de carburo de tungsteno, diseñada para perforar concreto y mampostería.', 'Accesorios para Herramientas', 200, 'BROC_01', 7500, 15000, 'broca_concreto.jpeg', NULL, 0, '2025-11-06 20:23:55'),
(36, 'Ejemplo 1', 'Descripción ejemplo', 'Categoría de ejemplo', 1490, 'EJ_01', 10000, 25000, '', NULL, 0, '2025-11-06 22:16:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id` int(11) NOT NULL,
  `solicitante` varchar(120) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `estado` enum('pendiente','aprobada','rechazada') NOT NULL DEFAULT 'pendiente',
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id`, `solicitante`, `motivo`, `estado`, `fecha`) VALUES
(6, 'Daniel', '', 'aprobada', '2025-08-27 06:53:12'),
(13, 'cliente1', NULL, 'pendiente', '2025-09-30 17:32:58'),
(14, 'desconocido', NULL, 'rechazada', '2025-09-30 18:50:05'),
(21, 'desconocido', NULL, 'pendiente', '2025-10-01 00:11:40'),
(22, 'daniel@correo.com', NULL, 'rechazada', '2025-10-01 00:50:37'),
(23, 'usuario@correo.com', NULL, 'aprobada', '2025-10-01 04:40:37'),
(24, 'usuario@correo.com', NULL, 'aprobada', '2025-11-06 22:15:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_items`
--

CREATE TABLE `solicitud_items` (
  `id` int(11) NOT NULL,
  `solicitud_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL CHECK (`cantidad` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitud_items`
--

INSERT INTO `solicitud_items` (`id`, `solicitud_id`, `producto_id`, `cantidad`) VALUES
(9, 6, 1, 1),
(22, 13, 3, 27),
(23, 14, 3, 7),
(24, 14, 2, 27),
(25, 14, 13, 9),
(32, 21, 13, 9),
(33, 22, 1, 2),
(34, 22, 3, 2),
(35, 22, 2, 2),
(36, 23, 1, 1),
(37, 23, 3, 1),
(38, 23, 2, 1),
(39, 24, 36, 10),
(40, 24, 13, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `creado` timestamp NOT NULL DEFAULT current_timestamp(),
  `rol` enum('admin','cliente') NOT NULL DEFAULT 'cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `creado`, `rol`) VALUES
(11, 'daniel', 'daniel@correo.com', '$2y$10$d.9CkGVwvZ.Zg55MyqOHDeGVHLc8ZYRB0/zwO0Rj6b9wuuD28z9ua', '2025-09-13 07:17:07', 'admin'),
(12, 'usuario', 'usuario@correo.com', '$2y$10$OaDks3cWp4y8tc2Nzr1EnuhRb/kAqLCpW/oiOXsk0AwUq1ufn45eS', '2025-09-15 23:07:46', 'cliente'),
(15, 'usuario', 'usuario1@correo.com', '$2y$10$irDUGHOx.UW68wj1x7NfNONIm.BbaP9hbZiUvRjBsk6UL8.IKN.0.', '2025-09-15 23:08:18', 'cliente'),
(16, 'cuenta', 'cuenta@correo.com', '$2y$10$1DIJVfnGeNLj9k.YNFP1EOonSmSX.Hk5J9IfjG5aIBZp54KVS1aEu', '2025-09-15 23:28:36', 'cliente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `inventario_meta`
--
ALTER TABLE `inventario_meta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `solicitud_items`
--
ALTER TABLE `solicitud_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `solicitud_id` (`solicitud_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `solicitud_items`
--
ALTER TABLE `solicitud_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `solicitud_items`
--
ALTER TABLE `solicitud_items`
  ADD CONSTRAINT `solicitud_items_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `solicitud_items_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
