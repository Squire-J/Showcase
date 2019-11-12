
DROP TABLE IF EXISTS CampaignAnnotations;
CREATE TABLE CampaignAnnotations (
    AnnotationID SERIAL,
	CampaignName VARCHAR,
    Annotation VARCHAR,

    PRIMARY KEY (AnnotationID),
    FOREIGN KEY (CampaignName) REFERENCES Campaigns(CampaignName)
);

INSERT INTO CampaignAnnotations VALUES
	(DEFAULT, 'Stop Final Space', 'Great TV Show'),
    (DEFAULT, 'Stop Final Space', 'Cant find season 2'),
    (DEFAULT, 'Stop Final Space', 'KVN = Best Character')
