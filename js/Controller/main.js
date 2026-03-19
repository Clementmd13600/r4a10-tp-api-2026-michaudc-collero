import { Sumotori } from '../Model/Sumotori.js';
import { Storage } from '../Model/Storage.js';
import { SumoView } from '../View/SumoView.js';

// Initialisation des composants
const storage = new Storage();
const view = new SumoView();

// Récupération des éléments interactifs
const input = document.getElementById('sumoInput');
const searchBtn = document.getElementById('searchBtn');
const favBtn = document.getElementById('favBtn');
const favList = document.getElementById('favList');

// Variable d'état pour savoir quel sumo est actuellement affiché
let currentSumo = null;

/**
 * GESTION DE LA RECHERCHE 
 */
searchBtn.addEventListener('click', async () => {
    let nameInput = input.value.trim().toLowerCase();

    // On lance l'état de chargement
    view.chargement(true);
    
    try {
        // Appel asynchrone à l'API Sumo
        const response = await fetch(`https://www.sumo-api.com/api/rikishis`);
        const data = await response.json();
    
        // On cherche dans les résultats celui qui correspond au nom tapé
        const foundData = data.records.find(r => 
            // .includes permet que quand tu mets le bout du nom du sumo ca te trouve les infos du nom complet
            r.shikonaEn.toLowerCase().includes(nameInput)
        );

        if (!foundData) {
            throw new Error("Lutteur introuvable");
        }

        // On instancie le modèle avec les données reçues
        currentSumo = new Sumotori(foundData);
        
        // On met à jour la vue
        view.afficherSumo(currentSumo);
        
        // On vérifie si ce sumo est déjà dans nos favoris pour colorer l'étoile
        const estDejaFavori = storage.estFavori(currentSumo.name);
        view.changementetoile(estDejaFavori);
        
    } catch (e) {
        alert("Lutteur non trouvé. Essayez 'Asanoyama' ou 'Hakuho'.");
    } finally {
        // On arrête le loader
        view.chargement(false);
    }
});

/**
 * GESTION DU BOUTON FAVORIS 
 */
favBtn.addEventListener('click', () => {
    if (!currentSumo) return; // On ne fait rien si aucun sumo n'est affiché
    
    const name = currentSumo.name;
    
    // Si il est dans les favoris 
    if (storage.estFavori(name)) {
        storage.supprimerFavori(name);
        view.changementetoile(false); // On repasse l'étoile en blanc
    } else {
        storage.ajouterFavori(name);
        view.changementetoile(true); // On passe l'étoile en jaune
    }
    
    // On rafraîchit la liste des favoris
    view.afficherFavoris(storage.getFavoris());
});

/**
 * GESTION DU CLIC SUR LA LISTE DES FAVORIS 
 */

favList.addEventListener('click', (e) => {
    // On récupère le nom stocké dans le data-attribute
    const name = e.target.dataset.name; 

    // Cas 1 : Clic sur la croix 
    if (e.target.classList.contains('delete-fav')) {
        storage.supprimerFavori(name);
        view.afficherFavoris(storage.getFavoris());
        
        if (currentSumo && currentSumo.name === name) {
            view.changementetoile(false);
        }
    } 
    
    // Cas 2 : Clic sur le bouton du sumo 
    else if (e.target.classList.contains('btn-select-sumo')) {
        // On remplit l'input
        input.value = name;   
        // On simule le clic de recherche
        searchBtn.click();       
    }
});

/**
 * CHARGEMENT INITIAL
 */
window.addEventListener('DOMContentLoaded', () => {
    // Au chargement de la page, on affiche les favoris déjà sauvegardés
    view.afficherFavoris(storage.getFavoris());
});