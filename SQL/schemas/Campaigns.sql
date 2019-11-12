/* Creates and populates the Campaigns table*/

DROP TABLE IF EXISTS CampaignAnnotations;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS Phases;
DROP TABLE IF EXISTS Campaigns;

CREATE TABLE Campaigns (
	CampaignName VARCHAR UNIQUE,
	CampaignID SERIAL UNIQUE,
	Duration INT, --in days
	StartDate TIMESTAMP WITHOUT TIME ZONE DEFAULT current_timestamp,
	Website VARCHAR DEFAULT NULL,
	Budget INT,

	PRIMARY KEY (CampaignID)
);

INSERT INTO Campaigns VALUES
	('Save the Whales', DEFAULT, 360, DEFAULT, 'SaveTheWhales.fakeSite', 9001),
	('Arm the Whales', DEFAULT, 360,  DEFAULT, 'ArmTheWhales.fakeSite', 9002),
	('End World Hunger', DEFAULT, 7, DEFAULT, 'EndWorldHunger.fakeSite', 31415),
	('Air Condition ECS Labs', DEFAULT, 12, DEFAULT, DEFAULT, 12),
	('Jon Needs to Pass CSC370 Foundation', DEFAULT, 14, DEFAULT, DEFAULT, 3),
	('Stop Final Space', DEFAULT, 14, DEFAULT, DEFAULT, 0);
