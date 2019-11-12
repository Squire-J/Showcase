/* Creates and populates TakesPartIn schema */

DROP TABLE IF EXISTS TakesPartIn;

CREATE TABLE TakesPartIn (
    Participant VARCHAR,
    Campaign VARCHAR,

    FOREIGN KEY (Participant) REFERENCES Members(MemberName),
    FOREIGN KEY (Campaign) REFERENCES Campaigns(CampaignName)
);

INSERT INTO TakesPartIn VALUES 
    ('Squire', 'Jon Needs to Pass CSC370 Foundation'),
    ('Zastre', 'Jon Needs to Pass CSC370 Foundation'),
    ('Bill Bird', 'Arm the Whales'),
    ('Dana', 'Save the Whales'),
    ('Dana', 'Air Condition ECS Labs'),
    ('Dana', 'End World Hunger'),
    ('Stormtrooper 2', 'Stop Final Space'),
    ('Stormtrooper 3', 'Stop Final Space'),
    ('Gary', 'Stop Final Space'),
    ('Little Cato', 'Stop Final Space');
    
