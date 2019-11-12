-- Designed to describe queries and hold their path location in a static setting.
DROP TABLE IF EXISTS QuerieMetaData;

CREATE TABLE QuerieMetaData(
    ID SERIAL,
    Title VARCHAR,
    SQLFile VARCHAR,
    PRIMARY KEY (ID)
);

INSERT INTO QuerieMetaData VALUES 
    (DEFAULT, 'All events that occur on the same day in multiple locations in campaign Save The Whales', 'Q1.sql'),
    (DEFAULT, 'Number of Events and Phases in each Campaign', 'Q2.sql'),
    (DEFAULT, 'Total amount each Member has Donated', 'Q3.sql'),
    (DEFAULT, 'Payed Members who have also Donated', 'Q4.sql'),
    (DEFAULT, 'Number of people in each Campaign', 'Q5.sql'),
    (DEFAULT, 'Understaffed Campaigns', 'Q6.sql'),
    (DEFAULT, 'Campaign Phases statuses', 'Q7.sql'),
    (DEFAULT, 'All Transactions in the past week', 'Q8.sql'),
    (DEFAULT, 'All Transactions in and out of Save Final Space', 'Q9.sql'),
    (DEFAULT, 'Net value of each Campaign', 'Q10.sql');