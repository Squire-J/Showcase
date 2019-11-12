-- How many Events and Phases are in a Campaign 
--('Jon Needs to Pass CSC370 Foundation')

--SELECT COUNT(*)
--FROM Events JOIN Phases ON (ParentPhase = PhaseName)
--WHERE ParentCampaign = 'Jon Needs to Pass CSC370 Foundation'


SELECT CampaignName AS Campaign, Count(DISTINCT PhaseName) AS Phase_Count, Count(DISTINCT EventName) AS Event_Count
FROM (Campaigns FULL OUTER JOIN Phases ON (CampaignName = ParentCampaign) FULL OUTER JOIN Events ON (PhaseName = ParentPhase))
GROUP BY CampaignName
ORDER BY CampaignName
