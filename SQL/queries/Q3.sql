-- How much has each Member donated?

SELECT Sender, SUM(amount)
FROM 
	((Select Sender, amount FROM Donations) UNION (SELECT MemberName, NULL FROM Members)) AS MemberDonations
GROUP BY Sender
ORDER BY Sender
