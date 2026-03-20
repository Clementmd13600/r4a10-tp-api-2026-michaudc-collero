import { Sumotori } from '../Model/Sumotori.js';
import { Favoris } from '../Model/Favoris.js';
import { SumoView } from '../View/SumoView.js';

// --- INITIALISATION DES COMPOSANTS ---
const favoris = new Favoris();
const view = new SumoView();

// Récupération des éléments du DOM pour les interactions
const input = document.getElementById('sumoInput');
const searchBtn = document.getElementById('searchBtn');
const favBtn = document.getElementById('favBtn');
const favList = document.getElementById('favList');
const suggestionBox = document.getElementById('suggestionBox');

/**
 * Variables d'état 
 * debounceTimer : utilisé pour limiter les appels API lors de la saisie (optimisation)
 * currentSumo : garde en mémoire le dernier lutteur chargé avec succès
 */
let debounceTimer;
let currentSumo = null;

/**
 * GESTION DE LA RECHERCHE 
 */
let recherche;
searchBtn.addEventListener('click', recherche = async () => {
    let nameInput = input.value.trim();
    if (!nameInput) return;

    view.chargement(true); // Feedback visuel 
    
    try {
        // Appel à la méthode statique du Modèle pour récupérer les données de l'API
        currentSumo = await Sumotori.rechercherSumo(nameInput);

        if (!currentSumo) {
            throw new Error("Lutteur introuvable");
        }
        
        // Mise à jour de l'UI avec les nouvelles données
        view.afficherSumo(currentSumo);
        // Vérification dynamique du statut "Favori" pour l'icône étoile
        view.changementetoile(favoris.estFavori(currentSumo.name));
        
    } catch (e) {
        alert("Le sumo " + nameInput + " n'existe pas");
    } finally {
        view.chargement(false); // On cache le loader peu importe le résultat
    }
    return "ok";
});

/**
 * GESTION DU BOUTON FAVORIS 
 */
favBtn.addEventListener('click', () => {
    if (!currentSumo) return; 
    
    // Si présent on supprime, sinon on ajoute
    if (favoris.estFavori(currentSumo.name)) { 
        favoris.supprimerFavori(currentSumo.name);
        view.changementetoile(false);
    } else {
        // On passe l'objet complet pour enregistrer le NOM et le RANG
        favoris.ajouterFavori(currentSumo); 
        view.changementetoile(true);
    }
    // Synchronisation de la vue avec le localStorage
    view.afficherFavoris(favoris.Obtenir());
});

/**
 * GESTION DE LA DÉLÉGATION D'ÉVÉNEMENTS (Performance)
 * Au lieu de mettre un listener sur chaque <li>, on en met un seul sur le parent favList
 * On identifie l'élément cliqué via e.target et ses classes CSS.
 */
favList.addEventListener('click', (e) => {
    // Récupération de la donnée métier via l'attribut data-name (Dataset)
    const name = e.target.dataset.name; 

    // Cas 1 : Suppression d'un favori
    if (e.target.classList.contains('delete-fav')) {
        favoris.supprimerFavori(name);
        view.afficherFavoris(favoris.Obtenir());
        
        // Mise à jour de l'étoile si le lutteur supprimé est celui affiché à l'écran
        if (currentSumo && currentSumo.name === name) {
            view.changementetoile(false);
        }
    } 
    
    // Cas 2 : Sélection d'un favori pour affichage
    else if (e.target.classList.contains('btn-select-sumo')) {
        input.value = name;   
        searchBtn.click(); // Déclenchement programmatique de la recherche      
    }
});

/**
 * CYCLE DE VIE : CHARGEMENT INITIAL
 */
window.addEventListener('DOMContentLoaded', () => {
    // Initialisation de la vue avec les données stockées au démarrage de l'application
    view.afficherFavoris(favoris.Obtenir());
});

/**
 * TRI PAR RANG 
 */
sortBtn.addEventListener('click', () => {
    // Le tri est géré par le Modèle 
    favoris.trierParRang();
    // Restitution du tableau réordonné
    view.afficherFavoris(favoris.Obtenir());
});

/**
 * Touche Entrée au lieu d'appuyer sur la loupe pour rechercher son sumo
 */
window.addEventListener("keypress", async function(event) {
  if (event.key === "Enter") {
        await recherche();
        let sumo_nom = this.document.querySelector('#sumoInput');
        sumo_nom.value = document.querySelector('.sumo-display-card h2').textContent;
  } 
});

/**
 * Quand on commence à mettre un nom ca nous met des suggestions de nom de sumo
 */
input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    clearTimeout(debounceTimer);

    if (query.length < 2) {
        suggestionBox.innerHTML = '';
        return;
    }

    debounceTimer = setTimeout(async () => {
        try {
            const response = await fetch(`https://www.sumo-api.com/api/rikishis`);
            const data = await response.json();

            const matches = data.records
                .filter(r => r.shikonaEn.toLowerCase().includes(query))
                .slice(0, 5); 

            afficherSuggestions(matches);
        } catch (error) {
            console.error("Erreur suggestions", error);
        }
    }, 300);
});

/**
 * Rendu des suggestions 
 */
function afficherSuggestions(list) {
    suggestionBox.innerHTML = ''; 

    list.forEach(sumo => {
        const div = document.createElement('div');
        div.classList.add('suggestion-item');
        div.textContent = sumo.shikonaEn;

        div.addEventListener('click', () => {
            input.value = sumo.shikonaEn;
            suggestionBox.innerHTML = ''; 
            recherche(); // Recherche auto après sélection
        });

        suggestionBox.appendChild(div);
    });
}