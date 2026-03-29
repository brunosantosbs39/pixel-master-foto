import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface FloatingElement {
  type: 'notification' | 'badge' | 'label' | 'review' | 'icon-only' | 'stat' | 'pill' | 'headline' | 'subheadline' | 'bullet' | 'cta' | 'expert' | 'icon' | 'text';
  text: string;
  icon?: string;
  x?: number;
  y?: number;
  size?: number;
  opacity?: number;
  rotation?: number;
}

export interface CreativeCopy {
  headline: string[];
  sub: string;
  bullets: string[];
  cta: string;
  insight: string;
  keyword: string;
  floatingElements?: FloatingElement[];
}

export interface BrandIdentity {
  archetype: string;
  description: string;
  reasoning: string;
  typography: string;
  layout: string;
  brandColor?: string;
}

export const geminiService = {
  async generateCopy(framework: string, produto: string, publico: string, brandIdentity?: BrandIdentity): Promise<CreativeCopy> {
    const brandContext = brandIdentity ? `
      Contexto da Marca:
      - Arquétipo: ${brandIdentity.archetype}
      - Posicionamento: ${brandIdentity.description}
      - Estilo Visual: ${brandIdentity.reasoning}
    ` : '';

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Gere um copy para um criativo de alta conversão usando o framework ${framework}.
      Produto: ${produto}
      Público-alvo: ${publico}
      ${brandContext}
      
      Retorne um JSON com:
      - headline: array de 3 strings curtas e impactantes.
      - sub: uma frase curta de apoio.
      - bullets: array de 2 benefícios ou características.
      - cta: uma chamada para ação curta.
      - insight: uma breve explicação estratégica do porquê esse copy funciona.
      - keyword: uma descrição detalhada em inglês para gerar uma imagem de fundo realista do ambiente de trabalho relacionado ao nicho (ex: "modern physiotherapy clinic with equipment", "luxury law office", "minimalist dental studio", "high-end aesthetic clinic"). Foque no AMBIENTE e CENÁRIO.
      - floatingElements: array de objetos com { type: 'notification' | 'badge' | 'label' | 'review' | 'icon-only' | 'stat' | 'pill', text: string, icon: string (lucide icon name) }. Crie elementos que flutuam no criativo para dar prova social ou urgência (ex: "5 estrelas", "Vagas limitadas", "Nova Venda!", "Cliente Satisfeito").`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.ARRAY, items: { type: Type.STRING } },
            sub: { type: Type.STRING },
            bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
            cta: { type: Type.STRING },
            insight: { type: Type.STRING },
            keyword: { type: Type.STRING },
            floatingElements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  text: { type: Type.STRING },
                  icon: { type: Type.STRING },
                },
                required: ["type", "text"],
              },
            },
          },
          required: ["headline", "sub", "bullets", "cta", "insight", "keyword"],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  },

  async identifyBrand(produto: string, publico: string): Promise<BrandIdentity> {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Analise o produto "${produto}" e o público "${publico}" para sugerir uma identidade visual de elite.
      
      Escolha entre estas opções de Tipografia:
      - cormorant (Autoridade Clássica)
      - playfair (Luxo Editorial)
      - space (Tech Moderno)
      - oswald (Bold Impact)
      - dm (Sofisticado)
      - bebas (Disruptivo)
      - luxury (Prestigio Real)
      - hardware (Hardware Studio)
      - brutal (Brutalismo Puro)
      - editorial-bold (Editorial Bold)
      
      Escolha entre estes Layouts:
      - classic
      - centered
      - bold
      - editorial
      - split
      - basecenter
      - minimal
      - brutalist
      - magazine
      - atmospheric
      - hardware
      - luxury
      
      Retorne um JSON com:
      - archetype: o arquétipo de marca sugerido (ex: "O Governante", "O Mago").
      - description: uma breve descrição do posicionamento.
      - reasoning: por que essa tipografia e layout foram escolhidos.
      - typography: o ID da tipografia escolhida.
      - layout: o ID do layout escolhido.
      - brandColor: uma cor hexadecimal sugerida que combine com o nicho.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            description: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            typography: { type: Type.STRING },
            layout: { type: Type.STRING },
            brandColor: { type: Type.STRING },
          },
          required: ["archetype", "description", "reasoning", "typography", "layout", "brandColor"],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  },

  async analyzeDesign(imageBase64: string, mimeType: string): Promise<BrandIdentity> {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        {
          text: `Analise este design e extraia sua essência visual para replicarmos.
          Identifique a cor predominante da marca, o estilo tipográfico e o layout.
          
          Opções de Tipografia: cormorant, playfair, space, oswald, dm, bebas, luxury, hardware, brutal, editorial-bold.
          Opções de Layout: classic, centered, bold, editorial, split, basecenter, minimal, brutalist, magazine, atmospheric, hardware, luxury.
          
          Retorne um JSON com:
          - archetype: o arquétipo que este design transmite.
          - description: o que este design comunica.
          - reasoning: análise técnica do design.
          - typography: o ID da tipografia que mais se aproxima.
          - layout: o ID do layout que mais se aproxima.
          - brandColor: a cor hexadecimal principal identificada.`,
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            description: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            typography: { type: Type.STRING },
            layout: { type: Type.STRING },
            brandColor: { type: Type.STRING },
          },
          required: ["archetype", "description", "reasoning", "typography", "layout", "brandColor"],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  },

  async analyzeBrandingBook(imageBase64: string, mimeType: string): Promise<BrandIdentity> {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        {
          text: `Você é um especialista em Branding e Design System. Analise este Branding Book / Manual de Identidade Visual (pode ser uma imagem ou um PDF).
          Sua missão é extrair as informações EXATAS da marca para que possamos aplicá-las com precisão cirúrgica em novos designs.
          
          Identifique e extraia com precisão:
          1. Cor Primária Principal: Procure pelo código Hexadecimal exato (ex: #FF5500). Se houver várias, escolha a de maior destaque.
          2. Tipografia: Analise o estilo das fontes. Escolha o ID que MAIS SE APROXIMA do estilo visual apresentado.
          3. Tom de Voz e Arquétipo: Qual a personalidade da marca? (Ex: Luxuosa, Rebelde, Cuidadora, Inovadora).
          4. Layout: Baseado na organização visual do manual, qual estrutura de design melhor representa essa marca?
          
          IDs de Tipografia disponíveis: cormorant, playfair, space, oswald, dm, bebas, luxury, hardware, brutal, editorial-bold.
          IDs de Layout disponíveis: classic, centered, bold, editorial, split, basecenter, minimal, brutalist, magazine, atmospheric, hardware, luxury.
          
          Retorne OBRIGATORIAMENTE um JSON com:
          - archetype: o arquétipo de marca identificado (ex: "O Criador", "O Herói").
          - description: um resumo executivo da identidade visual e posicionamento.
          - reasoning: explicação técnica de por que você escolheu essa tipografia, layout e cor com base no manual.
          - typography: o ID da tipografia escolhida.
          - layout: o ID do layout que melhor traduz a essência da marca.
          - brandColor: o código hexadecimal EXATO da cor principal da marca.`,
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            description: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            typography: { type: Type.STRING },
            layout: { type: Type.STRING },
            brandColor: { type: Type.STRING },
          },
          required: ["archetype", "description", "reasoning", "typography", "layout", "brandColor"],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  },

  async generateImage(prompt: string): Promise<string | null> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ text: `A professional, realistic, high-end background scene for a premium advertisement: ${prompt}. Cinematic lighting, shallow depth of field, blurred background, architectural photography style, 8k resolution, clean and spacious.` }],
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    }
    return null;
  },

  async generateVariations(prompt: string, count: number = 3): Promise<string[]> {
    const variations: string[] = [];
    const promises = Array.from({ length: count }).map((_, i) => {
      // Add slight variation to prompt to ensure different results
      const variedPrompt = `${prompt}. Variation ${i + 1}: ${['different angle', 'alternative lighting', 'slightly different composition', 'new perspective'][i % 4]}.`;
      return this.generateImage(variedPrompt);
    });

    const results = await Promise.all(promises);
    return results.filter((img): img is string => img !== null);
  },

  async blendImages(imageBase64List: string[], prompt: string): Promise<string | null> {
    try {
      const parts = imageBase64List.map(img => ({
        inlineData: {
          data: img.split(',')[1],
          mimeType: 'image/png',
        }
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
          ...parts,
          {
            text: `Create a new background image that blends the visual styles, lighting, and elements of these ${imageBase64List.length} images. The final result should be a cohesive, high-end background for: ${prompt}. Maintain the premium, professional aesthetic.`,
          },
        ],
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } catch (error) {
      console.error("Image blending failed:", error);
    }
    return null;
  },

  async enhanceImage(imageBase64: string, mimeType: string, extraPrompt: string): Promise<string | null> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
          {
            inlineData: {
              data: imageBase64.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: `Enhance this background image by adding these visual elements: ${extraPrompt}. Maintain the original style, lighting, and composition. The additions should look integrated and professional.`,
          },
        ],
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } catch (error) {
      console.error("Image enhancement failed:", error);
    }
    return null;
  },

  async checkCopyright(imageBase64: string, mimeType: string): Promise<{ risk: 'low' | 'medium' | 'high'; details: string }> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            inlineData: {
              data: imageBase64.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this image for potential copyright issues. Look for:
            1. Famous characters or logos.
            2. Distinctive artistic styles of living artists.
            3. Recognizable landmarks or private property that might require a release.
            4. Text or watermarks.
            
            Return a JSON with:
            - risk: "low", "medium", or "high".
            - details: a brief explanation of the findings.`,
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              risk: { type: Type.STRING, enum: ["low", "medium", "high"] },
              details: { type: Type.STRING },
            },
            required: ["risk", "details"],
          },
        },
      });

      return JSON.parse(response.text || '{"risk": "low", "details": "No issues found."}');
    } catch (error) {
      console.error("Copyright check failed:", error);
      return { risk: 'low', details: "Could not perform copyright check." };
    }
  }
};
