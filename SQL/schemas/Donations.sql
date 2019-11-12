/* Creates and populates Donations schema */

DROP TABLE IF EXISTS Donations;

CREATE TABLE Donations (
	Sender VARCHAR,
    Recipiant VARCHAR,
    Time_Stamp TIMESTAMP WITHOUT TIME ZONE UNIQUE NOT NULL CHECK (Time_Stamp <= current_timestamp),
    Amount INT CHECK (Amount > 0),

	PRIMARY KEY (Time_Stamp),
    FOREIGN KEY (Sender) REFERENCES Members(MemberName),
    FOREIGN KEY (Recipiant) REFERENCES Campaigns(CampaignName)
);

--INSERT INTO Events Donations (<'SenderID'>,<'RecipiantID'>,<'TimeStamp'>,<Amount>);
INSERT INTO Donations VALUES 
	('Dana','End World Hunger','07/14/2019  19:19:01', 31415),
	('Dana','Save the Whales','07/14/2010 19:19:02', 9001),
    ('Bill Bird', 'Arm the Whales','07/19/2010 19:19:02', 9002),
    ('Mooncake', 'Air Condition ECS Labs','07/14/2019 19:19:06', 6),
    ('Dana', 'Air Condition ECS Labs','08/14/2000 19:19:02', 6),
	('Zastre','Jon Needs to Pass CSC370 Foundation','07/30/2000 01:01:03', 3);
