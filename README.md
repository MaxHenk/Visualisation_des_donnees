# Visualisation_des_donnees - Projet de cartographie interactive sur les votations présidentielles françaises 2022
## Description :
Ce projet a pour but de visualiser les résultats au premier et deuxième tour des présidentielles françaises. 





## Base de données :
Les données géographiques sont disponibles sur [le site du gouvernement français](https://www.data.gouv.fr/fr/).
Les données statistiques sont disponibles sur [le site du gouvernement français](https://www.data.gouv.fr/fr/) et ont été nettoyées par Tristan Guerra en date du 15 avril 2022 pour le premier tour et du 25 avril 2022 pour le second. 


## Outils

<a href="https://d3js.org"><img src="https://d3js.org/logo.svg" align="left" hspace="10" vspace="6"></a>
<img src="https://user-images.githubusercontent.com/10379601/29446482-04f7036a-841f-11e7-9872-91d1fc2ea683.png" align="right" height="70">

L'utilisation de d3 nous a permis la visualisation (cartes, barplot) et le chargement de données (géographiques et statistiques) pour visualiser les résultats des élections. 

[Topojson](https://github.com/topojson/topojson) a aussi été utilisé afin de réduire la taille du fichier de données géographiques. 

## Données
Chaque entrée dans le jeu de données géographiques correspond à une commune. Pour chaque entrée nous possédons les propriétés suivants :
- id
- codgeo
- dep
- reg
- libgeo
Chaque entrée dans le jeu de données statistiques correspond à une commune. Pour chaque entrée nous possédons les attributs suivants :
- CodeInsee
- CodeDepartement
- Commune
- Votants
Aux attributs ci-dessus se rajoutent également le nombre de votants obtenus par les candidats dans la commune. Pour le premier tour la liste des candidats est :
- arthaud
- roussel
- macron
- lassale
- lepen
- zemmour
- melenchon
- hidalgo
- jadot
- pecresse
- poutou
- dupontaignan
Pour le second tour :
- macron
- lepen

## Interface
L'interface est composée de :
- Une carte choroplète représentant le pourcentage de votants selon le candidat choisi
- Un bouton permettant de changer de tour qui modifie l'affichage de la carte et les données considérées
- Un menu déroulant permettant de changer le candidat affiché
- Un barplot apparaissant après avoir cliqué sur une commune de la carte choroplète
  
## Utilisation
Ce projet n'est pas sur un serveur, il faut donc l'afficher localement. Il existe multiples méthodes pour faire cela, mais ci-joint une explication étapes par étapes pour afficher localement notre projet en utilisant python3.
1. Télécharger le zip du projet, le décompresser
2. Ouvrir un Terminal et changer le chemin pour aller au dossier décompressé précédemment
ex : cd /Users/username/Desktop/Titre
3. Lancer un serveur local en lançant la commande suivante dans le terminal : `python3 -m http.server`
4. Le terminal devrait afficher la phrase suivante : `Serving HTTP on :: port 8000`
5. Ouvrir un navigateur (Firefox, Chrome) et entrer l'adresse suivante : `localhost:8000`

## Autors
Ce projet a été réalisé par Max Henking et Axelle Bersier pour l'évaluation du cours de "Visualisation de données", un cours de Master donné par le professeur Isaac Pante à l'université de Lausanne au printemps 2022.

## Acknolegements
Mike Bostock pour D3, TopoJSON et tout les exemples.
Isaac Pante pour les cours et conseils.
La communauté StackOverflow pour l'aide précieuse.
