-- Determine the net value of all Campaigns not including initial budget

SELECT Campaign, SUM(Total) AS NET
FROM 
	((SELECT Recipiant AS Campaign, SUM(amount) AS Total
	FROM Donations
	GROUP BY Recipiant
	)
	UNION
	(SELECT Sender AS Campaign, (SUM(amount) * -1) AS Total
	FROM Payments
	GROUP BY Sender
	)
	UNION
	(SELECT CampaignName, Budget FROM Campaigns)) AS Transactions
GROUP BY Campaign
ORDER BY NET
