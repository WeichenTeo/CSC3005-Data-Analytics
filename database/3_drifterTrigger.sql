DROP TRIGGER IF EXISTS `before_insert_town`;
DROP TRIGGER IF EXISTS `before_insert_streetName`;
DROP TRIGGER IF EXISTS `before_insert_flatModel`;
DROP TRIGGER IF EXISTS `before_insert_flatType`;
DROP TRIGGER IF EXISTS `before_insert_storeyRange`;

DELIMITER //
CREATE TRIGGER `before_insert_town`
BEFORE INSERT ON Town FOR EACH ROW

BEGIN
	SET @TownId = (SELECT TownId FROM Town WHERE Name = NEW.Name);
    IF(!ISNULL(@TownId)) THEN
		SIGNAL SQLSTATE VALUE '45000' SET MESSAGE_TEXT = @TownId;
	END IF;
END//

DELIMITER //
CREATE TRIGGER `before_insert_streetName`
BEFORE INSERT ON StreetName FOR EACH ROW

BEGIN
	SET @StreetNameId = (SELECT StreetNameId FROM StreetName WHERE Name = NEW.Name);
    IF(!ISNULL(@StreetNameId)) THEN
		SIGNAL SQLSTATE VALUE '45000' SET MESSAGE_TEXT = @StreetNameId;
	END IF;
END//

DELIMITER //
CREATE TRIGGER `before_insert_flatModel`
BEFORE INSERT ON FlatModel FOR EACH ROW

BEGIN
	SET @FlatModelId = (SELECT FlatModelId FROM FlatModel WHERE Model = NEW.Model LIMIT 1);
    IF(!ISNULL(@FlatModelId)) THEN
		SIGNAL SQLSTATE VALUE '45000' SET MESSAGE_TEXT = @FlatModelId;
	END IF;
END//

DELIMITER //
CREATE TRIGGER `before_insert_flatType`
BEFORE INSERT ON FlatType FOR EACH ROW

BEGIN
	SET @FlatTypeId = (SELECT FlatTypeId FROM FlatType WHERE Type = NEW.Type LIMIT 1);
    IF(!ISNULL(@FlatTypeId)) THEN
		SIGNAL SQLSTATE VALUE '45000' SET MESSAGE_TEXT = @FlatTypeId;
	END IF;
END//

DELIMITER //
CREATE TRIGGER `before_insert_storeyRange`
BEFORE INSERT ON StoreyRange FOR EACH ROW

BEGIN
	SET @StoreyRangeId = (SELECT StoreyRangeId FROM StoreyRange WHERE StoreyRange = NEW.StoreyRange LIMIT 1);
    IF(!ISNULL(@StoreyRangeId)) THEN
		SIGNAL SQLSTATE VALUE '45000' SET MESSAGE_TEXT = @StoreyRangeId;
	END IF;
END//