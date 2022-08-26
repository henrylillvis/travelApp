-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema matkasovellus
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema matkasovellus
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `matkasovellus` DEFAULT CHARACTER SET utf8 ;
USE `matkasovellus` ;

-- -----------------------------------------------------
-- Table `matkasovellus`.`matkaaja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `matkasovellus`.`matkaaja` ;

CREATE TABLE IF NOT EXISTS `matkasovellus`.`matkaaja` (
  `idmatkaaja` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `etunimi` VARCHAR(45) NULL,
  `sukunimi` VARCHAR(45) NULL,
  `nimimerkki` VARCHAR(45) NULL,
  `paikkakunta` VARCHAR(45) NULL,
  `esittely` VARCHAR(500) NULL,
  `kuva` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `password` VARCHAR(200) NULL,
  PRIMARY KEY (`idmatkaaja`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matkasovellus`.`matkakohde`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `matkasovellus`.`matkakohde` ;

CREATE TABLE IF NOT EXISTS `matkasovellus`.`matkakohde` (
  `idmatkakohde` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `kohdenimi` VARCHAR(45) NULL,
  `maa` VARCHAR(45) NULL,
  `paikkakunta` VARCHAR(45) NULL,
  `kuvausteksti` VARCHAR(500) NULL,
  `kuva` VARCHAR(45) NULL,
  PRIMARY KEY (`idmatkakohde`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matkasovellus`.`matka`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `matkasovellus`.`matka` ;

CREATE TABLE IF NOT EXISTS `matkasovellus`.`matka` (
  `idmatkaaja` INT UNSIGNED NOT NULL,
  `alkupvm` DATE NULL,
  `loppupvm` DATE NULL,
  `yksityinen` TINYINT NULL,
  `idmatka` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`idmatka`),
  INDEX `fk_matkaaja_has_matkakohde_matkaaja_idx` (`idmatkaaja` ASC) VISIBLE,
  CONSTRAINT `fk_matkaaja_has_matkakohde_matkaaja`
    FOREIGN KEY (`idmatkaaja`)
    REFERENCES `matkasovellus`.`matkaaja` (`idmatkaaja`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `matkasovellus`.`tarina`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `matkasovellus`.`tarina` ;

CREATE TABLE IF NOT EXISTS `matkasovellus`.`tarina` (
  `idmatkakohde` INT UNSIGNED NOT NULL,
  `pvm` DATE NOT NULL,
  `teksti` VARCHAR(500) NULL,
  `idmatka` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idmatkakohde`, `idmatka`),
  INDEX `fk_tarina_matkakohde1_idx` (`idmatkakohde` ASC) VISIBLE,
  INDEX `fk_tarina_matka1_idx` (`idmatka` ASC) VISIBLE,
  CONSTRAINT `fk_tarina_matkakohde1`
    FOREIGN KEY (`idmatkakohde`)
    REFERENCES `matkasovellus`.`matkakohde` (`idmatkakohde`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tarina_matka1`
    FOREIGN KEY (`idmatka`)
    REFERENCES `matkasovellus`.`matka` (`idmatka`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `matkasovellus`.`kuva`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `matkasovellus`.`kuva` ;

CREATE TABLE IF NOT EXISTS `matkasovellus`.`kuva` (
  `idkuva` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `kuva` VARCHAR(45) NULL,
  `tarina_idmatkakohde` INT UNSIGNED NOT NULL,
  `tarina_idmatka` INT UNSIGNED NOT NULL,
  INDEX `fk_kuva_tarina1_idx` (`tarina_idmatkakohde` ASC, `tarina_idmatka` ASC) VISIBLE,
  PRIMARY KEY (`idkuva`),
  CONSTRAINT `fk_kuva_tarina1`
    FOREIGN KEY (`tarina_idmatkakohde` , `tarina_idmatka`)
    REFERENCES `matkasovellus`.`tarina` (`idmatkakohde` , `idmatka`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `matkasovellus`.`matkaaja`
-- -----------------------------------------------------
START TRANSACTION;
USE `matkasovellus`;
INSERT INTO `matkasovellus`.`matkaaja` (`idmatkaaja`, `etunimi`, `sukunimi`, `nimimerkki`, `paikkakunta`, `esittely`, `kuva`, `email`, `password`) VALUES (1, 'Jari', 'Partanen', 'Jape1', 'Kuopio', 'Morjesta poytaan!', 'user/jape.jpg', 'jape@example.com', '$2b$10$c7Ald7dJV7LlLvQvfv2WU.6ibY/9BM.sUdntAXlXUy9yDZH5Gnu9i');
INSERT INTO `matkasovellus`.`matkaaja` (`idmatkaaja`, `etunimi`, `sukunimi`, `nimimerkki`, `paikkakunta`, `esittely`, `kuva`, `email`, `password`) VALUES (2, 'Mari', 'Partanen', 'Mape1', 'Kuopio', 'Morjesta poytaan!', 'user/mari.jpg', 'mape@example.com', '$2b$10$mvv/XiWbYAp7RcwWNvJ5NevfO8wNF6Tkh9ZvSBuGmHJmiLXNpREDy');
INSERT INTO `matkasovellus`.`matkaaja` (`idmatkaaja`, `etunimi`, `sukunimi`, `nimimerkki`, `paikkakunta`, `esittely`, `kuva`, `email`, `password`) VALUES (3, 'Jonne', 'Paukkonen', 'Jonne_', 'Turku', 'Morjesta poytaan!', 'user/jonne.jpg', 'jonne@example.com', '$2b$10$gq/zxgOz3tb/1a0r2lm9Du8mYQJM2/gwHY1dYIOxUkO86uzRqjoWW');
INSERT INTO `matkasovellus`.`matkaaja` (`idmatkaaja`, `etunimi`, `sukunimi`, `nimimerkki`, `paikkakunta`, `esittely`, `kuva`, `email`, `password`) VALUES (4, 'Martti', 'Virtanen', 'Virtis_Martti', 'Nivala', 'Morjesta poytaan!', 'user/martti.jpg', 'mavi@example.com', '$2b$10$mn8Bv8nR/scK.xcdDirzkO1VoLp1KhZA8u5CfQf3VCYNEsaiDulmO');
INSERT INTO `matkasovellus`.`matkaaja` (`idmatkaaja`, `etunimi`, `sukunimi`, `nimimerkki`, `paikkakunta`, `esittely`, `kuva`, `email`, `password`) VALUES (5, 'Jari', 'Korhonen', 'korjari', 'Pielavesi', 'Morjesta poytaan!', 'user/korhonen.jpg', 'jari@example.com', '$2b$10$pbOenJl1nHdumJOPTXbsQ.P4li4trtRH/tpeVUwa8yB5IicF4OiJS');
INSERT INTO `matkasovellus`.`matkaaja` (`idmatkaaja`, `etunimi`, `sukunimi`, `nimimerkki`, `paikkakunta`, `esittely`, `kuva`, `email`, `password`) VALUES (6, 'Katja', 'Nissinen', 'Katju123', 'Leppavirta', 'Morjesta poytaan!', 'user/katja.jpg', 'katja@example.com', '$2b$10$P0YUsmQfCeEaE8l93wHSZ.d7ob5wRzu5nZw5qX4uNsK.O3IwtKiy2');
INSERT INTO `matkasovellus`.`matkaaja` (`idmatkaaja`, `etunimi`, `sukunimi`, `nimimerkki`, `paikkakunta`, `esittely`, `kuva`, `email`, `password`) VALUES (7, 'Niina', 'Markkanen', 'Niima4', 'Joroinen', 'Morjesta poytaan!', 'user/niina.jpg', 'niina@example.com', '$2b$10$ge4zKYujcuPbodzgwtypuuXPGntIV3QIjF3jUJLPFlUgrRHToY34S');
INSERT INTO `matkasovellus`.`matkaaja` (`idmatkaaja`, `etunimi`, `sukunimi`, `nimimerkki`, `paikkakunta`, `esittely`, `kuva`, `email`, `password`) VALUES (8, 'Jaakko', 'Suhonen', '1jaakko2', 'Helsinki', 'Morjesta poytaan!', 'user/jaakko.jpg', 'jaakko2@example.com', '$2b$10$bpV7aCQh/Wa70V7kq1Ooy.CeWjpUgPp5gCs9veikLTJfqbxr451P6');
INSERT INTO `matkasovellus`.`matkaaja` (`idmatkaaja`, `etunimi`, `sukunimi`, `nimimerkki`, `paikkakunta`, `esittely`, `kuva`, `email`, `password`) VALUES (9, 'Olavi', 'Pennanen', 'Olavi_matkaaja', 'Joensuu', 'Morjesta poytaan!', 'user/olavi.jpg', 'olavi4@example.com', '$2b$10$c1CR9VATtouOqDL074J/6eP/k6ztRK3j0bpGo1OizlGWm3jeoc5sa');
INSERT INTO `matkasovellus`.`matkaaja` (`idmatkaaja`, `etunimi`, `sukunimi`, `nimimerkki`, `paikkakunta`, `esittely`, `kuva`, `email`, `password`) VALUES (10, 'Tuula', 'Miettinen', 'Tuulamiettiii', 'Kuopio', 'Morjesta poytaan!', 'user/tuula.jpg', 'tuula@example.com', '$2b$10$lZIJ1d3UBHry.0GNGjasUeLTNWxtda4mG2HVvrljgHkI1UU2DekK.');

COMMIT;


-- -----------------------------------------------------
-- Data for table `matkasovellus`.`matkakohde`
-- -----------------------------------------------------
START TRANSACTION;
USE `matkasovellus`;
INSERT INTO `matkasovellus`.`matkakohde` (`idmatkakohde`, `kohdenimi`, `maa`, `paikkakunta`, `kuvausteksti`, `kuva`) VALUES (1, 'Kuopion tori', 'Suomi', 'Pohjois-Savo', 'Muailman napa', 'place/kuopiontori.jpg');
INSERT INTO `matkasovellus`.`matkakohde` (`idmatkakohde`, `kohdenimi`, `maa`, `paikkakunta`, `kuvausteksti`, `kuva`) VALUES (2, 'Senaatintori', 'Suomi', 'Uusimaa', 'Tuomionkirkon juurella', 'place/senaatintori.jpg');
INSERT INTO `matkasovellus`.`matkakohde` (`idmatkakohde`, `kohdenimi`, `maa`, `paikkakunta`, `kuvausteksti`, `kuva`) VALUES (3, 'Helsingin päärautatieasema', 'Suomi', 'Uusimaa', 'Nähtävyys parhaimmillaan', 'place/rautatieasema.jpg');
INSERT INTO `matkasovellus`.`matkakohde` (`idmatkakohde`, `kohdenimi`, `maa`, `paikkakunta`, `kuvausteksti`, `kuva`) VALUES (4, 'Eduskunta', 'Suomi', 'Uusimaa', 'Nähtävyys parhaimmillaan', 'place/placeholder.jpg');
INSERT INTO `matkasovellus`.`matkakohde` (`idmatkakohde`, `kohdenimi`, `maa`, `paikkakunta`, `kuvausteksti`, `kuva`) VALUES (5, 'Kiasma', 'Suomi', 'Uusimaa', 'Nykytaiteen museo', 'place/kiasma.jpg');
INSERT INTO `matkasovellus`.`matkakohde` (`idmatkakohde`, `kohdenimi`, `maa`, `paikkakunta`, `kuvausteksti`, `kuva`) VALUES (6, 'Puijon torni', 'Suomi', 'Pohjois-Savo', 'Kuopiossa', 'place/placeholder.jpg');
INSERT INTO `matkasovellus`.`matkakohde` (`idmatkakohde`, `kohdenimi`, `maa`, `paikkakunta`, `kuvausteksti`, `kuva`) VALUES (7, 'Mikontalo', 'Suomi', 'Pirkanmaa', 'Hervannan parasta antia', 'place/mikontalo.jpg');
INSERT INTO `matkasovellus`.`matkakohde` (`idmatkakohde`, `kohdenimi`, `maa`, `paikkakunta`, `kuvausteksti`, `kuva`) VALUES (8, 'Hotelli Joronjälki', 'Suomi', 'Etelä-savo', 'Terveisiä Auvolle', 'place/placeholder.jpg');

COMMIT;


-- -----------------------------------------------------
-- Data for table `matkasovellus`.`matka`
-- -----------------------------------------------------
START TRANSACTION;
USE `matkasovellus`;
INSERT INTO `matkasovellus`.`matka` (`idmatkaaja`, `alkupvm`, `loppupvm`, `yksityinen`, `idmatka`) VALUES (1, '2013-09-30', '2014-06-14', false, 1);
INSERT INTO `matkasovellus`.`matka` (`idmatkaaja`, `alkupvm`, `loppupvm`, `yksityinen`, `idmatka`) VALUES (1, '2017-02-17', '2018-06-10', true, 2);
INSERT INTO `matkasovellus`.`matka` (`idmatkaaja`, `alkupvm`, `loppupvm`, `yksityinen`, `idmatka`) VALUES (2, '2020-04-10', '2020-06-10', true, 3);
INSERT INTO `matkasovellus`.`matka` (`idmatkaaja`, `alkupvm`, `loppupvm`, `yksityinen`, `idmatka`) VALUES (3, '2016-02-03', '2017-05-07', false, 4);


COMMIT;

-- -----------------------------------------------------
-- Data for table `matkasovellus`.`tarina`
-- -----------------------------------------------------
START TRANSACTION;
USE `matkasovellus`;
INSERT INTO `matkasovellus`.`tarina` (`idmatkakohde`, `pvm`, `teksti`, `idmatka`) VALUES (1, '2014-01-15', 'Savo maailman kartalle!', 1);
INSERT INTO `matkasovellus`.`tarina` (`idmatkakohde`, `pvm`, `teksti`, `idmatka`) VALUES (2, '2014-01-16', 'Torilla tavattiin!', 1);
INSERT INTO `matkasovellus`.`tarina` (`idmatkakohde`, `pvm`, `teksti`, `idmatka`) VALUES (3, '2014-01-17', 'Täältä lähdettiin kohti pohjoista.', 1);
INSERT INTO `matkasovellus`.`tarina` (`idmatkakohde`, `pvm`, `teksti`, `idmatka`) VALUES (2, '2018-03-13', 'Hieno paikka.', 2);
INSERT INTO `matkasovellus`.`tarina` (`idmatkakohde`, `pvm`, `teksti`, `idmatka`) VALUES (5, '2018-03-15', 'Olipa hienoa taidetta.', 2);
INSERT INTO `matkasovellus`.`tarina` (`idmatkakohde`, `pvm`, `teksti`, `idmatka`) VALUES (7, '2020-05-30', 'Olin kaverin luona käymässä. :)', 3);
INSERT INTO `matkasovellus`.`tarina` (`idmatkakohde`, `pvm`, `teksti`, `idmatka`) VALUES (7, '2016-04-16', 'En odottanut yhtään enempää Hervannasta,', 4);
INSERT INTO `matkasovellus`.`tarina` (`idmatkakohde`, `pvm`, `teksti`, `idmatka`) VALUES (6, '2017-01-01', 'Hyvä näkymä Suomen parhaaseen kaupunkiin.', 4);
INSERT INTO `matkasovellus`.`tarina` (`idmatkakohde`, `pvm`, `teksti`, `idmatka`) VALUES (4, '2017-01-15', 'Tällanen paikka täällä Suomen pääkaupungissa.', 4);
INSERT INTO `matkasovellus`.`tarina` (`idmatkakohde`, `pvm`, `teksti`, `idmatka`) VALUES (3, '2017-02-05', 'Eipä täällä Helsingissä ollutkaan muuta nähtävää.', 4);

COMMIT;


-- -----------------------------------------------------
-- Data for table `matkasovellus`.`kuva`
-- -----------------------------------------------------
START TRANSACTION;
USE `matkasovellus`;
INSERT INTO `matkasovellus`.`kuva` (`idkuva`, `kuva`, `tarina_idmatkakohde`, `tarina_idmatka`) VALUES (1, 'story/kuopiontori.jpg', 1, 1);
INSERT INTO `matkasovellus`.`kuva` (`idkuva`, `kuva`, `tarina_idmatkakohde`, `tarina_idmatka`) VALUES (2, 'story/senaatintori.jpg', 2, 1);
INSERT INTO `matkasovellus`.`kuva` (`idkuva`, `kuva`, `tarina_idmatkakohde`, `tarina_idmatka`) VALUES (3, 'story/rautatieasema.jpg', 3, 1);
INSERT INTO `matkasovellus`.`kuva` (`idkuva`, `kuva`, `tarina_idmatkakohde`, `tarina_idmatka`) VALUES (4, 'story/placeholder.jpg', 2, 2);
INSERT INTO `matkasovellus`.`kuva` (`idkuva`, `kuva`, `tarina_idmatkakohde`, `tarina_idmatka`) VALUES (5, 'story/placeholder.jpg', 5, 2);
INSERT INTO `matkasovellus`.`kuva` (`idkuva`, `kuva`, `tarina_idmatkakohde`, `tarina_idmatka`) VALUES (6, 'story/placeholder.jpg', 7, 3);
INSERT INTO `matkasovellus`.`kuva` (`idkuva`, `kuva`, `tarina_idmatkakohde`, `tarina_idmatka`) VALUES (7, 'story/mikontalo.jpg', 7, 4);
INSERT INTO `matkasovellus`.`kuva` (`idkuva`, `kuva`, `tarina_idmatkakohde`, `tarina_idmatka`) VALUES (8, 'story/placeholder.jpg', 6, 4);
INSERT INTO `matkasovellus`.`kuva` (`idkuva`, `kuva`, `tarina_idmatkakohde`, `tarina_idmatka`) VALUES (9, 'story/placeholder.jpg', 4, 4);
INSERT INTO `matkasovellus`.`kuva` (`idkuva`, `kuva`, `tarina_idmatkakohde`, `tarina_idmatka`) VALUES (10, 'story/placeholder.jpg', 3, 4);

COMMIT;

