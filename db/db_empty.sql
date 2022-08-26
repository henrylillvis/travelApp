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


