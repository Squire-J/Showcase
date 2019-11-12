
DROP TABLE IF EXISTS MemberAnnotations;
CREATE TABLE MemberAnnotations (
    AnnotationID SERIAL,
	MemberName VARCHAR,
    Annotation VARCHAR,

    PRIMARY KEY (AnnotationID),
    FOREIGN KEY (MemberName) REFERENCES Members(MemberName)
);

INSERT INTO MemberAnnotations VALUES
	(DEFAULT, 'Little Cato', 'Out for Revenge'),
    (DEFAULT, 'Mooncake', 'Adorable'),
    (DEFAULT, 'Gary', 'Raw')
