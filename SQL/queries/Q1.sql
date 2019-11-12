--Find all events in a campaign that occure on the same day in multiple locations('Save the Whales')

SELECT EventName, Location, Date 
FROM Phases JOIN Events ON (ParentPhase = PhaseName)
WHERE EventName IN (
	SELECT E1.EventName
	FROM Events E1 JOIN EVENTS E2 ON (E1.EventName = E2.EventName AND
						E1.Location <> E2.Location AND 
						E1.Date = E2.Date)
) AND Date IN(
	SELECT E1.Date
	FROM Events E1 JOIN EVENTS E2 ON (E1.EventName = E2.EventName AND
						E1.Location <> E2.Location AND 
						E1.Date = E2.Date)
) 
AND ParentCampaign = 'Save the Whales'
