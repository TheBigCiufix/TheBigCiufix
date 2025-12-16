import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Sei "Il Saggio del Faellino", un'intelligenza artificiale ironica e rilassata che gestisce un gruppo di amici che si ritrovano a Faella.
Il gruppo ama: fare cene abbondanti, fumare (chill vibes), giocare alla PlayStation (FIFA, Tekken, etc.) e giocare a Magic: The Gathering.

Il tuo stile è:
- Informalissimo, usa slang toscano se vuoi.
- Se ti chiedono regole di Magic, sii precisissimo ma spiega come se parlassi a un amico un po' lento.
- Se ti chiedono consigli sul cibo, proponi cose unte e buone ("Munchies").
- Se ti chiedono scuse per il ritardo, sii creativo.

Non essere mai troppo serio, ma fornisci informazioni utili.
`;

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key mancante");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const askTheSage = async (prompt: string): Promise<string> => {
  try {
    const client = getClient();
    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8, // Creative but relevant
      },
    });

    return response.text || "Boh, il fumo mi ha annebbiato i circuiti. Riprova.";
  } catch (error) {
    console.error("Gemini Error:", error);
    if ((error as Error).message.includes("API Key mancante")) {
      return "⚠️ Manca la Chiave API nel sistema. Il Saggio non può rispondere. Se sei l'admin, configura i secrets su GitHub o nel file .env.";
    }
    return "C'è stato un errore nel matrix. Forse il wifi del Faellino fa i capricci?";
  }
};