-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-08-2025 a las 09:17:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

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
(1, '2025-08-27 06:25:31');

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
(1, 'Martillo carpintero', 'Martillo de carpintero con cabeza de acero forjado y mango de madera resistente, adecuado para clavar y reitrar clavos.', 'Herramientas manuales', 49, 'MART_01', 15000, 35000, 'martillo.jpg', 'editar, eliminar', 0, '2025-08-23 02:47:58'),
(2, 'Tornillo Philips 2\" pulgadas', 'Tornillo de acero inoxidable con cabeza Philips, ideal para unir piezas de madera y metal', 'Tornillería', 6000, 'TORN_01', 100, 250, 'tornillo.png', 'editar, eliminar', 0, '2025-08-23 03:02:28'),
(3, 'Taladro Inalámbrico 12V', 'Taladro inalámbrico con batería recargable de 12V, velocidad variable y función de reversa, ideal para perforación y atornillado.', 'Herramientas eléctricas', 100, 'TALA_01', 120000, 180000, 'taladro.png', 'editar, eliminar', 0, '2025-08-19 21:23:30'),
(13, 'Llave Ajustable 10 pulgadas', 'Llave ajustable de acero al carbono, con mordazas móviles para ajustarse a diferentes tamaños de tuercas y pernos', 'Herramientas manuales', 200, 'LLAV_01', 20000, 40000, 'llave.jpg', NULL, 0, '2025-08-23 04:05:31'),
(15, 'Broca para Concreto de 5/16\"', 'Broca de carburo de tungsteno, diseñada para perforar concreto y mampostería.', 'Accesorios para Herramientas', 200, 'BROC_01', 7000, 15000, 'broca_concreto.jpeg', NULL, 0, '2025-08-23 06:08:26');

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
(1, 'Daniel Diaz', '', 'pendiente', '2025-08-27 00:43:49'),
(2, 'Daniel D', '', 'aprobada', '2025-08-27 00:45:35'),
(3, 'Daniel Diaz', '', 'rechazada', '2025-08-27 00:46:11'),
(4, 'Daniel Diaz', '', 'aprobada', '2025-08-27 00:50:08'),
(5, 'Daniel Diaz', '', 'pendiente', '2025-08-27 01:36:51'),
(6, 'Daniel', '', 'aprobada', '2025-08-27 06:53:12');

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
(1, 1, 1, 1),
(2, 1, 3, 1),
(3, 1, 15, 3),
(4, 2, 15, 1),
(5, 3, 15, 1),
(6, 4, 15, 1),
(7, 5, 15, 1),
(8, 5, 1, 1),
(9, 6, 1, 1),
(10, 6, 13, 1);

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `solicitud_items`
--
ALTER TABLE `solicitud_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
