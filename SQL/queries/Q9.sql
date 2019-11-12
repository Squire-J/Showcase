-- Show all transactions from a particular campaign (Save Final Space)

SELECT *
FROM 
	((SELECT * FROM Donations) UNION (SELECT * FROM Payments)) AS Transactions
WHERE Recipiant = 'Save the Whales' OR Sender = 'Save the Whales'
