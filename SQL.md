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
FROM entity e
JOIN address a ON e.id_address = a.id_address
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

Lorsque l'on souhaite appliquer une restriction sur le résultat d'une fonction d'aggregation, il n'est pas possible de le faire dans le WHERE.
En effet à ce moment-là, l'aggregation n'a pas encore été effectuée.
C'est la que le mot clé HAVING entre en jeu :
``` sql
SELECT status, name, count(*)
FROM entity
GROUP BY status, name
HAVING count(*) > 50;
```
Ici on ne conservera que les résultats dont le nombre d'occurrence est supérieur à 50.

Il est possible d'effectuer une recherche de string avec le mot clé LIKE
``` sql
SELECT name 
FROM entity
WHERE lower(name) LIKE 'a%';
```
Ici on va rechercher l'ensemble des entités dont le nom commence par a. 
* % représente de 0 à l'infini caratère.
* _ représente un unique caractère inconnu
* lower() permet d'éviter les soucis liés à la casse


## Sous Requête
Il est possible d'utiliser le résultat d'une requête pour effectuer une autre requête avec.
Cela devient un peu tordu, mais on peut par exemple :
* Récupérer dans la table entity les entités dont l'adresse ID apparait plus de 500x
* Afficher les adresses complètes correspondantes extraite de la table address

Pour effectuer cette requête imbriquée on utilise IN :
``` sql
SELECT *
FROM address a
WHERE a.id_address IN (
    SELECT id_address
    FROM entity
    GROUP BY id_address
    HAVING count(*) > 500
    );
```

Une façon simple d'appréhender cette requête est de réfléchir en terme de table résultante.
La requête imbriquée renvoie la liste des id_address dont le nombre dépasse 500 (une seule col, plusieurs lignes).
A partir de cette liste, on va pouvoir afficher les adresses qui possède ces id_address.

Il est possible d'effectuer cette recherche sur plusieurs critères:
``` sql
SELECT * 
FROM t1 
WHERE t1.valeur1, t1.valeur2 IN (SELECT c1, c2 FROM t2) ;
```
Ici on recherche t1.valeur dans c1 et t2.valeur dans c2.

Ce qui nous fait arriver aux opérateur ANY et ALL. Voici deux requêtes simple permettant de les expliquer
``` sql
SELECT Nom
FROM Employes
WHERE Salaire > ALL (SELECT Salaire FROM Salaires WHERE Departement = 'IT');
```
Cette requête retournera les employés dont le salaire est supérieur à TOUS les salaires du département IT
L'utilisation ANY aurait retourné les employés dont le salaire est supérieur à AU MOINS UN salaire du département IT - le plus bas, du coup.
Les opérateurs ALL et ANY attendent donc une liste en paramètre.

## Fonctions Windows

Attention, les fonctions windows ne fonctionnent pas avec MySQL.
Nous avons vu tout à l'heure que cette fonction retournera une erreur :
``` sql
SELECT id_address, min(id) 
FROM entity ;
```
En effet, il manque un Group by sur id_address.
Avec la fonction OVER(), il est toutefois de dupliquer la valeur du minimum sur autant de ligne que contenue dans la table entity :
``` sql
SELECT id_address, min(id) OVER()
FROM entity ;
```

Cette fonction OVER() peut-être étendue. Par exemple on peut souhaiter obtenir l'id minimum pour chaque adresse au lieu de l'id minimum global :
``` sql
SELECT id_address, min(id) OVER(PARTITION BY id_address)
FROM entity ;
```

Enfin, on peut souhaiter afficher les noms des sociétés également, en les triant en ordre ASC :
``` sql
SELECT id_address,name, min(id) OVER(PARTITION BY id_address ORDER BY name)
FROM entity ;
```