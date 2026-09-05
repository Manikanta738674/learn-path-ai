import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Trash2,
  CheckCircle2,
  ArrowRight,
  User,
  Bot,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MENTOR_PERSONAS } from '../data/mockData';
import { MentorPersonaId } from '../types';

export const AiMentorshipView: React.FC = () => {
  const {
    selectedMentorId,
    setSelectedMentorId,
    mentorMessages,
    isMentorTyping,
    sendMessageToMentor,
    clearMentorChat,
    studentProfile,
    aiStatus,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePersona =
    MENTOR_PERSONAS.find((p) => p.id === selectedMentorId) || MENTOR_PERSONAS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mentorMessages, isMentorTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isMentorTyping) return;
    const text = inputMessage.trim();
    setInputMessage('');
    await sendMessageToMentor(text);
  };

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              FEATURE 4
            </span>
            <span className="text-xs text-slate-500 font-medium">
              24/7 Contextual Engineering Mentorship • {aiStatus.label}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            AI Mentorship & Career Guidance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Choose a specialist mentor persona for pragmatic feedback on technical challenges, interview strategies, resume bullet points, and academic curriculum pivots.
          </p>
        </div>

        <button
          id="clear-chat-history-btn"
          onClick={clearMentorChat}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 px-3 py-2 rounded-xl transition-colors self-start md:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Conversation</span>
        </button>
      </div>

      {/* Mentor Personas Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MENTOR_PERSONAS.map((persona) => {
          const isSelected = persona.id === selectedMentorId;
          return (
            <button
              key={persona.id}
              id={`select-mentor-${persona.id}`}
              onClick={() => setSelectedMentorId(persona.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/60 border-purple-300 ring-2 ring-purple-200/50 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h2 className="font-bold text-sm text-slate-900 leading-tight">
                    {persona.name}
                  </h2>
                  <span className="text-[10px] font-semibold text-purple-700 block">
                    {persona.badge}
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-700 line-clamp-1 mb-1">
                {persona.title}
              </div>
              <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                {persona.tagline}
              </p>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-400">Persona</span>
                <span
                  className={`font-bold ${
                    isSelected ? 'text-purple-700' : 'text-slate-500'
                  }`}
                >
                  {isSelected ? 'Active Mentor' : 'Select'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[640px]">
        {/* Active Mentor Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activePersona.avatar}
              alt={activePersona.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  {activePersona.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] text-slate-500">Active</span>
              </div>
              <p className="text-xs text-slate-500">
                {activePersona.title} • Assisting for {studentProfile.targetRole}
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/60 text-slate-700 hidden sm:inline">
            {aiStatus.provider === 'gemini' ? 'Gemini 2.5 Flash' : 'Intelligent Mentor Logic'}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {mentorMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {isUser ? studentProfile.name.charAt(0) : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none whitespace-pre-line'
                        : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-200/80'
                    }`}
                  >
                    {isUser ? (
                      msg.text
                    ) : (
                      <div className="space-y-2 [&_h3]:font-bold [&_h3]:text-sm sm:[&_h3]:text-base [&_h3]:text-slate-900 [&_h3]:mt-1 [&_h4]:font-semibold [&_h4]:text-slate-800 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_p]:text-slate-700 [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_table]:my-2 [&_th]:bg-slate-200/70 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold [&_td]:p-2 [&_td]:border-b [&_td]:border-slate-200 [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre]:text-xs [&_code]:font-mono [&_code]:text-indigo-600 [&_code]:bg-indigo-50/80 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre_code]:bg-transparent [&_pre_code]:text-slate-100 [&_pre_code]:p-0">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    )}
                  </div>

                  {/* Mentor Structured Advice Cards if available */}
                  {!isUser && (msg.keyTakeaway || msg.actionItem) && (
                    <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl space-y-2 text-xs">
                      {msg.keyTakeaway && (
                        <div className="flex items-start gap-2 text-purple-950">
                          <Lightbulb className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Key Takeaway: </strong>
                            {msg.keyTakeaway}
                          </span>
                        </div>
                      )}
                      {msg.actionItem && (
                        <div className="flex items-start gap-2 text-purple-950 pt-1 border-t border-purple-200/50">
                          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>
                            <strong>Next Action Step: </strong>
                            {msg.actionItem}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-slate-400 ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isMentorTyping && (
            <div className="flex gap-3 max-w-md">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse delay-300"></span>
                <span className="text-xs text-slate-500 ml-2">
                  {activePersona.name} is drafting guidance...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starter Prompts */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Suggested Prompts:
          </span>
          {activePersona.starterPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handlePromptClick(prompt)}
              className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-3"
        >
          <input
            id="mentor-message-input"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask ${activePersona.name} a question about ${studentProfile.targetRole}, LeetCode, or portfolio reviews...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-indigo-500 text-slate-800"
            disabled={isMentorTyping}
          />

          <button
            id="send-mentor-message-btn"
            type="submit"
            disabled={!inputMessage.trim() || isMentorTyping}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
