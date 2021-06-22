USE `thedrifters`;
DROP procedure IF EXISTS `retrieve_all`;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `retrieve_all` ()
BEGIN

SELECT resalehdb.resalehdbid, resalehdb.block, resalehdb.FloorArea,resalehdb.Latitude,
resalehdb.Longitude,resalehdb.PostalCode,resalehdb.LeaseCommenceDate
,resalehdb.LeaseEndDate,resalehdb.ResalePrice, 
flattype.type, storeyrange.StoreyRange,flatmodel.model,
streetname.name AS StreetName, town.name AS Town
FROM resalehdb
JOIN streetname ON resalehdb.streetnameID = streetname.streetnameID
JOIN flatmodel ON resalehdb.flatmodelID = flatmodel.flatmodelID
JOIN storeyrange ON resalehdb.storeyrangeID = storeyrange.storeyrangeID
JOIN flattype ON resalehdb.FlatTypeID = flattype.FlatTypeID
JOIN town ON streetname.townID = town.townID
ORDER BY streetname.name;
END$$

DELIMITER ;

USE `thedrifters`;
DROP procedure IF EXISTS `retrieve_hdb_by_id`;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `retrieve_hdb_by_id` (IN hdbId INT)
BEGIN

SELECT resalehdb.resalehdbid,  resalehdb.block, resalehdb.FloorArea,resalehdb.Latitude,
resalehdb.Longitude,resalehdb.PostalCode,resalehdb.LeaseCommenceDate
,resalehdb.LeaseEndDate,resalehdb.ResalePrice, 
flattype.type, storeyrange.StoreyRange,flatmodel.model,
streetname.name AS StreetName, town.name AS Town
FROM resalehdb
JOIN streetname ON resalehdb.streetnameID = streetname.streetnameID
JOIN flatmodel ON resalehdb.flatmodelID = flatmodel.flatmodelID
JOIN storeyrange ON resalehdb.storeyrangeID = storeyrange.storeyrangeID
JOIN flattype ON resalehdb.FlatTypeID = flattype.FlatTypeID
JOIN town ON streetname.townID = town.townID
WHERE resalehdbid = hdbid
ORDER BY streetname.name;
END$$

DELIMITER ;


USE thedrifters;
DROP procedure IF EXISTS update_all_resale;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE update_all_resale 
(
IN newblock varchar(5),IN newarea INT,
IN newLat DOUBLE,IN newLong DOUBle,
IN newpostal VARCHAR(6),IN newcommence YEAR,
IN newEnd Year,IN newprice FLOAT,
IN hdbid INT, IN newflattypeid INT,
IN newstoreyrangeid INT,IN newmodelid INT,
IN newstreetid INT, IN userwhoupdate INT)
BEGIN

UPDATE resalehdb
SET 
Block = newblock,
FloorArea = newarea,
PostalCode = newpostal,
Latitude = newLat,
Longitude = newLong,
LeaseCommenceDate = newcommence,
LeaseEndDate = newEnd,
ResalePrice = newprice,
FlatTypeID =  newflattypeid,
storeyrangeID = newstoreyrangeid,
FlatModelID = newmodelid,
streetnameID = newstreetid,
UpdatedBy = userwhoupdate
WHERE resalehdbid = hdbid;
END$$

DELIMITER ;
USE thedrifters;
DROP procedure IF EXISTS update_resale_price;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE update_resale_price 
(IN newprice FLOAT, IN hdbid INT)
BEGIN

UPDATE resalehdb
SET 
ResalePrice = newprice
WHERE resalehdbid = hdbid;
END$$

DELIMITER ;


USE `thedrifters`;
DROP procedure IF EXISTS `retrieve_flatmodel`;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `retrieve_flatmodel` ()
BEGIN

SELECT * FROM thedrifters.flatmodel;

END$$

DELIMITER ;

USE `thedrifters`;
DROP procedure IF EXISTS `retrieve_storeyrange`;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `retrieve_storeyrange` ()
BEGIN

SELECT * FROM thedrifters.storeyrange;

END$$

DELIMITER ;

USE `thedrifters`;
DROP procedure IF EXISTS `retrieve_flattype`;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `retrieve_flattype` ()
BEGIN

SELECT * FROM thedrifters.flattype;

END$$

