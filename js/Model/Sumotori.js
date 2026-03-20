export class Sumotori {
    constructor(data) {
        this.name = data.shikonaEn || "Inconnu";
        this.weight = data.weight || "N/A";
        this.height = data.height || "N/A";
        this.rank = data.currentRank || "Non classé";
        this.origin = data.shusshin || "Origine inconnue";
        this.birthDate = this.#formatDateNaissanceEu(data.birthDate);
        this.age = this.#calculerAge(data.birthDate);
    }

    /**
     * Nettoie et formate la date : YYYY-MM-DDT00:00:00Z -> DD/MM/YYYY
     */
    #formatDateNaissanceEu(dateStr) {
        if (!dateStr) return "Inconnue";

        // On enlève tout ce qui se trouve après le 'T' sinon tres moche comme retour
        const dateSeule = dateStr.split('T')[0];

        const [year, month, day] = dateSeule.split('-');
        
        return `${day}/${month}/${year}`;
    }

    // donne l'age actuel
    #calculerAge(dateStr) {
        if (!dateStr) return "N/A";
        const birthDate = new Date(dateStr);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    /**
     * Méthode statique pour récupérer un lutteur via l'API
     * @param {string} nameInput - Le nom tapé par l'utilisateur
     * @returns {Promise<Sumotori|null>} Une instance de Sumotori ou null
     */
    static async rechercher(nameInput) {
        try {
            const response = await fetch(`https://www.sumo-api.com/api/rikishis`);
            const data = await response.json();

            // On cherche. Si on ne trouve rien, 'foundData' sera 'undefined'
            const foundData = data.records.find(r => 
                r.shikonaEn.toLowerCase().includes(nameInput.toLowerCase())
            );

            // On ne crée l'objet que si on a des données. Sinon on renvoie null.
            if (foundData) {
                return new Sumotori(foundData);
            } else {
                return null; 
            }
        } catch (err) {
            return null;
        }
    }
}