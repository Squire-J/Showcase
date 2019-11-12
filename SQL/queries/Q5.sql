-- How many people are taking part in each Campaign?

SELECT Campaign, COUNT(Participant)
FROM TakesPartIn
GROUP BY Campaign
ORDER BY Campaign
