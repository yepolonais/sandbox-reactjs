# Introduction au langage SQL

## Requêtes de base
Pour cette démonstration, je vais utiliser les tables :
* Entity qui comporte X lignes
* Address qui comporte Y lignes

``` sql
SELECT *
FROM address
LIMIT 50;
```
Cette requête sélectionne l'ensemble des colonnes de la table address en limitant les résultats au 50 premiers.

``` sql
SELECT *
FROM address, entity;
```

Affiche l'ensemble des colonnes des deux tables. Ne fusionne pas les colonnes similaires. 
Effectue le produit scalaire entre les lignes de la table Address et celles de entity, le résultat comportera donc X*Y lignes. 

``` sql
SELECT name, e.id_address 
FROM entity as e, address as a
WHERE e.id_address = a.id_address;
```
Plusieurs concepts apparaissent ici. L'utilisation de "as" permet de renommer localement une variable, comme ici le nom de la table.
WHERE permet de filtrer les résultats où l'id_address dans la table Entity et l'id_address dans la table Address sont les mêmes.
Cette requête est parfaitement acceptable. Toutefois il existe une syntaxe dédiée pour effectuer la même opération :
``` sql
SELECT name, e.id_address 
FROM entity as e
JOIN address as a ON e.id_address = a.id_address
```
Ce qui nous amène au jointure !

## Jointure de tables

Si l'on souhaite filter la requête, on peut demander seulement les résultats ou "Cruncher" apparaît :
``` sql
SELECT name, e.id_address 
FROM entity as e
JOIN address as a ON e.id_address = a.id_address
WHERE name LIKE '%Cruncher%';
```
Le terme % indique n caractères. Attention la recherche est sensible à la casse. 
Ce type de requête fonctionne très bien avec des relation one-to-many ou l'une des tables possède la clé étrangère de l'autre table.
Par contre ceci n'est plus possible pour une relation many-to-many !

Enfin lorsque le nom de la colonne sur laquelle la jointure est effectuée est la même : e.id_address = a.id_address => même nom id_address, 
la requête ci-dessus peut se simplifier en utilisant un NATURAL JOINT
``` sql
SELECT name, e.id_address 
FROM entity as e
NATURAL JOIN address
WHERE name LIKE '%Cruncher%';
```

Les tables Entity et Intermediary ont une relation many-to-many. La table de jointure qui les lie s'appelle Assoc_inter_entity.
Voici la requête a effectuée pour afficher correctement les données liées entre Entity et Intermediary :
``` sql
SELECT
    i.id as intermediary_id,
    i.name as intermediary_name,
    e.id as entity_id,
    e.name as entity_name
FROM 
    intermediary i,
    assoc_inter_entity a,
    entity e
WHERE
    a.entity = e.id
    AND a.inter = i.id
```
Le point important concerne la ligne **WHERE a.entity = e.id AND a.inter = i.id**. 
Sans elle, le résultat serait le produit scalaire entre les trois tables. 
Sans la table Assoc_inter_entity, il serait impossible de filtre les données liées.

## Aggrégation des données

L'aggrégation peut se résumer en une requête simple :
``` sql
SELECT status, count(*) 
FROM entity 
GROUP BY status;
```
Ceci permet d'afficher chaque status avec leur nombre d'occurrence dans la table entity.

Voici une requête encore plus simple :
``` sql
SELECT max(incorporation_date) AS maxi 
FROM entity ;
```
Cette requête va afficher une seule colonne - maxi - et une seule ligne, la valeur maximum de incorporation-date dans entity.
En enfin encore plus simple :
``` sql
SELECT count(*) 
FROM entity ;
```
Retourne le nombre de ligne présente dans la table entity.

Que se passe-t-il lorsque l'on ajoute un GROUP BY à la requête ci-dessus ?
``` sql
SELECT count(*) 
FROM entity
GROUP BY status;
```
Ceci retourne le nombre d'occurence de chaque status dans la table entity. Le souci avec cette requête, c'est que l'on ne connait pas le nom 
des status décomptés, car on a omis d'ajouter "status" au SELECT...

Ceci nous amène à la règle d'or suivante : 
> Dans la clause SELECT, il est possible d'utiliser une fonction d'aggregation uniquement lorsque les autres paramètres sont soit des fonction d'aggregation également, soit présent dans une clause GROUP BY.

En pratique, ceci implique que la requête suivante est possible :
``` sql
SELECT status, name, count(*)
FROM entity
GROUP BY status, name;
```
Ceci va afficher le nombre d'occurrence par (status + name) dans la table entity. 


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