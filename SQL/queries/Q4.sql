-- Which payed members have also donated?

SELECT *
FROM 
	((SELECT Sender From Donations) INTERSECT (SELECT Recipiant FROM Payments)) AS Samaritans
