/* Creates and populates Events schema */

DROP TABLE IF EXISTS Events;

CREATE TABLE Events (
	EventName VARCHAR,
	Location VARCHAR,
    Date TIMESTAMP WITHOUT TIME ZONE,
	ParentPhase VARCHAR,

	PRIMARY KEY (EventName, Location, Date),
	FOREIGN KEY (ParentPhase) REFERENCES Phases(PhaseName)
        ON UPDATE CASCADE
);

--INSERT INTO Events VALUES (<'Name'>,<'Location'>,<'Date'>,<'ParentPhase'>);

INSERT INTO Events VALUES 
	('Port Cleanup','Swartz Bay Victoria BC','July 13 2019','Ocean Cleanup'),
	('Port Cleanup','Downtown Victoria BC','July 13 2019','Ocean Cleanup'),
	('Port Cleanup','Downtown Victoria BC','July 14 2019','Ocean Cleanup'),
	('Fishermans Warf Cleanup','Swartz Bay Victoria BC','July 14 2019','Ocean Cleanup'),
	('Rally','Downtown Victoria BC','July 10 2019','Public Awareness'),
	('Barge Party','Pacific Ocean','Sept 1 2019','Celebration'),
	('Study','ECS Building','Jun 9 2019','Perform Well on Midterms'),
	('Study','ECS Building','Jun 10 2019','Perform Well on Midterms'),
	('Study','ECS Building','Jun 11 2019','Perform Well on Midterms'),
	('Work on Assignment 2','ECS Building','Jun 11 2019','Do well on assignments'),
	('Work on Assignment 2','ECS Building','Jun 12 2019','Do well on assignments'),
	('Insert mildly entertaining data into assignment tables','ELW Building','July 16 2019','Make prof laugh hard enough to give me bonus marks');