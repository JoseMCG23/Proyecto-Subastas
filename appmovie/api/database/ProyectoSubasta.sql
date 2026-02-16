-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Proyecto_Subasta
-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `Proyecto_Subasta` DEFAULT CHARACTER SET utf8 ;
USE `Proyecto_Subasta` ;

-- -----------------------------------------------------
-- Table `Roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- -----------------------------------------------------
-- Table `Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(60) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `contraseña` VARCHAR(255) NOT NULL,
  `cedula` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `estado` VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  `fechaRegistro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rol_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `correo_UNIQUE` (`correo` ASC),
  UNIQUE INDEX `cedula_UNIQUE` (`cedula` ASC),
  INDEX `fk_usuario_rol_idx` (`rol_id` ASC),
  CONSTRAINT `fk_usuario_rol`
    FOREIGN KEY (`rol_id`)
    REFERENCES `Roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- -----------------------------------------------------
-- Table `Funko`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Funko` (
  `idFunko` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `estado` VARCHAR(20) NOT NULL,
  `condicion` VARCHAR(45) NOT NULL,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `vendedor_id` INT NOT NULL,
  `imagen_portada` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idFunko`),
  INDEX `fk_funko_usuario_vendedor_idx` (`vendedor_id` ASC),
  CONSTRAINT `fk_funko_usuario_vendedor`
    FOREIGN KEY (`vendedor_id`)
    REFERENCES `Usuario` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Categoria` (
  `idCategoria` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idCategoria`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- -----------------------------------------------------
