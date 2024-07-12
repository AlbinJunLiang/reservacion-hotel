-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db:3306
-- Tiempo de generación: 09-07-2024 a las 11:06:27
-- Versión del servidor: 9.0.0
-- Versión de PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `taller`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`%` PROCEDURE `cancelarReservacion` (IN `p_idReservacion` INT)   BEGIN
    DECLARE p_habitacion INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- En caso de error, hacer rollback de la transacción
        ROLLBACK;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Verificar si la reservación está activa
    IF (SELECT estado FROM Reservacion WHERE id = p_idReservacion) = 'ACTIVO' THEN
        -- Obtener el id de la habitación asociada a la reservación
        SELECT idHabitacion INTO p_habitacion 
        FROM Reservacion 
        WHERE id = p_idReservacion;
        
        -- Actualizar el estado de la reservación y la fecha de finalización
        UPDATE Reservacion
        SET estado = 'CANCELADO', fechaFinalizacion = NOW()
        WHERE id = p_idReservacion;
        
        -- Actualizar la disponibilidad de la habitación
        UPDATE Habitacion
        SET disponibilidad = 1 
        WHERE id = p_habitacion;
    END IF;

    -- Si todo va bien, confirmar la transacción
    COMMIT;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `eliminarCliente` (`_id` INT(1))   begin
    declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(id) into _cant from cliente where id = _id;
    if _cant > 0 then
        set _resp = 1;
        select count(id) into _cant from artefacto where idCliente = _id;
        if _cant = 0 then
            delete from cliente where id = _id;
        else 
            -- select 2 into _resp;
            set _resp = 2;
        end if;
    end if;
    select _resp as resp;
end$$

CREATE DEFINER=`root`@`%` PROCEDURE `iniciar_sesion` (`param_id` INT, `param_passw` VARCHAR(255))   BEGIN 
	SELECT idUsuario, rol FROM usuario WHERE id = param_id AND pasww = param_passw;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `liberarHabitaciones` ()   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al ejecutar la transacción';
    END;

    START TRANSACTION;

    -- Primero actualizamos las reservaciones expiradas
    UPDATE Habitacion AS h
    INNER JOIN Reservacion AS r ON h.id = r.idHabitacion
    SET h.disponibilidad = 1, r.estado = 'EXPIRADO'
    WHERE r.fechaFinalizacion <= NOW() AND r.estado = 'ACTIVO';

    -- Luego, liberamos las habitaciones de todas las reservaciones expiradas
    UPDATE Habitacion AS h
    INNER JOIN Reservacion AS r ON h.id = r.idHabitacion
    SET h.disponibilidad = 1
    WHERE r.fechaFinalizacion <= NOW() AND r.estado != 'ACTIVO';

    COMMIT;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `obtenerHabitacionesDisponibles` ()   BEGIN
    SELECT id, tipo, descripcion, cantidadHuesped, tarifa, imagen, disponibilidad
    FROM Habitacion
    WHERE disponibilidad = 1;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `registrar_reservacion` (IN `p_idCliente` VARCHAR(15), IN `p_idRecepcionista` VARCHAR(15), IN `p_idHabitacion` INT, IN `p_cantidadNoches` INT)   BEGIN

DECLARE p_montoFinal DECIMAL(10,2);
DECLARE p_fechaFinalizacion DATETIME;
DECLARE  p_fechaEntrada DATETIME;


    -- Verificar que la cantidad de noches sea positiva
    IF p_cantidadNoches <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '1';
    END IF;
    
  IF (SELECT disponibilidad FROM Habitacion WHERE id = p_idHabitacion) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '2';
    END IF;


set p_fechaEntrada = NOW();
SET  p_fechaFinalizacion = DATE_FORMAT(DATE_ADD(p_fechaEntrada, INTERVAL 3 DAY), '%Y-%m-%d 11:59:00');
    SELECT (tarifa * p_cantidadNoches) INTO p_montoFinal FROM Habitacion WHERE ID = p_idHabitacion;


    -- Insertar la reserva en la tabla Reservacion
    INSERT INTO Reservacion (idCliente, idRecepcionista, idHabitacion, fechaEntrada, cantidadNoches, fechaFinalizacion, montoFinal, estado)
    VALUES (p_idCliente, p_idRecepcionista, p_idHabitacion, p_fechaEntrada, p_cantidadNoches, p_fechaFinalizacion, p_montoFinal, "ACTIVO");
    
    UPDATE Habitacion
