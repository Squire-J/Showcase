-- Which Campaigns are understaffed? (Assuming understaffed implies participants < Events x3 within the campaign)

SELECT Campaign, COUNT(Staff) AS CurrentStaff, SUM(3 * EventCounts.EventCounter) AS RequiredStaff
FROM 	(SELECT Campaign, COUNT(DISTINCT Participant) AS Staff
	FROM TakesPartIn 
	GROUP BY Campaign) AS Workers,
	(SELECT CampaignName, COUNT(DISTINCT EventName) AS EventCounter
	FROM 	(Campaigns JOIN Phases ON (CampaignName = ParentCampaign) JOIN EVENTS ON (PhaseName = ParentPhase)) AS Dockett
	GROUP BY CampaignName) AS EventCounts
WHERE Workers.Campaign = EventCounts.CampaignName AND Workers.Staff < (3 * EventCounts.EventCounter)
GROUP BY Campaign
