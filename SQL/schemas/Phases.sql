/* Creates and populates Phases schema */

DROP TABLE IF EXISTS Phases;

CREATE TABLE Phases (
	PhaseName VARCHAR,
	Status VARCHAR,
	ParentCampaign VARCHAR,

	PRIMARY KEY (PhaseName),
	FOREIGN KEY (ParentCampaign) REFERENCES Campaigns(CampaignName)
);

--INSERT INTO Phases VALUES (<'Name'>,<'Status'>,<'Parent Campaign'>, <'Result'>)

INSERT INTO Phases VALUES 
	('Celebration', 'Standby', 'Save the Whales'),
	('Public Awareness', 'Completed', 'Save the Whales'),
	('Ocean Cleanup', 'In Progress', 'Save the Whales'),
	('Perform Well on Midterms','Completed','Jon Needs to Pass CSC370 Foundation'),
	('Do well on assignments','In Progress','Jon Needs to Pass CSC370 Foundation'),
	('Make prof laugh hard enough to give me bonus marks','In Progress','Jon Needs to Pass CSC370 Foundation'),
	('Feed People','In Progress','End World Hunger');
