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

const generatePrompt = (config: PromptConfig): string => {
  const { tabKey, customQuery, existingTitles = [] } = config;

  const exclusionClause = existingTitles.length > 0
    ? `\n\nCRITICAL: Do not include any articles with the following titles, as they have already been shown: ${existingTitles.map(t => `"${t}"`).join(', ')}.`
    : '';

  const outputFormatInstructions = `
    Output Format:
    - You MUST return a stream of individual JSON objects.
    - Each JSON object MUST be a complete, valid JSON object.
    - Do NOT wrap the objects in a JSON array or use markdown like \`\`\`.
    - Do NOT include ANY text or explanation before or after the JSON objects.
    - Your entire response must consist only of these JSON objects.
    - Each JSON object MUST have this exact structure:
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
        Task: Find, analyze, and summarize the top 10 most recent and impactful technical updates, tool releases, and research findings from the last 48 hours exclusively about NVIDIA technologies.

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
        Task: Find, analyze, and summarize the top 10 most recent and impactful technical updates, tool releases, and research findings from the last 48 hours for a broad AI development and research team.

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
        Task: Perform a deep research dive into the user's specific technical query. Find the top 10 most relevant and recent news articles, technical blog posts, or official documentation releases related to this query from the last 48 hours.
        
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
        return ''; // Should not be reached
  }
};

interface StreamCallbacks {
  onArticle: (article: NewsArticle) => void;
  onSources: (sources: GroundingChunk[]) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export const streamNews = async (
  config: PromptConfig,
  callbacks: StreamCallbacks
): Promise<void> => {
  if (config.tabKey === 'CUSTOM' && (!config.customQuery || config.customQuery.trim() === '')) {
    callbacks.onComplete();
    return;
  }

  try {
    const prompt = generatePrompt(config);
    if (!prompt) {
      callbacks.onError(new Error("Invalid tab configuration provided."));
      return;
    }
    
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an API that returns data in JSON format. You do not provide conversational text, summaries, or any output that is not a valid JSON object matching the user's requested schema.",
        tools: [{ googleSearch: {} }],
      },
    });

    let buffer = '';
    const allSources = new Map<string, GroundingChunk>();

    const processBuffer = () => {
      while (true) {
        const firstOpen = buffer.indexOf('{');
        if (firstOpen === -1) {
          if (buffer.trim() === '') buffer = '';
          return;
        }

        if (firstOpen > 0) {
          buffer = buffer.substring(firstOpen);
        }

        let braceCount = 1;
        let searchIndex = 1;
        let end = -1;

        while (searchIndex < buffer.length) {
          const char = buffer[searchIndex];
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
          }
          if (braceCount === 0) {
            end = searchIndex;
            break;
          }
          searchIndex++;
        }

        if (end !== -1) {
          const jsonString = buffer.substring(0, end + 1);
          buffer = buffer.substring(end + 1);
          try {
            const article: NewsArticle = JSON.parse(jsonString);
            callbacks.onArticle(article);
          } catch (e) {
            console.warn("Could not parse chunk as JSON, skipping:", jsonString, e);
          }
        } else {
          return;
        }
      }
    };

    for await (const chunk of responseStream) {
      const sources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
      for (const source of sources) {
        if (source.web?.uri) {
          allSources.set(source.web.uri, source);
        }
      }
      buffer += chunk.text;
      processBuffer();
    }
    
    processBuffer();
    callbacks.onSources(Array.from(allSources.values()));
    callbacks.onComplete();

  } catch (error) {
    console.error("Error streaming news from Gemini API:", error);
    const err = error instanceof Error 
      ? error 
      : new Error("Failed to stream news from the AI. The model may have returned an unexpected format.");
    callbacks.onError(err);
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