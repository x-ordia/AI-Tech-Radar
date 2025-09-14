import { GoogleGenAI, Type } from "@google/genai";
import type { NewsArticle, GroundingChunk } from '../types';
import { TAB_CONFIG, TabKey } from "../constants";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface PromptConfig {
  tabKey: TabKey;
  customQuery?: string;
  existingTitles: string[];
}

const generatePrompt = (config: PromptConfig, count: number): string => {
  const { tabKey, customQuery, existingTitles = [] } = config;

  const exclusionClause = existingTitles.length > 0
    ? `\n\nCRITICAL: Do not include any articles with the following titles, as they have already been shown: ${existingTitles.map(t => `"${t}"`).join(', ')}.`
    : '';

  const outputFormatInstructions = `
    Output Format:
    - You MUST return a single, valid JSON array of objects.
    - The array should contain exactly ${count} unique articles unless fewer are available.
    - Do NOT wrap the array in markdown like \`\`\`.
    - Do NOT include ANY text, explanation, or conversational filler before or after the JSON array. Your entire response must be ONLY the JSON array.
    - Each object in the array MUST have this exact structure:
    {
      "title": "string",
      "summary": "string",
      "sourceUrl": "string",
      "sourceTitle": "string"
    }
  `;
  
  switch(tabKey) {
    case 'NVIDIA':
      return `
        Task: Find, analyze, and summarize the top ${count} most recent and impactful technical updates, tool releases, and research findings from the last 48 hours exclusively about NVIDIA technologies.

        Your search MUST be strictly confined to the NVIDIA ecosystem. Focus on these specific domains: ${TAB_CONFIG.NVIDIA.domains.join(', ')}.

        CRITICAL: Do NOT include news about other companies (like AMD, Intel, Google, OpenAI) unless it is directly in the context of a partnership or integration with NVIDIA technology. General AI news is not relevant here.

        Prioritize content such as:
        - Updates to CUDA, TensorRT, and other NVIDIA SDKs.
        - News about new GPU architectures or performance benchmarks.
        - Developments in NVIDIA AI Enterprise, Omniverse, and DLSS.
        - Technical blog posts or research papers published by NVIDIA engineers.

        For each item, provide a 2-3 sentence summary explaining its technical significance for developers using NVIDIA hardware and software.
        ${exclusionClause}
        ${outputFormatInstructions}
      `;
    
    case 'TECH':
      return `
        Task: Find, analyze, and summarize the top ${count} most recent and impactful technical updates, tool releases, and research findings from the last 48 hours for a broad AI development and research team.

        Focus on a wide range of significant developments across these key domains: ${TAB_CONFIG.TECH.domains.join(', ')}.

        Prioritize content such as:
        - New open-source tool releases or significant updates to existing libraries (e.g., LangChain, Hugging Face, PyTorch, TensorFlow).
        - Launch of new developer platforms, APIs, or services from major tech companies.
        - Publication of influential research papers with practical implications from sources like arXiv, NeurIPS, etc.
        - Breakthroughs in AI model architecture (e.g., Transformers, Diffusion models), training techniques, or performance optimization.

        IMPORTANT: AVOID business-centric news like funding rounds, corporate partnerships, or market analysis. Focus on the technology itself.

        For each item, provide a 2-3 sentence summary explaining its technical significance and why it's important for developers or researchers in the AI field.
        ${exclusionClause}
        ${outputFormatInstructions}
      `;

    case 'CUSTOM':
      return `
        Task: Perform a deep research dive into the user's specific technical query. Find the top ${count} most relevant and recent news articles, technical blog posts, or official documentation releases related to this query from the last 48 hours.
        
        User's Query: "${customQuery}"

        Instructions:
        1. Your entire search must be focused ONLY on the user's query. Ignore broader tech news unless it is directly related to the query.
        2. Analyze the results for their technical significance and relevance to software developers and researchers.
        3. Summarize each finding in 2-3 sentences.
        4. Prioritize primary sources (e.g., official blogs, GitHub repos, research papers) when available.
        
        IMPORTANT: AVOID high-level business news. The goal is to find actionable technical information.
        ${exclusionClause}
        ${outputFormatInstructions}
      `;
    
    default:
        return '';
  }
};

const fetchNewsArticles = async (prompt: string): Promise<{articles: NewsArticle[], sources: GroundingChunk[]}> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    const text = response.text;
    
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
      console.warn("Could not find a valid JSON array in the model's response.", { responseText: text });
      return { articles: [], sources };
    }
    
    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const articles: NewsArticle[] = JSON.parse(jsonString);
    
    return { articles, sources };
  } catch (error) {
    console.error("Error fetching or parsing news from Gemini API:", error);
    throw new Error("Failed to fetch news from the AI. The model returned an unexpected format.");
  }
};

export async function* streamNews(
  config: PromptConfig,
  totalToFetch: number = 10
): AsyncGenerator<NewsArticle[], void, void> {
    if (config.tabKey === 'CUSTOM' && (!config.customQuery || config.customQuery.trim() === '')) {
      return;
    }

    const BATCH_SIZE = 4;
    let fetchedCount = 0;
    const allFetchedTitles = new Set<string>(config.existingTitles);

    while (fetchedCount < totalToFetch) {
        const remaining = totalToFetch - fetchedCount;
        const currentBatchSize = Math.min(BATCH_SIZE, remaining);
        if (currentBatchSize <= 0) break;

        const currentConfig = { ...config, existingTitles: Array.from(allFetchedTitles) };
        const prompt = generatePrompt(currentConfig, currentBatchSize);
        if (!prompt) {
          throw new Error("Invalid tab configuration provided.");
        }
        
        const { articles } = await fetchNewsArticles(prompt);
        
        const newUniqueArticles = articles.filter(a => a.title && !allFetchedTitles.has(a.title));

        if (newUniqueArticles.length > 0) {
            newUniqueArticles.forEach(a => allFetchedTitles.add(a.title));
            fetchedCount += newUniqueArticles.length;
            yield newUniqueArticles;
        }

        if (articles.length < currentBatchSize) {
            break;
        }
    }
};

export const validateQuery = async (query: string): Promise<{isValid: boolean; reason: string}> => {
  if (query.trim().length === 0) {
    return { isValid: false, reason: "Query cannot be empty." };
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the user's query. Is it related to technology, software development, AI, machine learning, computer science, developer tools, or hardware?
      
      User Query: "${query}"
      
      Respond with a single JSON object with two keys: "isValid" (boolean) and "reason" (a brief string explaining why, e.g., "The query is tech-related." or "The query is about cooking, not technology.").`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          }
        }
      }
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);

    return {
      isValid: result.isValid === true,
      reason: result.reason || "Validation failed."
    };
  } catch (error) {
    console.error("Error validating query:", error);
    return { isValid: false, reason: "Could not validate the query at this time." };
  }
};