DELIMITER ;

USE `thedrifters`;
DROP procedure IF EXISTS `retrieve_streetname_with_town`;
DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `retrieve_streetname_with_town` ()
BEGIN

SELECT streetname.streetnameid,town.townid,
streetname.NAME, town.NAME
FROM Streetname
JOIN town ON town.townid = streetname.TownID
ORDER BY streetname.name;

END$$

DELIMITER ;


USE `thedrifters`;
DROP procedure IF EXISTS `retrieve_min_max`;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `retrieve_min_max` (IN min FLOAT,IN max FLOAT)
BEGIN

SELECT  resalehdb.resalehdbid, resalehdb.block, resalehdb.FloorArea,resalehdb.Latitude,
resalehdb.Longitude,resalehdb.PostalCode,resalehdb.LeaseCommenceDate
,resalehdb.LeaseEndDate,resalehdb.ResalePrice, 
flattype.type, storeyrange.StoreyRange,flatmodel.model,
streetname.name AS StreetName, town.name AS Town
FROM resalehdb
JOIN streetname ON resalehdb.streetnameid = streetname.streetnameid
JOIN flatmodel ON resalehdb.flatmodelID = flatmodel.flatmodelID
JOIN storeyrange ON resalehdb.storeyrangeid = storeyrange.storeyrangeid
JOIN flattype ON resalehdb.FlatTypeID = flattype.FlatTypeID
JOIN town ON streetname.townid = town.townid
WHERE resalehdb.ResalePrice >= min AND 
resalehdb.ResalePrice<=max
ORDER BY streetname.name;

END$$

DELIMITER ;

USE `thedrifters`;
DROP procedure IF EXISTS `delete_from_resale`;
DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `delete_from_resale` (IN resaleid INT)
BEGIN

DELETE FROM resalehdb
WHERE ResaleHdbID = resaleid;

END$$

DELIMITER ;


USE `thedrifters`;
DROP procedure IF EXISTS `insert_into_resale`;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `insert_into_resale` (
IN newblock varchar(5),IN newarea INT,
IN newLat DOUBLE,IN newLong DOUBle,
IN newpostal VARCHAR(6),IN newcommence YEAR,
IN newEnd Year,IN newprice FLOAT,
IN newcreatedby INT,IN newstreetid INT,
IN newflatid INT,IN newrangeid INT,
IN newmodelID INT
)
BEGIN
	IF EXISTS (SELECT * FROM resalehdb WHERE PostalCode = newpostal) THEN
		UPDATE resalehdb SET Block = newblock, FloorArea = newarea, Latitude = newLat, 
			Longitude = newLong, LeaseCommenceDate = newcommence, LeaseEndDate = newEnd, ResalePrice = newprice, FlatTypeID = newflatid, 
            storeyrangeID = newrangeid, FlatModelID = newmodelid, streetnameID = newstreetid, UpdatedBy = newcreatedby 
		WHERE PostalCode = newpostal;
	ELSE
		INSERT INTO resalehdb(Block,floorarea,PostalCode,Latitude,longitude,LeaseCommenceDate, 
			leaseEndDate, ResalePrice, CreatedBy, streetnameID, FlattypeID, StoreyRangeID, FlatModelID)
		VALUES(newblock, newarea, newpostal, newLat, newLong, newcommence, newEnd, 
			newprice, newcreatedby, newstreetid, newflatid, newrangeid, newmodelID);
	END IF;
END$$

DELIMITER ;

USE `thedrifters`;
DROP procedure IF EXISTS `retrieve_user_by_email`;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `retrieve_user_by_email` (IN newEmail VARCHAR(255))
BEGIN

SELECT *
FROM User
WHERE email = newEmail;
END$$

DELIMITER ;

USE `thedrifters`;
DROP procedure IF EXISTS `retrieve_avg_resale_price_by_town`;

DELIMITER $$
USE `thedrifters`$$
CREATE PROCEDURE `retrieve_avg_resale_price_by_town` ()
BEGIN

SELECT AVG(r.ResalePrice) AS AveragePrice, t.Name FROM resalehdb AS r
JOIN streetname AS s ON s.StreetNameID = r.StreetNameID 
JOIN town AS t ON t.TownID = s.TownID
GROUP BY t.Name;

END$$

DELIMITER ;