SET disponibilidad = 0
WHERE id = p_idHabitacion;

END$$

CREATE DEFINER=`root`@`%` PROCEDURE `verificarTokenR` (`_idUsuario` VARCHAR(15), `_tkR` VARCHAR(255))   begin
    select rol from usuario where idUsuario = _idUsuario and tkR = _tkR;
end$$

--
-- Funciones
--
CREATE DEFINER=`root`@`%` FUNCTION `modificarToken` (`_idUsuario` VARCHAR(100), `_tkR` VARCHAR(255)) RETURNS INT DETERMINISTIC READS SQL DATA begin
    declare _cant int;
    select count(idUsuario) into _cant from usuario where idUsuario = _idUsuario or correo = _idUsuario;
    if _cant > 0 then
        update usuario set
                tkR = _tkR
                where idUsuario = _idUsuario or correo = _idUsuario;
        if _tkR <> "" then
            update usuario set
                ultimoAcceso = now()
                where idUsuario = _idUsuario or correo = _idUsuario;
        end if;
    end if;
    return _cant;
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Administrador`
--

CREATE TABLE `Administrador` (
  `id` int NOT NULL,
  `idUsuario` varchar(15) COLLATE utf8mb3_spanish_ci NOT NULL,
  `nombre` varchar(30) COLLATE utf8mb3_spanish_ci NOT NULL,
  `apellido1` varchar(15) COLLATE utf8mb3_spanish_ci NOT NULL,
  `apellido2` varchar(15) COLLATE utf8mb3_spanish_ci NOT NULL,
  `telefono` varchar(9) COLLATE utf8mb3_spanish_ci NOT NULL,
  `celular` varchar(9) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb3_spanish_ci NOT NULL,
  `fechaIngreso` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `Administrador`
--

INSERT INTO `Administrador` (`id`, `idUsuario`, `nombre`, `apellido1`, `apellido2`, `telefono`, `celular`, `direccion`, `correo`, `fechaIngreso`) VALUES
(6, '279858585', 'Henao', 'Orejuela', 'Sanchez', '21852525', '21852525', 'Alla', '21852525@h.com', '2024-07-08 03:39:47'),
(8, '55682536', 'Gutierrez', 'Berenjena', 'Lucio', '56565658', '56565658', 'adsadsd', '56565658@h', '2024-07-08 04:03:16'),
(9, '55', 'Jola', 'Martínez', 'Sánchez', '987654321', '123456789', 'Avenida Central 456', 'a@email.com', '2024-04-17 17:39:56'),
(10, '655466565', 'kkjjk', 'nkmnnm', 'njn', '65566565', '65565655', '', 'jnhhj64@j', '2024-07-09 09:43:46'),
(12, '6556656565', 'sdffdsfds', 'dfsdfs', 'adfdf', '56656555', '56656555', 'lkmkllklklk', 'jnjnh@k', '2024-07-09 09:44:42'),
(14, '66', 'Jola', 'Martínez', 'Sánchez', '987654321', '123456789', 'Avenida Central 456', 'a@email.com', '2024-04-17 17:39:56'),
(15, '55555555', 'mkkjk', 'nnmmn', 'mkm', '55225252', '65566555', 'jkjkjkjjkjk', 'hu64@gmail.co', '2024-07-09 09:46:34'),
(16, '655665656', 'klkl', 'kkkllk', 'nnmnmn', '65456655', '45455445', 'kklkkjhjjhhj', 'bjjb@gmail.com', '2024-07-09 09:47:13');

--
-- Disparadores `Administrador`
--
DELIMITER $$
CREATE TRIGGER `eliminar_administrador` AFTER DELETE ON `Administrador` FOR EACH ROW BEGIN
    DELETE FROM usuario WHERE usuario.idUsuario = OLD.idUsuario;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Cliente`
