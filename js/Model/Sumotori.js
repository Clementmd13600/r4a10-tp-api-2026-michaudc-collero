export class Sumotori {
    constructor(data) {
        this.name = data.shikonaEn || "Inconnu";
        this.weight = data.weight || "N/A";
        this.height = data.height || "N/A";
        this.rank = data.currentRank || "Non classé";
        this.origin = data.shusshin || "Origine inconnue";
        this.birthDate = this.formatDate(data.birthDate);
        this.age = this.calculateAge(data.birthDate);
    }

    /**
     * Nettoie et formate la date : YYYY-MM-DDT00:00:00Z -> DD/MM/YYYY
     */
    formatDate(dateStr) {
        if (!dateStr) return "Inconnue";

        // On enlève tout ce qui se trouve après le 'T' sinon tres moche comme retour
        const dateSeule = dateStr.split('T')[0];

        const [year, month, day] = dateSeule.split('-');
        
        return `${day}/${month}/${year}`;
    }

    // donne l'age actuel
    calculateAge(dateStr) {
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
}