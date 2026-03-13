
export class Favoris {
    constructor() {
        // Clé pour isoler les données de l'application dans le localStorage
        this.key = "sumo_favs";
    }

    /**
     * Récupère et désérialise les favoris depuis le stockage local
     * @returns {string[]} Tableau des noms 
     */
    getFavoris() {
        // On récupère la chaîne de caractères brute du localStorage
        const data = localStorage.getItem(this.key);

        // On vérifie si la donnée existe
        if (data !== null) {
            // On transforme la chaîne JSON en tableau
            return JSON.parse(data);
        } else {
            // Si la clé n'existe pas encore, on renvoie un tableau vide
            return [];
        }
    }

    /**
     * Ajoute un nouveau lutteur aux favoris s'il n'y figure pas déjà
     * @param {string} name - Le nom du sumo à enregistrer
     */
    ajouterFavori(name) {
        // On récupère l'état actuel des favoris
        const favs = this.getFavoris();

        // Si le nom n'y est pas déjà
        if (!favs.includes(name)) {
            
            // On l'ajoute
            favs.push(name);

            // On met à jour le localStorage
            localStorage.setItem(this.key, JSON.stringify(favs));
        }
    }

    /**
     * Supprime un sumo des favoris et met à jour le stockage local
     * @param {string} name - Le nom unique du sumo à retirer
     */
    supprimerFavori(name) {
        // On récupère la liste actuelle
        const listeActuelle = this.getFavoris();

        // On créer un nouveau tableau grâce à filter mais sans le sumo qu'on veut supprimer
        const listeMiseAJour = listeActuelle.filter(s => s !== name);

        // On transforme le nouveau tableau en texte (JSON) et on l'écrase dans le storage
        const donneesJSON = JSON.stringify(listeMiseAJour);
        localStorage.setItem(this.key, donneesJSON);
    }

    /**
     * Vérifie l'existence d'un sumo dans la liste des favoris
     * @param {string} name - Le nom du sumo à tester
     * @returns {boolean} True si le nom est présent, false sinon
     */
    estFavori(name) {
        // On récupère le tableau actuel
        const listeDesFavoris = this.getFavoris();

        // On parcours le tableau avec .includes et on renvoie true s'il est dedans, false sinon
        return listeDesFavoris.includes(name);
    }
}