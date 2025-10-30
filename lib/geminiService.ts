import {
  GoogleGenerativeAI,
  GenerationConfig,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Pega a chave do .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY não está definida no .env");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig: GenerationConfig = {
  temperature: 0.8,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// =================================
// NOVA FUNÇÃO 1: Sugerir Temas (em JSON)
// =================================
export async function generateThemeSuggestions(serviceType: string) {
  //

  const generationConfigWithJson: GenerationConfig = {
    ...generationConfig,
    responseMimeType: "application/json", // A MÁGICA!
  };

  const prompt = `
    Você é um assistente teológico especialista em homilética.
    O tipo de culto é: "${serviceType}".

    Gere 3 sugestões de temas para sermões baseados nesse tipo de culto.

    Responda APENAS em formato JSON, seguindo este schema:
    {
      "themes": [
        {
          "theme": "Nome do Tema",
          "description": "Uma breve descrição (1-2 frases) do tema.",
          "key_verse": "João 3:16"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: generationConfigWithJson,
      safetySettings,
    });
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Erro ao gerar sugestões de temas:", error);
    throw new Error("Falha ao se comunicar com a IA para sugerir temas.");
  }
}

// =================================
// NOVA FUNÇÃO 2: Gerar Sermão Completo (em JSON)
// =================================
export async function generateFullSermon(
  serviceType: string,
  theme: string,
  keyVerse: string
) {
  const generationConfigWithJson: GenerationConfig = {
    ...generationConfig,
    responseMimeType: "application/json", // A MÁGICA DE NOVO!
  };

  const prompt = `
    Você é um assistente teológico especialista em homilética.
    Sua tarefa é criar um esboço detalhado para um sermão.

    - Tipo de Culto: "${serviceType}"
    - Tema Principal: "${theme}"
    - Versículo-Chave: "${keyVerse}"

    Gere um esboço completo, incluindo título, introdução, 3 pontos principais (cada um com explicação e versículos de apoio), e uma conclusão.

    Responda APENAS em formato JSON, seguindo este schema:
    {
      "title": "Um Título Criativo para o Sermão",
      "introduction": "Um parágrafo de introdução (3-5 frases) que captura a atenção e apresenta o tema.",
      "mainPoints": [
        {
          "title": "Ponto Principal 1",
          "explanation": "Explicação detalhada do Ponto 1.",
          "scriptureReferences": ["Mateus 5:14", "Salmos 119:105"]
        },
        {
          "title": "Ponto Principal 2",
          "explanation": "Explicação detalhada do Ponto 2.",
          "scriptureReferences": ["Romanos 12:2"]
        },
        {
          "title": "Ponto Principal 3",
          "explanation": "Explicação detalhada do Ponto 3.",
          "scriptureReferences": ["Tiago 1:22", "1 João 3:18"]
        }
      ],
      "conclusion": "Um parágrafo de conclusão (3-5 frases) que resume os pontos e faz um apelo à ação."
    }
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: generationConfigWithJson,
      safetySettings,
    });
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Erro ao gerar sermão completo:", error);
    throw new Error("Falha ao se comunicar com a IA para gerar o sermão.");
  }
}
