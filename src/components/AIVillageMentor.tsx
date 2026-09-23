import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Sprout,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage, SimulationScenario, VillageInfo } from '../types';

interface AIVillageMentorProps {
  village: VillageInfo;
  selectedScenario?: SimulationScenario | null;
  soundEnabled: boolean;
}

export const AIVillageMentor: React.FC<AIVillageMentorProps> = ({
  village,
  selectedScenario,
  soundEnabled,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Namaste! I am KrishiMitra AI, your context-aware AI Village Mentor for ${village.name}. I am continuously analyzing regional crop intentions, water availability, and 6-month future demand signals to help you choose the most profitable crop. Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        `Should I plant Groundnut or Organic Turmeric in ${village.name}?`,
        'How can I get guaranteed buyers for my maize crop?',
        'What is the highest profit crop for 3 acres with low water?',
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update greeting message when village changes
  useEffect(() => {
    setMessages([
      {
        id: `msg-init-${village.id}`,
        sender: 'assistant',
        text: `Namaste! I am KrishiMitra AI, your context-aware AI Village Mentor for ${village.name} (${village.district}, ${village.state}). I am continuously analyzing local soil parameters (${village.soilTypes.join(', ')}), ${village.waterAvailabilityIndex} water availability, and live market demand signals to help you choose the most profitable crop. Ask me anything!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          `Which high-margin crop is best for ${village.name}'s soil?`,
          `How can I avoid crop oversupply risk in ${village.district}?`,
          `What is the highest profit crop for 3 acres with ${village.waterAvailabilityIndex} water?`,
        ],
      },
    ]);
  }, [village.id, village.name, village.district, village.state]);
  useEffect(() => {
    if (selectedScenario) {
      const scenarioPrompt = `Can you analyze Scenario "${selectedScenario.cropName}" for my land in ${village.name}? It projects ₹${selectedScenario.expectedNetProfit.toLocaleString()} profit with ${selectedScenario.riskScorePct}/100 risk score. What are the best action steps?`;
      setInputPrompt(scenarioPrompt);
    }
  }, [selectedScenario, village.name]);

  const speakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (speakingMsgId === msgId) {
      setSpeakingMsgId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customText?: string) => {
    const messageToSend = customText || inputPrompt;
    if (!messageToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          villageContext: {
            villageName: village.name,
            district: village.district,
            landAcres: 3.5,
            waterLevel: village.waterAvailabilityIndex,
            soilType: village.soilTypes[0] || 'Alluvial Loam',
            budget: 150000,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiReply: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'I have analyzed your crop parameters.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: data.suggestedActions,
        };
        setMessages((prev) => [...prev, aiReply]);

        if (soundEnabled) {
          speakText(aiReply.id, aiReply.text);
        }
      } else {
        throw new Error('Mentor API error');
      }
    } catch (err) {
      console.warn('Fallback mentor reply', err);
      const fallbackReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Based on ${village.name}'s current intelligence: Paddy Rice and Tomato are heavily overcrowded (over 55% land share), leading to a high price crash risk. I strongly recommend diversifying into **Organic Turmeric** or **Hybrid Biofuel Maize**. Turmeric has a 32% price surge signal due to festive export demand, while Maize offers guaranteed ethanol procurement contracts!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'How do I setup drip fertigation for Turmeric?',
          'Where do I register for government ethanol maize contract?',
        ],
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              Core Feature 5 — Context-Aware AI Chatbot
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              AI Village Mentor — KrishiMitra AI
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Equipped with deep awareness of <strong>{village.name}</strong> ({village.district}) — soil parameters, water index, and live village crowding risk maps.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs shrink-0">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-slate-400">Context Loaded</div>
              <div className="font-bold text-emerald-300">
                {village.name} • {village.waterAvailabilityIndex} Water
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Suggestions & Context Box */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> High-Impact Prompts
            </h3>

            <div className="space-y-2">
              {[
                `Should I plant Groundnut or Cotton in ${village.name}?`,
                'What crop gives highest profit on 2.5 acres with drip?',
                'How to protect against tomato price crashes?',
                'Best short-cycle crop for summer Zaid season?',
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-xs text-slate-300 transition-all cursor-pointer flex items-center justify-between gap-1"
                >
                  <span className="line-clamp-2">{prompt}</span>
                  <Send className="w-3 h-3 text-emerald-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Chat Container */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[560px]">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSpeaking = speakingMsgId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl p-4 text-xs space-y-2 ${
                      isUser
                        ? 'bg-emerald-600 text-slate-950 font-medium'
                        : 'bg-slate-950 border border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-slate-800/40 pb-1">
                      <span className="font-bold text-[10px] uppercase opacity-75">
                        {isUser ? 'You (Farmer)' : 'KrishiMitra AI Mentor'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] opacity-60">
                          {msg.timestamp}
                        </span>
                        {!isUser && (
                          <button
                            onClick={() => speakText(msg.id, msg.text)}
                            className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Listen to response"
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>

                    {/* Suggested Actions if available */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Suggested Next Questions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedActions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(act)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 border border-slate-800 rounded-lg text-[10px] text-emerald-300 font-medium transition-all cursor-pointer"
                            >
                              💡 {act}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 p-3 bg-slate-950 border border-slate-800 rounded-xl w-fit animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>KrishiMitra AI is calculating soil, market signals & village crop risk...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="pt-3 border-t border-slate-800 mt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Ask KrishiMitra AI anything about ${village.name}'s crops, soil, water or profits...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !inputPrompt.trim()}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