-- Table `subasta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subasta` (
  `idsubasta` INT NOT NULL AUTO_INCREMENT,
  `funko_id` INT NOT NULL,
  `fechaInicio` DATETIME NOT NULL,
  `fechafin` DATETIME NOT NULL,
  `precioBase` DECIMAL(10,2) NOT NULL,
  `incre_minimo` DECIMAL(10,2) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idsubasta`),
  INDEX `fk_subasta_funko_idx` (`funko_id` ASC),
  CONSTRAINT `fk_subasta_funko`
    FOREIGN KEY (`funko_id`)
    REFERENCES `Funko` (`idFunko`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- -----------------------------------------------------
-- Table `Funko_Categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Funko_Categoria` (
  `funko_id` INT NOT NULL,
  `categoria_id` INT NOT NULL,
  PRIMARY KEY (`funko_id`, `categoria_id`),
  INDEX `fk_funko_categoria_categoria_idx` (`categoria_id` ASC),
  CONSTRAINT `fk_funko_categoria_funko`
    FOREIGN KEY (`funko_id`)
    REFERENCES `Funko` (`idFunko`),
  CONSTRAINT `fk_funko_categoria_categoria`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `Categoria` (`idCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- -----------------------------------------------------
-- Table `Puja`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Puja` (
  `idPuja` INT NOT NULL AUTO_INCREMENT,
  `subastaId` INT NOT NULL,
  `usuarioId` INT NOT NULL,
  `monto` DECIMAL(10,2) NOT NULL,
  `fechaYhora` DATETIME NOT NULL,
  PRIMARY KEY (`idPuja`),
  INDEX `fk_puja_subasta_idx` (`subastaId` ASC),
  INDEX `fk_puja_usuario_idx` (`usuarioId` ASC),
  CONSTRAINT `fk_puja_subasta`
    FOREIGN KEY (`subastaId`)
    REFERENCES `subasta` (`idsubasta`),
  CONSTRAINT `fk_puja_usuario`
    FOREIGN KEY (`usuarioId`)
    REFERENCES `Usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- -----------------------------------------------------
-- Table `Pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pago` (
  `idPago` INT NOT NULL AUTO_INCREMENT,
  `idUsuario` INT NOT NULL,
  `monto` DECIMAL(10,2) NOT NULL,
  `fecha_pago` DATETIME NOT NULL,
  `estado` VARCHAR(45) NULL,
  `idSubasta` INT NOT NULL,
  PRIMARY KEY (`idPago`),
  UNIQUE INDEX `idSubasta_UNIQUE` (`idSubasta` ASC),
  INDEX `fk_pago_usuario_idx` (`idUsuario` ASC),
  CONSTRAINT `fk_pago_usuario`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `Usuario` (`id`),
  CONSTRAINT `fk_pago_subasta`
    FOREIGN KEY (`idSubasta`)
    REFERENCES `subasta` (`idsubasta`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- -----------------------------------------------------
-- Table `Historial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Historial` (
  `idHistorial` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `fecha_evento` DATETIME NOT NULL,
  `monto` DECIMAL(10,2) NULL,
  `puja_id` INT NULL,
  `subasta_id` INT NULL,
  `pago_id` INT NULL,
  `tipo_evento` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idHistorial`),
  INDEX `fk_historial_usuario_idx` (`usuario_id` ASC),
  INDEX `fk_historial_puja_idx` (`puja_id` ASC),
  INDEX `fk_historial_subasta_idx` (`subasta_id` ASC),
  INDEX `fk_historial_pago_idx` (`pago_id` ASC),
  CONSTRAINT `fk_historial_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `Usuario` (`id`),
  CONSTRAINT `fk_historial_puja`
    FOREIGN KEY (`puja_id`)
    REFERENCES `Puja` (`idPuja`),
  CONSTRAINT `fk_historial_subasta`
    FOREIGN KEY (`subasta_id`)
    REFERENCES `subasta` (`idsubasta`),
  CONSTRAINT `fk_historial_pago`
    FOREIGN KEY (`pago_id`)
    REFERENCES `Pago` (`idPago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- -----------------------------------------------------
-- Table `Funko_Imagen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Funko_Imagen` (
  `idImagen` INT NOT NULL AUTO_INCREMENT,
  `funko_id` INT NOT NULL,
  `urlImagen` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idImagen`),
  INDEX `fk_funko_imagen_funko_idx` (`funko_id` ASC),
  CONSTRAINT `fk_funko_imagen_funko`
    FOREIGN KEY (`funko_id`)
    REFERENCES `Funko` (`idFunko`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Recuperacion_Contrasena`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Recuperacion_Contrasena` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `fecha_expiracion` DATETIME NOT NULL,
  `usado` TINYINT NOT NULL DEFAULT 0,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `token_UNIQUE` (`token` ASC),
  INDEX `fk_recuperacion_usuario_idx` (`usuario_id` ASC),
  CONSTRAINT `fk_recuperacion_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `Usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- -----------------------------------------------------
-- Insert tabla Roles
-- -----------------------------------------------------
INSERT INTO `Roles` (`nombre`) VALUES
('Administrador'),
('Vendedor'),
('Comprador');

select * from Roles;

-- --------------------------------------------------------

--
-- Insert Tabla Usuarios
--

INSERT INTO Usuario (nombre, apellido, correo, contraseña, cedula, direccion, estado,rol_id) VALUES
('Jose Mario', 'Cubillo Gutiérrez', 'cubillogutierrezjosemario@gmail.com', 'Admin123', '119520102', 'Lotes Llobet, El Carmen, Alajuela', 'ACTIVO', 1),
('Cristel Yuliana', 'Meléndez Jiménez', 'crmelendezji@est.utn.ac.cr', 'Marco123', '208830934', 'Alajuela Centro, Frente la sede de la UTN', 'ACTIVO', 1),
('Marco', 'Mora Gómez', 'MarcoMora@gmail.com', 'Yuli123', '123456789', 'San José Centro', 'INACTIVO', 2),
('Valery', 'Chavarría Sandi', 'Valeachava@gmail.com', 'Vale123', '987654321', 'Barrio Fatima, Heredia', 'ACTIVO', 2),
('Abraham Samuel', 'Vega Madrigal', 'abraham7930@gmail.com', 'Abraham123', '111111111', 'Invu Las Cañas, Alajuela Centro', 'INACTIVO', 3),
('Saray Tamara', 'Miranda Cubillo', 'tamaramiranda@gmail.com', 'Tamara123', '208780508', 'Las Vegas, El Roble, Alajuela', 'ACTIVO', 3);

SELECT * FROM Usuario;

-- -----------------------------------------------------
-- Insert tabla Categoria 
-- -----------------------------------------------------

INSERT INTO Categoria (nombre) VALUES
('Marvel'), 
('DC'), 
('Disney'), 
('Videojuegos'), 
('Star Wars'), 
('Anime'), 
('Fútbol'), 
('Serie'), 
('Exclusivo'),
('WWE');

SELECT * FROM Categoria;

-- -----------------------------------------------------
-- Insert tabla Funko 
-- -----------------------------------------------------

INSERT INTO Funko 
(nombre, descripcion, estado, condicion, vendedor_id, imagen_portada)
VALUES
('Funko Pop Miles Morales (Vibranium Suit)',
 'Nuevo traje, mismo héroe. Balanceándose por los aires, este exclusivo POP! Miles Morales (Traje de Vibranium) está en camino a salvar el día en tu colección Marvel.
 Reúne a tu equipo dando la bienvenida a este lanzatelarañas a tu alineación de superhéroes. El cabezón de vinilo mide aproximadamente 10,4 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 3,
 'MilesMorales.png'),

('Funko Pop Iron Man Mech',
 'En las infinitas posibilidades, aventúrate a explorar con la serie animada "¿Qué pasaría si…?" de Marvel Studios.
 Colecciona el robot de Iron Man POP! para completar tu set "¿Qué pasaría si…?". El cabezón de vinilo mide aproximadamente 12,4 cm de alto.',
 'DISPONIBLE',
 'SEMINUEVO',
 4,
 'IronMan.png'),

('Funko Pop Batman (DC New Classics)',
 'Conmemora a una leyenda de tu colección con POP! Batman. Dale un toque fresco a un clásico al añadir este superhéroe a tu colección de DC. 
 La figura de vinilo mide aproximadamente 10,9 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 3,
 'Batman.png'),
 
 
 ('Funko Pop Superman (DC New Classics)',
 'Conmemora a una leyenda de tu colección con POP! Superman. Dale un toque fresco a un clásico al añadir este héroe a tu colección de DC. 
 La figura de vinilo mide aproximadamente 11,9 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 4,
 'Superman.png'),
 
 ('Funko Pop Stitch Pirata',
 '¡Aloha! ¡Busca tesoros enterrados con este exclusivo POP! Pirata Stitch. Con su sombrero de calavera y huesos cruzados y su espada desenvainada, está listo para zarpar con estilo. 
 Este adorable experimento extraterrestre está deseando unirse a tu ohana, así que asegúrate de dejarle espacio en tu colección de Lilo y Stitch de Disney. La figura de vinilo mide aproximadamente 11,2 cm de alto.',
 'DISPONIBLE',
 'SEMINUEVO',
 4,
 'StitchPirata.png'),
 
 ('Funko Pop Nick Wilde',
 '¡Descifra un nuevo caso con POP! Nick Wilde! Este oficial busca traer seguridad y justicia a la ciudad de Zootopia, 
 así que asegúrate de reclutarlo para el Departamento de Policía de Zootopia (ZPD) en tu colección de Disney Zootopia 2. La figura de vinilo mide aproximadamente 10,9 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 3,
 'NickWilde.png'),
 
 ('Funko Pop Foxy El Pirata',
 '¿Sobrevivirá tu colección a la llegada de este Foxy el Pirata de Five Nights at Freddys? El resto de las figuras de FNAF estarán encantadas de verlo. 
 La figura de vinilo mide aproximadamente 10,8 cm (4,25 pulgadas) de alto.',
 'DISPONIBLE',
 'NUEVO',
 4,
 'Foxy.png'),
 
  ('Funko Pop Ekko',
 '¡La guerra entre Piltóver y Entrañas se intensifica! ¡Forma tu equipo y prepárate para la batalla con Ekko! 
 La figura de vinilo mide aproximadamente 11,6 cm de alto. No se garantiza recibir una persecución con la compra.',
 'DISPONIBLE',
 'SEMINUEVO',
 3,
 'Ekko.png'),
 
 ('Funko Pop Kylo Ren',
 '¡Asegura la victoria para la Primera Orden incorporando a este guerrero del lado oscuro a tu colección de Star Wars! El cabezón de vinilo mide aproximadamente 11,9 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 4,
 'KyloRen.png'),
 
('Funko Pop Luke Skywalker',
 'Celebra el 40.º aniversario del Retorno del Jedi con Luke Skywalker, que ha llegado al Palacio de Jabba el Hutt para rescatar a sus amigos. 
 Completa tu colección de Star Wars con este Caballero Jedi. El cabezón de vinilo mide aproximadamente 11,2 cm de alto.',
 'DISPONIBLE',
 'SEMINUEVO',
 3,
 'Luke.png'),
 
 ('Funko Pop Gengar',
 '¡Tu sueño de convertirte en Entrenador Pokemon está al alcance! Consigue esta figura de Gengar para añadirlo a tu colección Pokémon. 
 La figura de vinilo mide aproximadamente 8,8 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 4,
 'Gengar.png'),
 
('Funko Pop Goku (Ultra Instinto)',
 'Goku ha alcanzado un nuevo nivel de poder con su forma Ultra Instinto. Incorpora al guerrero Saiyan a tu colección de Dragon Ball Super y llévala al siguiente nivel. 
 La figura mide aproximadamente 9,5 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 3,
 'Goku.png'),
 
 ('Funko Pop Kylian Mbappé',
 '¡Incorpora a Kylian Mbappé, delantero del Paris Saint-Germain, a tu colección de fútbol internacional con esta figura de vinilo de aproximadamente 10,8 cm de alto!',
 'DISPONIBLE',
 'SEMINUEVO',
 4,
 'Mbappe.png'),
 
 ('Funko Pop Erling Haaland',
 '¡Anima al Manchester City FC! ¡Erling Haaland llega a la cancha con tu colección POP! 
 ¡Ayuda a tu equipo convirtiéndolo en el próximo jugador de tu equipo! La figura de vinilo mide aproximadamente 8,6 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 3,
 'Haaland.png'),
 
 ('Funko Pop Dustin Henderson',
 'Fuerzas oscuras acechan bajo Hawkins, Indiana. ¡Sean testigos de los peligrosos y sobrenaturales secretos del Mundo del Revés con Dustin Henderson!
 Lleva a casa los acontecimientos, personajes y momentos clave de la quinta y última temporada de Stranger Things haciendo de
 Dustin Henderson la próxima incorporación a tu colección de televisión!. La figura de vinilo mide aproximadamente 10,7 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 4,
 'Dustin.png'),
 
 ('Funko Pop Joel Miller',
 'Prepárate para enfrentarte a un mundo transformado tras el brote de Cordyceps con la figura de Joel Miller. Reúne a este superviviente con Ellie en tu colección
 Television convirtiéndolo en la próxima incorporación a tu colección de The Last of Us. La figura de vinilo mide aproximadamente 10,2 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 4,
 'JoelMiller.png'),
 
('Funko Pop Godzilla vs Mechagodzilla',
 '¡Una criatura trascendental se acerca a tu colección! Amplía tu colección de películas con este exclusiva figura de Godzilla vs Mechagodzilla,
 la siguiente incorporación a tu colección. La figura de vinilo mide aproximadamente 11,9 cm de alto.',
 'DISPONIBLE',
 'SEMINUEVO',
 3,
 'GodzillaVSMechaGodzilla.png'),
 
 ('Funko Pop Snoopy y Woodstock',
 '¡Dale un vistazo a este exclusiva figura de Snoopy y Woodstock! Dales a este adorable dúo un lugar para comer cuando les des la bienvenida a tu colección. 
 La figura de vinilo mide aproximadamente 12,2 cm de alto.',
 'DISPONIBLE',
 'SEMINUEVO',
 4,
 'SnoopyYWoodstock.png'),
 
 ('Funko Pop The American Nightmare” Cody Rhodes',
 '¡Cody Rhodes, la Pesadilla Americana, está aquí para hacer una entrada triunfal! 
 ¡Trae a esta superestrella de Diamante Brillante al ring para que pueda dar un espectáculo en tu colección de la WWE! 
 ¿A quién retará próximamente? La figura de vinilo mide aproximadamente 10,4 cm de alto.',
 'DISPONIBLE',
 'NUEVO',
 3,
 'CodyRhodes.png'),
 
 ('Funko Pop Bray Wyat',
 '¡Bray Wyatt™ sube al ring! ¡Celebra el 60.º aniversario de la WWE incorporando a este legendario luchador a tu colección! ¿A quién retará próximamente? La figura de vinilo mide aproximadamente 10 cm de alto.',
 'DISPONIBLE',
 'SEMINUEVO',
 4,
 'BrayWyatt.png');
 
 SELECT * FROM Funko;

-- -----------------------------------------------------
-- Insert tabla Funko Categoria
-- -----------------------------------------------------

INSERT INTO Funko_Categoria (funko_id, categoria_id) VALUES
-- Marvel
(1, 1),
(2, 1),

-- DC
(3, 2),
(4, 2),

-- Disney
(5, 3),
(6, 3),

-- Videojuegos
(7, 4),
(8, 4),

-- Star Wars
(9, 5),
(10, 5),

-- Anime
(11, 6), 
(12, 6), 

-- Deportes
(13, 7),
(14, 7),

-- Series
(15, 8), 
(16, 8),

-- Exclusivos
(17, 9),
(18, 9),

-- WWE
(19, 10),
(20, 10);

SELECT * FROM Funko_Categoria;

-- -----------------------------------------------------
-- Insert tabla Funko Imagen
-- -----------------------------------------------------
INSERT INTO Funko_Imagen (funko_id, urlImagen) VALUES
(1, 'MilesMorales.png'),
(2, 'IronMan.png'),

(3, 'Batman.png'),
(4, 'Superman.png'),

(5, 'StitchPirata.png'),
(6, 'NickWilde.png'),

(7, 'Foxy.png'),
(8, 'Ekko.png'),

(9, 'KyloRen.png'),
(10, 'Luke.png'),

(11, 'Gengar.png'),
(12, 'Goku.png'),

(13, 'Mbappe.png'),
(14, 'Haaland.png'),

(15, 'Dustin.png'),
(16, 'JoelMiller.png'),

(17, 'GodzillaVSMechaGodzilla.png'),
(18, 'SnoopyYWoodstock.png'),

(19, 'CodyRhodes.png'),
(20, 'BrayWyatt.png');

SELECT * FROM Funko_Imagen;

-- -----------------------------------------------------
-- Insert tabla Subasta
-- -----------------------------------------------------

INSERT INTO subasta (funko_id, fechaInicio, fechafin, precioBase, incre_minimo, estado) VALUES

(1, '2026-02-10 08:00:00', '2026-02-20 08:00:00', 15000, 500, 'ACTIVA'),
(2, '2026-02-11 09:00:00', '2026-02-21 09:00:00', 20000, 1000, 'ACTIVA'),
(3, '2026-02-12 10:00:00', '2026-02-22 10:00:00', 18000, 800, 'ACTIVA'),
(4, '2026-03-01 08:00:00', '2026-03-10 08:00:00', 17000, 500, 'INACTIVA'),
(5, '2026-03-02 09:00:00', '2026-03-11 09:00:00', 12000, 500, 'INACTIVA'),
(6, '2026-03-03 10:00:00', '2026-03-12 10:00:00', 14000, 700, 'INACTIVA'),
(7, '2026-01-01 08:00:00', '2026-01-10 08:00:00', 13000, 500, 'FINALIZADA'),
(8, '2026-01-05 08:00:00', '2026-01-15 08:00:00', 16000, 600, 'FINALIZADA'),
(9, '2026-01-08 08:00:00', '2026-01-18 08:00:00', 19000, 1000, 'CANCELADA');

SELECT * FROM subasta;

-- -----------------------------------------------------
-- Insert tabla Puja
-- -----------------------------------------------------

INSERT INTO Puja (subastaId, usuarioId, monto, fechaYhora) VALUES

-- SUBASTA 1
(1, 5, 15500, '2026-02-10 09:00:00'),
(1, 6, 16000, '2026-02-10 10:00:00'),
(1, 5, 17000, '2026-02-10 11:00:00'),

-- SUBASTA 2
(2, 6, 21000, '2026-02-11 10:00:00'),
(2, 5, 22000, '2026-02-11 11:30:00'),

-- SUBASTA 3
(3, 5, 18500, '2026-02-12 11:00:00'),

-- SUBASTA 7 (FINALIZADA)
(7, 6, 13500, '2026-01-02 09:00:00'),
(7, 5, 14000, '2026-01-02 10:00:00'),
(7, 6, 15000, '2026-01-02 11:00:00'),

-- SUBASTA 8 (FINALIZADA)
(8, 5, 16500, '2026-01-06 09:00:00'),
(8, 6, 17000, '2026-01-06 10:00:00'),

-- SUBASTA 9 (CANCELADA)
(9, 5, 19500, '2026-01-09 09:00:00');

SELECT * FROM Puja;