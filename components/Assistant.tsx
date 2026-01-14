import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { MessageSquare, X, Send, Zap, Volume2, Loader2, Sparkles, Bot, StopCircle } from 'lucide-react';
import { MOCK_ASSETS, MOCK_ALERTS, CURRENCY_FORMATTER } from '../constants';

let ai: GoogleGenAI | null = null;

try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "dummy_key_for_dev" });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI client:", error);
}

// Audio Decoding Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Olá. Sou o Nexus AI, seu assistente patrimonial inteligente. Como posso ajudar com os dados da PCFH hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const getSystemContext = () => {
    const totalWealth = MOCK_ASSETS.reduce((acc, asset) => acc + asset.value, 0);
    const assetSummary = MOCK_ASSETS.map(a => `- ${a.name} (${a.category}): ${CURRENCY_FORMATTER.format(a.value)}`).join('\n');
    const alertSummary = MOCK_ALERTS.map(a => `- [${a.severity.toUpperCase()}] ${a.message}`).join('\n');

    return `Você é o assistente IA especializado para o Primo Couto Family Holdings (PCFH).
    
    DADOS ATUAIS DO SISTEMA:
    Patrimônio Total: ${CURRENCY_FORMATTER.format(totalWealth)}
    
    Carteira de Ativos:
    ${assetSummary}
    
    Alertas Ativos:
    ${alertSummary}
    
    INSTRUÇÕES:
    1. Responda de forma profissional, direta e útil para a família Primo Couto.
    2. Use formatação Markdown para listas ou ênfase.
    3. Se perguntado sobre riscos ou ações, baseie-se nos alertas atuais.
    4. Mantenha as respostas concisas.`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!ai) throw new Error("AI client not initialized");

      // Usando gemini-3-pro-preview para chat complexo
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: getSystemContext(),
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: input });
      const modelMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: result.text || "Sem resposta." };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Desculpe, ocorreu um erro ao processar sua solicitação." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFastAnalysis = async () => {
    setIsLoading(true);
    try {
      if (!ai) throw new Error("AI client not initialized");

      // Usando gemini-2.5-flash-lite para respostas rápidas
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: `Analise os dados fornecidos e gere um resumo executivo de 2 frases sobre a saúde financeira atual e qual ação imediata deve ser tomada.
        
        ${getSystemContext()}`,
      });

      const modelMsg: Message = { id: Date.now().toString(), role: 'model', text: `⚡ **Insight Rápido:**\n${response.text}` };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Analysis Error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Erro ao gerar análise rápida." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    // Toggle off if already speaking
    if (isSpeaking) {
      audioSourceRef.current?.stop();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (!ai) {
        console.warn("TTS: AI client not initialized");
        setIsSpeaking(false);
        return;
      }

      // Usando gemini-2.5-flash-preview-tts para síntese de fala
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text.replace(/[*#]/g, '') }] }], // Limpa markdown básico para leitura
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBuffer = await decodeAudioData(
          decode(base64Audio),
          ctx,
          24000,
          1
        );

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
        audioSourceRef.current = source;
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS Error", error);
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center
          ${isOpen ? 'bg-slate-700 rotate-90 text-white' : 'bg-pcfh-gold text-white hover:bg-amber-600 hover:scale-110'}
        `}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex flex-col transition-all duration-300 origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
        `}
        style={{ height: '500px' }}
      >
        {/* Header */}
        <div className="bg-pcfh-900 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-pcfh-gold" size={20} />
            <h3 className="text-white font-semibold">Nexus AI Assistant</h3>
          </div>
          <button
            onClick={handleFastAnalysis}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-xs text-blue-200 px-2 py-1 rounded transition"
            title="Usar Flash-Lite para análise rápida"
          >
            <Zap size={12} /> Insight Rápido
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm relative group
                  ${msg.role === 'user'
                    ? 'bg-pcfh-900 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.role === 'model' && (
                  <button
                    onClick={() => handleSpeak(msg.text)}
                    className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-pcfh-gold transition"
                    title="Ler em voz alta"
                  >
                    {isSpeaking ? <StopCircle size={16} className="text-red-500" /> : <Volume2 size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-pcfh-gold" />
                <span className="text-xs text-slate-400">Pensando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre seus ativos..."
            className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pcfh-gold focus:bg-white transition"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-pcfh-gold text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};
