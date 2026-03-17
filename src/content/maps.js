const LANG_KEYWORDS = {

};

const PROMPT_KEYWORDS = {

}

const CATEGORY_KEYWORDS = {
    marketing: {
        it: ["Mercato", "Prodotto", "Prezzo", "Promozione", "Strategico", "Aziendale"],
        en: ["Target", "Branding", "Social Media", "Market", "Internet"]
    },
    finance: {
        it: ["Analisi", "Economia", "Azioni", "Obbligazioni", "Derivati", "Portafoglio", "Tassi", "Liquidità", "Rischio", "Rendimento"],
        en: ["Trading", "Rating", "Cash Flow"]
    },
    health: {
        it: ["Salute", "Benessere", "Buona Salute", "Condizioni", "Sanità", "Educazione sanitaria"],
        en: ["Well-being", "Healthiness", "Healthcare", "Benefit", "Cost", "Nurse", "Doctor"]
    },
    sports: {
        it: ["Attività di squadra", "Individuali", "Giocare", "Attrezzature", "Luoghi", "Calcio"],
        en: ["Stretching", "Fair play", "Cricket", "Hockey", "Tennis", "Pallavolo", "Ping-pong", "Baseball", "Rugby", "Football americano"]
    },
    politics: {
        it: ["Stato", "Senato", "Governo", "Politologo", "Movimento politico", "Sindacato", "Cittadinanza", "Democrazia", "Solidarismo", "Strumentalizzazione", "Ideologie", "Partiti", "Istituti", "Ministro degli interni", "Polizia di Stato", "Armi", "Difesa", "Pubblico"],
        en: ["President", "Prime Minister", "Member of Parliament", "Politics", "Politician", "Bedfellow", "Party", "Coalition", "Alliance", "Election", "Vote", "Ballot", "Majority", "Full Majority"]
    },
    culture: {
        it: [],
        en: []
    },
    climate: {
        it: [],
        en: []
    },
    coding: {
        it: [],
        en: []
    }
    // education
    // science
    // history
    // philosophy
    // psychology
    // travel
    // food
    // fashion
    // relationships
    // self_improvement
    // art
    // music
    // writing
    // film
    // gaming
    // ai
    // cybersecurity
    // law
    // sustainability    
}

const SAFETY_KEYWORDS = {}

export { PROMPT_KEYWORDS, CATEGORY_KEYWORDS, LANG_KEYWORDS, SAFETY_KEYWORDS }