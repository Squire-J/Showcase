/* Creates and populates Members schema

 Tier 0 implies a supporter or a payed member
 Tier 1 implies a volonteer who has worked 2 or less public campaigns
 Tier 2 implies a volonteer who has worked 2 or more public campaigns

*/

DROP TABLE IF EXISTS Donations;
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS TakesPartIn;
DROP TABLE IF EXISTS MemberAnnotations;
DROP TABLE Members;

CREATE TABLE Members (
	MemberID SERIAL,
	MemberName VARCHAR UNIQUE,
	Salary INT,
	Tier INT,
	CampaignCount INT,
	PRIMARY KEY (MemberID)
);

-- INSERT INTO Members VALUES(DEFAULT, '<NAME>', <Salary>, <Tier>, <Campaign Count>),

INSERT INTO Members VALUES
	(DEFAULT, 'Zastre', 30000, 1, 1),
	(DEFAULT, 'Dana', NULL, 2, 3),
	(DEFAULT, 'Bill Bird', NULL, 1, 1),
	(DEFAULT, 'Mooncake', NULL, NULL, NULL),
	(DEFAULT, 'Squire', NULL, 1, 1),
	(DEFAULT, 'Stormtrooper 1', 15000, NULL, NULL),
	(DEFAULT, 'Stormtrooper 2', NULL, 1, 1),
	(DEFAULT, 'Stormtrooper 3', NULL, 1, 1),
	(DEFAULT, 'Gary', NULL, 1, 1),
	(DEFAULT, 'Little Cato', NULL, 1, 1);


