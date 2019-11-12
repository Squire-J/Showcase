-- List all transactions in the past week

SELECT * 
FROM 	((SELECT * FROM Payments) 
	UNION 
	(SELECT * FROM Donations)) AS Transactions
WHERE Time_Stamp < current_timestamp AND Time_Stamp > current_timestamp - INTERVAL '1 WEEK'
ORDER BY Time_Stamp
