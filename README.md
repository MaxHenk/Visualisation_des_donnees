# Visualisation_des_donnees - Projet de cartographie interactive sur les votations présidentielles françaises 2022
Ce projet a pour but de visualiser les résultats au premier et deuxième tour des présidentielles françaises. Pour le faire, nous avons décider d'ajouter plusieurs fonctions :
  - Un bouton (en haut à droite de la carte) permettant de changer du premier au second tour
  - Un bouton permettant de choisir les résultats à afficher par candidats [de manière à avoir un point de vue national des résultats du candidat choisi]
  - Une On-click function permettant de sélectionner une commune et d'obtenir les détails des résultats selon le tour sélectionné

Données :
Les données sont disponibles sur data.gouv.fr et ont été nettoyées par Tristan Guerra en date du 15 avril 2022 pour le premier tour et du 25 avril 2022 pour le second. 
Les départements en dehors de la france métropolitaine sont représentés par des points se situant sur la carte en direction de là où ils se situent sur le globe.
Les français à l'étranger sont aggrégés en un point se situant à la position X [à définir].
