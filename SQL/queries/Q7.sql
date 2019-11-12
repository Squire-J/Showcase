-- What is the state of a campaign in regards to its phases?

SELECT ParentCampaign, COUNT(Completed) AS COMPLETED, COUNT(InProgress) AS IN_PROGRESS, COUNT(Standby) AS Standby
FROM
	((SELECT ParentCampaign, COUNT(*) AS Completed
	FROM Phases
	WHERE Status = 'Completed'
	GROUP BY Phases.ParentCampaign
	) AS Q1 
	
	NATURAL RIGHT JOIN
	
	(SELECT ParentCampaign, COUNT(*) AS InProgress
	FROM Phases
	WHERE Status = 'In Progress'
	GROUP BY Phases.ParentCampaign
	) AS Q2
	
	NATURAL LEFT JOIN

	(SELECT ParentCampaign, COUNT(*) AS Standby
	FROM Phases
	WHERE Status = 'Standby'
	GROUP BY Phases.ParentCampaign
	) AS Q3

	)AS Q

GROUP BY ParentCampaign
