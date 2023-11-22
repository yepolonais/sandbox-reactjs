# Extraire les véhicules ( ) n'ayant aucune pièce ( ) associée.
SELECT vehicle_id
FROM vehicle
LEFT JOIN vehicle_part ON vehicle.vehicle_id = vehicle_part.vehicle_id

# Extrait les véhicules n'ayant pas d'entrée dans la table vehicle_part
SELECT vehicle_id
FROM vehicle
LEFT JOIN vehicle_part ON vehicle.vehicle_id = vehicle_part.vehicle_id
WHERE vehicle_part.vehicle_id IS NULL;

# Groupe suivant une fonction d'aggrégat. Ici le nombre d'occurrence pour ...
SELECT year, COUNT(*) AS "toto"
FROM movies 
GROUP BY year
HAVING COUNT(*) > 5;

# Filtre des données suivant plusieurs paramètres
SELECT vehicle_part_id, 
FROM vehicle_part_location
WHERE location_id IN (3, 6, 12) AND left_timestamp IS NOT NULL