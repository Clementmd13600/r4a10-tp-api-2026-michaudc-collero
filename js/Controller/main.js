import { Sumotori } from '../Model/Sumotori.js';
import { Favoris } from '../Model/Favoris.js';
import { SumoView } from '../View/SumoView.js';

// Initialisation des composants
const favoris = new Favoris();
const view = new SumoView();

// Récupération des éléments interactifs
const input = document.getElementById('sumoInput');
const searchBtn = document.getElementById('searchBtn');
const favBtn = document.getElementById('favBtn');
const favList = document.getElementById('favList');
const suggestionBox = document.getElementById('suggestionBox');


let debounceTimer;
// Variable d'état pour savoir quel sumo est actuellement affiché
let currentSumo = null;

/**
 * GESTION DE LA RECHERCHE 
 */
let recherche;
searchBtn.addEventListener('click', recherche = async () => {
    let nameInput = input.value.trim();
    if (!nameInput) return;

    view.chargement(true);
    
    try {

        currentSumo = await Sumotori.rechercher(nameInput);

        if (!currentSumo) {
            throw new Error("Lutteur introuvable");
        }
        view.afficherSumo(currentSumo);
        view.changementetoile(favoris.estFavori(currentSumo.name));
        
    } catch (e) {
        alert("Le sumo " + nameInput + " n'existe pas");
    } finally {
        view.chargement(false);
    }
    return "ok";
});

/**
 * GESTION DU BOUTON FAVORIS 
 */
favBtn.addEventListener('click', () => {
    if (!currentSumo) return; // On ne fait rien si aucun sumo n'est affiché
    
    const name = currentSumo.name;
    
    // Si il est dans les favoris 
    if (favoris.estFavori(currentSumo.name)) { 
        favoris.supprimerFavori(currentSumo.name);
        view.changementetoile(false);
    } else {
        favoris.ajouterFavori(currentSumo); // Ici on envoie l'objet complet pour le rang
        view.changementetoile(true);
    }
    // On rafraîchit la liste des favoris
    view.afficherFavoris(favoris.Obtenir());
});

/**
 * GESTION DU CLIC SUR LA LISTE DES FAVORIS 
 */

favList.addEventListener('click', (e) => {
    // On récupère le nom stocké dans le data-attribute
    const name = e.target.dataset.name; 

    // Cas 1 : Clic sur la croix 
    if (e.target.classList.contains('delete-fav')) {
        favoris.supprimerFavori(name);
        view.afficherFavoris(favoris.Obtenir());
        
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
    view.afficherFavoris(favoris.Obtenir());
});


sortBtn.addEventListener('click', () => {
    // 1. On demande au modèle de trier son tableau interne
    favoris.trierParRang();
    
    // 2. On demande à la vue de ré-afficher la liste maintenant triée
    view.afficherFavoris(favoris.Obtenir());
    
    console.log("Liste triée par rang !");
});

//à l'utilisation d'un espace
window.addEventListener("keypress",async function(event) {
        // On simule le clic de recherche
  if (event.key === "Enter") {

        await recherche();
        let sumo_nom = this.document.querySelector('#sumoInput');
        sumo_nom.value  = document.querySelector('.sumo-display-card h2').textContent;
  } 
})


/**
 * GESTION DE L'AUTO-COMPLÉTION (SUGGESTIONS)
 */
input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();

    // On efface le timer précédent (Debounce)
    clearTimeout(debounceTimer);

    // Si l'input est vide, on cache les suggestions
    if (query.length < 2) {
        suggestionBox.innerHTML = '';
        return;
    }

    // On attend 300ms après la fin de la frappe pour lancer la recherche
    debounceTimer = setTimeout(async () => {
        try {
            // On récupère la liste des sumos (on réutilise l'API)
            const response = await fetch(`https://www.sumo-api.com/api/rikishis`);
            const data = await response.json();

            // On filtre les noms qui commencent par ou contiennent la saisie
            const matches = data.records
                .filter(r => r.shikonaEn.toLowerCase().includes(query))
                .slice(0, 5); // On limite à 5 suggestions pour la lisibilité

            afficherSuggestions(matches);
        } catch (error) {
            console.error("Erreur lors des suggestions", error);
        }
    }, 300);
});

/**
 * Fonction pour construire le menu déroulant dans la vue
 */
function afficherSuggestions(list) {
    suggestionBox.innerHTML = ''; // On vide le précédent

    if (list.length === 0) return;

    list.forEach(sumo => {
        const div = document.createElement('div');
        div.classList.add('suggestion-item');
        div.textContent = sumo.shikonaEn;

        // Quand on clique sur une suggestion
        div.addEventListener('click', () => {
            input.value = sumo.shikonaEn; // On remplit l'input
            suggestionBox.innerHTML = ''; // On vide les suggestions
            searchBtn.click();            // On lance la recherche automatiquement
        });

        suggestionBox.appendChild(div);
    });
}

// Fermer les suggestions si on clique ailleurs sur la page
document.addEventListener('click', (e) => {
    if (e.target !== input) {
        suggestionBox.innerHTML = '';
    }
});