/* Creates and populates Payments schema */

DROP TABLE IF EXISTS Payments;

CREATE TABLE Payments (
	Sender VARCHAR,
    Recipiant VARCHAR,
   	Time_Stamp TIMESTAMP WITHOUT TIME ZONE UNIQUE NOT NULL CHECK(Time_Stamp <= current_timestamp),
	Amount INT CHECK (Amount > 0),

	PRIMARY KEY (Time_Stamp),
    FOREIGN KEY (Sender) REFERENCES Campaigns(CampaignName),
    FOREIGN KEY (Recipiant) REFERENCES Members(MemberName)
);

--INSERT INTO Events Payments (<'SenderID'>,<'RecipiantID'>,<'TimeStamp'>,<Amount>);
INSERT INTO Payments VALUES 
    ('Save the Whales','Zastre','07/13/2019 19:19:01', 2500),
    ('Save the Whales','Dana','07/13/2019 19:19:02', 2500), --Should fail onces triggers introduced
	('Stop Final Space', 'Stormtrooper 1', current_timestamp, 15000);