--

CREATE TABLE `Cliente` (
  `id` int NOT NULL,
  `idUsuario` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `nombre` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `apellido1` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `apellido2` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `telefono` varchar(9) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `celular` varchar(9) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `direccion` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `correo` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `fechaIngreso` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `Cliente`
--

INSERT INTO `Cliente` (`id`, `idUsuario`, `nombre`, `apellido1`, `apellido2`, `telefono`, `celular`, `direccion`, `correo`, `fechaIngreso`) VALUES
(4, '888', 'Jola', 'Martínez', 'Sánchez', '987654321', '123456789', 'Avenida Central 456', 'a@email.com', '2024-04-17 17:39:56'),
(5, '88888888', 'Jola', 'Martínez', 'Sánchez', '987654321', '123456789', 'Avenida Central 456', 'a@email.com', '2024-04-17 17:39:56'),
(7, '56656565', 'kkjkj', 'kmkmkj', 'mkkjk', '56656565', '65656565', 'sdsdddssdds', 'jjj@d', '2024-07-09 09:41:48');

--
-- Disparadores `Cliente`
--
DELIMITER $$
CREATE TRIGGER `eliminar_cliente` AFTER DELETE ON `Cliente` FOR EACH ROW BEGIN

	DELETE FROM usuario WHERE usuario.idUsuario = OLD.id;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Habitacion`
--

CREATE TABLE `Habitacion` (
  `id` int NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `descripcion` text,
  `cantidadHuesped` int NOT NULL,
  `tarifa` decimal(10,2) NOT NULL,
  `imagen` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `disponibilidad` tinyint DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Habitacion`
--

INSERT INTO `Habitacion` (`id`, `tipo`, `descripcion`, `cantidadHuesped`, `tarifa`, `imagen`, `disponibilidad`) VALUES
(6, 'Doble', 'Habitación con dos camas individuales, baño privado y vista al mar.', 2, 120.50, 'https://www.hogarmania.com/archivos/201910/dormitorio-verde-caqui-muebles-madera-848x477x80xX.jpg', 1),
(7, 'Doble', 'Habitación con dos camas individuales, baño privado y vista al mar.', 2, 120.50, 'https://www.micamaabatible.es/blog/imagenes/Como-decorar-una-habitacion-juvenil-para-una-chica.jpg', 1),
(8, 'Normal', 'Habitacion corriente', 5, 5.02, 'https://st3.idealista.com/news/archivos/styles/fullwidth_xl/public/2023-08/images/comodo-dormitorio-moderno-elegante-cabecero-madera-generado-ia.jpg?VersionId=N4Kl1zjH0PijT8MbnFFV2pxJxxrxBUoT&itok=Fexg1LQ8', 1),
(9, 'jn', '', 45, 665.50, '65', 0),
(11, 'jh', 'Nkj', 6, 65.00, 's', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Recepcionista`
--

CREATE TABLE `Recepcionista` (
  `id` int NOT NULL,
  `idUsuario` varchar(15) COLLATE utf8mb3_spanish_ci NOT NULL,
  `nombre` varchar(30) COLLATE utf8mb3_spanish_ci NOT NULL,
  `apellido1` varchar(15) COLLATE utf8mb3_spanish_ci NOT NULL,
  `apellido2` varchar(15) COLLATE utf8mb3_spanish_ci NOT NULL,
  `telefono` varchar(9) COLLATE utf8mb3_spanish_ci NOT NULL,
  `celular` varchar(9) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb3_spanish_ci NOT NULL,
  `fechaIngreso` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `Recepcionista`
--

INSERT INTO `Recepcionista` (`id`, `idUsuario`, `nombre`, `apellido1`, `apellido2`, `telefono`, `celular`, `direccion`, `correo`, `fechaIngreso`) VALUES
(9, '999', 'Jola', 'Martínez', 'Sánchez', '987654321', '123456789', 'Avenida Central 456', 'a@email.com', '2024-04-17 17:39:56');

--
-- Disparadores `Recepcionista`
--
DELIMITER $$
CREATE TRIGGER `eliminar_recepcionista` AFTER DELETE ON `Recepcionista` FOR EACH ROW BEGIN
    DELETE FROM usuario WHERE usuario.idUsuario = OLD.idUsuario;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Reservacion`
--

CREATE TABLE `Reservacion` (
  `id` int NOT NULL,
  `idCliente` varchar(15) COLLATE utf8mb3_spanish_ci NOT NULL,
  `idRecepcionista` varchar(15) COLLATE utf8mb3_spanish_ci NOT NULL,
  `idHabitacion` int NOT NULL,
  `fechaEntrada` datetime NOT NULL,
  `cantidadNoches` int NOT NULL,
  `fechaFinalizacion` datetime DEFAULT NULL,
  `montoFinal` decimal(10,2) NOT NULL,
  `estado` varchar(30) COLLATE utf8mb3_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `Reservacion`
--

INSERT INTO `Reservacion` (`id`, `idCliente`, `idRecepcionista`, `idHabitacion`, `fechaEntrada`, `cantidadNoches`, `fechaFinalizacion`, `montoFinal`, `estado`) VALUES
(49, '12345674', '88888888', 7, '2024-07-09 05:40:46', 5, '2024-07-01 11:59:00', 602.50, 'EXPIRADO'),
(54, '88888888', '88888888', 6, '2024-07-09 06:10:51', 5, '2024-07-09 06:11:25', 602.50, 'CANCELADO'),
(55, '88888888', '88888888', 8, '2024-07-09 06:20:29', 6, '2024-07-09 06:20:41', 30.12, 'CANCELADO'),
(56, '88888888', '88888888', 6, '2024-07-09 06:22:19', 9, '2024-07-09 06:22:38', 1084.50, 'CANCELADO'),
(57, '88888888', '88888888', 8, '2024-07-09 06:27:12', 65, '2024-07-12 11:59:00', 326.30, 'ACTIVO'),
(63, '88888888', '88888888', 6, '2024-07-09 06:20:41', 5, '2024-07-09 06:20:41', 50.00, 'EXPIRADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int NOT NULL,
  `idUsuario` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `rol` int NOT NULL,
  `passw` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `ultimoAcceso` datetime DEFAULT NULL,
  `correo` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `tkR` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `idUsuario`, `rol`, `passw`, `ultimoAcceso`, `correo`, `tkR`) VALUES
(3, '12345678', 4, '$2y$10$.wt938fmTHL8R/7lVFWWweW1ISPJNrnkHnqCjNVDSfhVrU9uTRgMK', NULL, 'Lrxs@gmail.com', NULL),
(4, '23456785', 4, '$2y$10$uMk0PWriO95b9.ckF7Pio.IZJExSwTCNh3CLoPDnm7WMCitGZeExW', NULL, 'ds@gmail.com', NULL),
(9, '12345674', 4, '$2y$10$JInX0tV4fmcAwmBbHEL7pOprdAfK6JEpbKQ9jvtHqEtZTlQLHNVWe', NULL, 'jj@gmail.com', NULL),
(15, '12345675', 4, '$2y$10$7mxp1j44aTdvMqGUmIIdauzUco0Q1pGPsQGmGDa9q4h8iZInb7Qn2', NULL, '12345678@jk', NULL),
(19, '65656565', 4, '$2y$10$GuEwPCKgOBvUZadL9yGnZeNhTnCrmKK9UJ9t9.yWUIfLuJV6W6VpW', NULL, 'Liuia4@gmail.com', NULL),
(21, '12345671', 4, '$2y$10$3vf.OI8jppHCtP1iUGHSMOTp3niCy4siWoHQbIN1w1007EZy6DkGq', NULL, '12345674@gmailc.ocm', NULL),
(22, '88', 4, '$2y$10$9M2kYjivE58cpLw7qN3XCuSZhae3/cZmQfgUL.YR5VxCCjWQv.2Vy', NULL, 'a@email.com', NULL),
(27, '868', 1, '$2y$10$pGue17/jO4C2sl3.xd620es.v8XpvciUDey6kI6O7y0QR4bIjwzyC', NULL, 'a@email.com', NULL),
(35, '888556', 4, '$2y$10$iFOL/PjqBXk15zL3oJLHv.lUHtLEwOhOHfNWdESSguFu3C86qVO5i', NULL, 'a@email.com', NULL),
(38, '88855', 4, '$2y$10$/AGnr2.83RO1Nrk4P0pOX.zooxnxN2JZ/0PINsbs8Cd70iLpbxvUi', NULL, 'a@email.com', NULL),
(40, '111', 4, '$2y$10$vD2B4rvDOeZw3W58.bgioejuj3PiRFBu9hbEeSl7SW7PjuKBIHSfG', NULL, 'a@email.com', NULL),
(42, '58963695', 4, '$2y$10$mDmU5MlhgFmCT1bKMdOygexAY2O.sb9gPELLVr.luHdD6xWezFCKa', NULL, 'sd@gmail.com', NULL),
(44, '5', 1, '$2y$10$kkmUrMCjqXvdA2/a8sb3KesJ2Zo0KG56tmu.YfSNkZZOlbUgIALNW', NULL, 'a@email.com', NULL),
(45, '58', 4, '$2y$10$dI44iTxPZjGJtb8m2yDo6OvzHEZILaYNVkQmLXUlbXuvtFj5lceNK', NULL, 'a@email.com', NULL),
(48, '585', 4, '$2y$10$dps9NXcBHh3f8cg9V058yeCKLWx/B3OSMkqNAhhGYTv0aPIwwxyXi', NULL, 'a@email.com', NULL),
(49, '235', 4, '$2y$10$tInYXUEUvOClhPZD24z2yOBZ/UhZKtMIQNi5BvoCQnviyMm98nvbC', NULL, 'a@email.com', NULL),
(52, '23885', 4, '$2y$10$Y8Zh.7C5OKdr.yWh226XreiKi6bZ19aharxNRXSUZUWNe7wEdJI9m', NULL, 'a@email.com', NULL),
(54, '555', 1, '$2y$10$DtnslvT19OsMw/9uHPaMMuOT02rrCJ.se7ogpjeouCsP34JRv.ozW', NULL, 'a@email.com', NULL),
(59, '55665665', 4, '$2y$10$OXjtVJZELxR0dfS2eRVfbO82MGxQ3Jsbyh7qIE5.m0/Nx50xHDg/W', NULL, 'kk@gmail.com', NULL),
(60, '658585855', 4, '$2y$10$d9FHof2sizEBlsNSg10Guu2PhT0trMhm05U0aCqTwkIOUbxH6KBai', NULL, '12345678@gmail.com', NULL),
(62, '55568585', 4, '$2y$10$R/12LwvgytClLH02WejjiuDvFFD35YLcvc5g1PFhO5T7s4r1o76D6', NULL, 'uhuh@gmail.com', NULL),
(63, '58585858', 4, '$2y$10$oxRiGCxs8NalA7BED4ZZIe33rMl79J0ZZ2kImRLAg63WqgHvv/K.i', NULL, '25252525@d', NULL),
(64, '888888888', 4, '$2y$10$xaD.OOxDHczbmD6OSyiuM.sFK9P4QmUOwbAVxqZg/HMEjZNTmKdjG', NULL, '12345678@gmail.com', NULL),
(67, '279858585', 1, '$2y$10$gm92Ck1MKRZUZgis6k1Lgeg4TTaLjVmBh7h/oLiNHZ6v0MogT/ulG', NULL, '21852525@h.com', NULL),
(69, '55682536', 1, '$2y$10$/lbOnqAP4homi4coP2vk9.o1qCtqpw56t3ZjQl/wYKLjQwj9zUWcC', NULL, '56565658@h', NULL),
(70, '55', 1, '$2y$10$m40BDh95igKvVEFYYk.Fu.W8vQZg5C9XdF46m3r.owUMy4jWOGALG', '2024-07-09 10:33:49', 'a@email.com', ''),
(74, '888', 4, '$2y$10$eJ3c9ypN5OrygI.8QyRoJ.YFXMDe50FIm1cOC8xoSeRXWL1j4uuCW', '2024-07-09 08:24:14', 'a@email.com', ''),
(78, '999', 3, '$2y$10$dC.Xj2NDAvwQPFxSJ9pfHeXRkrAdZGa/5egXliW/mx/t4mLUU6Okq', '2024-07-09 04:30:42', 'a@email.com', ''),
(79, '88888888', 4, '$2y$10$OePlSwm7Wxm26I.Uin5ykOufzRzdduOyFuiHLw3HIw1AJe135oBGi', '2024-07-09 06:26:41', 'a@email.com', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3ZWItZGF0b3MiLCJpYXQiOjE3MjA1MDY0MDEsInJvbCI6NCwibm9tIjoiSm9sYSJ9.JMg1-7nKT6A2xbQRoNjZbN8i70rC80ptgKxC59jwWbM'),
(80, '569696955', 4, '$2y$10$NEE3LbPlvrM42lCuvA9XxutoRvUOfPp5MsrRvWbqzzk.uCGPcCnnG', NULL, 'sdfghjk@gmail.com', NULL),
(81, '56656565', 4, '$2y$10$uQoUv4qMUD9sVD259W8.U.3ZzMM4M1gdlVXzesuWUcNa/L8cNUBpK', NULL, 'jjj@d', NULL),
(82, '655466565', 1, '$2y$10$ZPRXOwt9GTPUEVaQvihc7O6XXv7D2kQ/I4uGh6ZgdauSjOUE/bhK.', NULL, 'jnhhj64@j', NULL),
(83, '6556656565', 1, '$2y$10$0GDFJDR9VSAIVdx1Gj3mAeiNQhHKTtphtgsnaQjikGhr36xWc8iFW', NULL, 'jnjnh@k', NULL),
(84, '66', 1, '$2y$10$HG17MLgoxFdLiNekt.nmOOfDp3.QXIMFwHBnP91383U4iy7Cbj3xW', NULL, 'a@email.com', NULL),
(85, '55555555', 1, '$2y$10$E9Kooy57Xwf5vqHgD2UZYOyzV8EfmAbkbtiKodVhRoAM7HY4qwxlm', NULL, 'hu64@gmail.co', NULL),
(86, '655665656', 1, '$2y$10$FGVMlKGBjuShg6E1f1DotuQrcOnP6MD0Xr5LYQx1hi0BX6QByh.4a', NULL, 'bjjb@gmail.com', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Administrador`
--
ALTER TABLE `Administrador`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `Cliente`
--
ALTER TABLE `Cliente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idUsuario` (`idUsuario`),
  ADD UNIQUE KEY `idUsuario_2` (`idUsuario`);

--
-- Indices de la tabla `Habitacion`
--
ALTER TABLE `Habitacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Recepcionista`
--
ALTER TABLE `Recepcionista`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `Reservacion`
--
ALTER TABLE `Reservacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCliente` (`idCliente`),
  ADD KEY `idRecepcionista` (`idRecepcionista`),
  ADD KEY `idHabitacion` (`idHabitacion`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_Usuario` (`idUsuario`),
  ADD UNIQUE KEY `idUsuario` (`idUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Administrador`
--
ALTER TABLE `Administrador`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `Cliente`
--
ALTER TABLE `Cliente`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `Habitacion`
--
ALTER TABLE `Habitacion`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `Recepcionista`
--
ALTER TABLE `Recepcionista`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `Reservacion`
--
ALTER TABLE `Reservacion`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Reservacion`
--
ALTER TABLE `Reservacion`
  ADD CONSTRAINT `reservacion_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `Usuario` (`idUsuario`),
  ADD CONSTRAINT `reservacion_ibfk_2` FOREIGN KEY (`idRecepcionista`) REFERENCES `Usuario` (`idUsuario`),
  ADD CONSTRAINT `reservacion_ibfk_3` FOREIGN KEY (`idHabitacion`) REFERENCES `Habitacion` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
