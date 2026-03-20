
export class Favoris {
    constructor() {
        // Clé pour isoler les données de l'application dans le localStorage
        this.key = "sumo_favs";
    }

    /**
     * Récupère et désérialise les favoris depuis le stockage local
     * @returns {string[]} Tableau des noms 
     */
    Obtenir() {
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
     * Ajoute un objet sumo aux favoris s'il n'y figure pas déjà
     * @param {Object} sumo - L'objet complet du lutteur (contient .name et .rank)
     */
    ajouterFavori(sumo) {
        const favs = this.Obtenir();

        // On vérifie si le nom du sumo n'est pas déjà dans la liste d'objets
        // .some() renvoie vrai si au moins un élément correspond à la condition
        const existeDeja = favs.some(f => f.name === sumo.name);

        if (!existeDeja) {
            // On crée un petit objet propre avec juste ce dont on a besoin
            const nouveauFav = {
                name: sumo.name,
                rank: sumo.rank
            };
            
            favs.push(nouveauFav);

            // On met à jour le localStorage
            localStorage.setItem(this.key, JSON.stringify(favs));
        }
    }

    /**
     * Supprime un sumo des favoris et met à jour le stockage local
     * @param {string} name - Le nom unique du sumo à retirer
     */
    supprimerFavori(nameASupprimer) {
        // On récupère la liste actuelle (qui contient des objets {name, rank})
        const favs = this.Obtenir();

        // On ne garde que les sumos dont le NOM est différent de celui qu'on veut supprimer
        const nouvelleListe = favs.filter(f => f.name !== nameASupprimer);

        // On enregistre la nouvelle liste filtrée
        localStorage.setItem(this.key, JSON.stringify(nouvelleListe));
        
        // On met à jour la liste interne de l'instance si tu en as une
        this.liste = nouvelleListe; 
    }

    /**
     * Vérifie l'existence d'un sumo dans la liste des favoris
     * @param {string} name - Le nom du sumo à tester
     * @returns {boolean} True si le nom est présent, false sinon
     */
    estFavori(nomCherche) {
        const favs = this.Obtenir(); // Récupère la liste [{name:...}, {name:...}]
        
        // .some renvoie true si au moins un objet a le bon nom
        return favs.some(f => f.name === nomCherche);
    }

    /**
     * Transforme l'objet JavaScript en chaîne JSON pour le stockage local.
     */
    sauvegarder() {
        localStorage.setItem(this.key, JSON.stringify(this.liste));
    }

    /**
     * ALGORITHME DE TRI PAR RANG 
     */
    trierParRang() {
        // On s'assure de travailler sur les données les plus récentes
        this.liste = this.Obtenir();

        /**
         * Hiérarchie des rangs de sumo
         */
        const hierarchie = [
            "Yokozuna", "Ozeki", "Sekiwake", "Komusubi", "Maegashira", "Juryo", "Makushita", "Sandanme", "Jonidan", "Jonokuchi"
        ];

        /**
         * La méthode .sort() modifie le tableau en place.
         * Elle utilise une fonction de comparaison (a, b).
         */
        this.liste.sort((a, b) => {
            // .findIndex() cherche la position de la division dans notre référentiel
            // .includes() est utilisé car le rang complet peut être "Maegashira 14 East"
            const indexA = hierarchie.findIndex(r => a.rank.includes(r));
            const indexB = hierarchie.findIndex(r => b.rank.includes(r));

            /**
             * Gestion des erreurs (Rang non trouvé) :
             * Si findIndex renvoie -1, on assigne un score élevé (99) 
             * pour envoyer l'élément inconnu en fin de liste.
             */
            const scoreA = indexA === -1 ? 99 : indexA;
            const scoreB = indexB === -1 ? 99 : indexB;

            // Tri ascendant basé sur les index (0, 1, 2...)
            return scoreA - scoreB;
        });

        // Mise à jour du stockage permanent avec la liste réordonnée
        this.sauvegarder();
    }
}