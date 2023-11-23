# Quel est votre principal défaut ? 
Je n'aime pas prendre de décision à la légère, j'ai besoin de connaître le sujet avant, de sentir que j'ai le contrôle dessus.
Cela peut être une qualité mais aussi un défaut quand une réponse rapide est exigée. 
Je me fais un peu violence des fois pour lâcher la bride et prier pour que tout se passe bien. 


# Que faire si je ne connais pas le sujet ?
Dire que je suis très ouvert pour apprendre de nouvelles choses. 
Plus l'on connait de choses, plus on est susceptible de combiner ces connaissances pour en créer de nouvelles. Et souvent cela permet d'imaginer des solutions originales à des problèmatiques que l'on peut avoir au travail.
L'autre aspect, c'est que très souvent des problèmes que l'on peut rencontrer dans notre domaine ont déjà été résolues dans un autre domaine.
Quand j'étais au CNRS, on nous encourageait à assister aux conférences données sur des thématiques très différentes de la notre.
Et quand je regarde le .net 8, je trouve que la langage ressemble de plus en plus a du nodejs (minimal API, tableau initialisé avec [])

# Tests
## Test des Api avec Swagger

## Test unitaires 
Tests ciblés, en général sur des méthodes clés de notre application. 
Effectués avec MSTest (Arrange, Act, Assert).
Avantages des tests unitaires ? 
* protège des régressions
* identifie les couplages de code - car un code couplé est dut à tester unitairement
* moins de temps à faire des tests fonctionnels du coup !

Le langage : un fake décrit un stub ou ou mock. 
A la base ce sont la même chose : de faux objets que l'on créé pour remplacer un service ou autre dépendance à notre système.
Un stub devient un Mock lorsque l'on assert quelque chose sur lui, comme par exemple savoir si l'une de ses prop est true.

## Test d'intégration
Tests plus larges que les tests unitaires, permettent de tester l'infrastucture de l'application.
Ici pas de fake objet, on utilise les vrais services. 
On va pouvoir tester la connexion à la BDD, ou bien l'intéraction avec le File system. 
C'est une compétence où je voudrais monter.
