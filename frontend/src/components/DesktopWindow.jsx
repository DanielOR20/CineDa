import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { 
  Terminal, 
  LogOut, 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Trash2,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/api';

export default function DesktopWindow({ children }) {
  const { logout, usuario } = useAuth();
  const [time, setTime] = useState('');
  const [windowMode, setWindowMode] = useState('normal'); // 'normal' | 'maximized' | 'compact'

  // Estados del Widget Copilot
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: '¡Hola! Soy CineDa Copilot. Puedo resolver dudas sobre carteleras, cupones de descuento, salas y operaciones de la cadena. ¿Qué te gustaría consultar?',
      timestamp: 'Ahora'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-CR', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll del chat
  useEffect(() => {
    if (isCopilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCopilotOpen, copilotLoading]);

  const handleGreenClick = () => {
    setWindowMode(prev => (prev === 'maximized' ? 'normal' : 'maximized'));
  };

  const handleYellowClick = () => {
    setWindowMode(prev => (prev === 'compact' ? 'normal' : 'compact'));
  };

  const handleRedClick = () => {
    setWindowMode('normal');
  };

  // Enviar pregunta a Copilot
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || copilotLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setCopilotLoading(true);

    try {
      const res = await aiService.preguntarCopilot(query);
      const answer = res?.respuesta || res?.data?.respuesta || res?.data || (typeof res === 'string' ? res : 'Sin respuesta.');
      
      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error al consultar Copilot:', err);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: `⚠️ No pude consultar la respuesta: ${err.message || 'Error de conexión con el copiloto.'}`,
        timestamp: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        text: 'Historial reiniciado. ¿En qué más puedo ayudarte hoy?',
        timestamp: 'Ahora'
      }
    ]);
  };

  const suggestedPrompts = [
    '¿Qué películas están en cartelera?',
    '¿Qué cupones de descuento están vigentes?',
    '¿Cuál es la política de clasificación de películas?'
  ];

  const containerClasses = {
    normal: 'max-w-[1550px] w-full h-[94vh] rounded-2xl shadow-2xl border border-gray-300',
    maximized: 'w-full h-screen rounded-none border-none shadow-none',
    compact: 'max-w-5xl w-full h-[80vh] rounded-2xl shadow-2xl border border-gray-300'
  }[windowMode];

  return (
    <div className="min-h-screen bg-[#e5e5ea] flex items-center justify-center p-0 md:p-3 overflow-hidden font-sans relative">
      <div className={`flex flex-col bg-white overflow-hidden transition-all duration-300 ease-out ${containerClasses}`}>
        {/* Topbar estilo macOS */}
        <header className="h-11 bg-[#fbfbfd] border-b border-gray-200 px-4 flex items-center justify-between select-none shrink-0">
          {/* Botones Semáforo */}
          <div className="flex items-center gap-2 w-48">
            <button 
              onClick={handleRedClick}
              title="Restablecer vista"
              className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-90 active:scale-90 transition-all cursor-pointer"
            />
            <button 
              onClick={handleYellowClick}
              title="Modo compacto"
              className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-90 active:scale-90 transition-all cursor-pointer"
            />
            <button 
              onClick={handleGreenClick}
              title="Pantalla completa"
              className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-90 active:scale-90 transition-all cursor-pointer"
            />
          </div>

          {/* Título de la app */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium tracking-wide">
            <Terminal size={13} className="text-gray-400" />
            <span>CineDa Enterprise Workstation · v1.0</span>
          </div>

          {/* Widgets a la derecha y Cerrar Sesión */}
          <div className="flex items-center justify-end gap-2.5 w-64">
            <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
              {time || '00:00:00'}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </div>
            <button
              onClick={logout}
              title={`Cerrar Sesión (${usuario?.nombre || 'Usuario'})`}
              className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors cursor-pointer flex items-center gap-1"
            >
              <LogOut size={13} />
            </button>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[#f5f5f7] p-5">
            {children}
          </main>
        </div>
      </div>

      {/* Botón Flotante Sutil para abrir Copilot (Esquina inferior derecha) */}
      <button
        type="button"
        onClick={() => setIsCopilotOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-40 bg-white/90 hover:bg-white text-emerald-600 border border-gray-200 shadow-lg hover:shadow-xl backdrop-blur-md px-3.5 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer active:scale-95 group"
        title="Abrir CineDa Copilot con IA"
      >
        <div className="relative flex items-center justify-center">
          <Sparkles size={16} className="text-emerald-600 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <span className="text-xs font-semibold text-gray-700">Copilot</span>
      </button>

      {/* Widget / Panel Flotante de Chat estilo macOS Light */}
      {isCopilotOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[380px] sm:w-[420px] h-[540px] max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden font-sans animate-in slide-in-from-bottom-5 duration-200">
          {/* Header del Copilot estilo macOS */}
          <div className="h-12 px-4 bg-[#fbfbfd] border-b border-gray-200 flex items-center justify-between select-none shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-gray-900">CineDa Copilot</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">DeepSeek V3</span>
                </div>
                <p className="text-[10px] text-gray-500">Asistente operativo inteligente</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Limpiar conversación"
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
              <button
                type="button"
                onClick={() => setIsCopilotOpen(false)}
                title="Cerrar Copilot"
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Historial de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fbfbfd]/50">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      isAssistant 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-900 text-white'
                    }`}
                  >
                    {isAssistant ? <Bot size={13} /> : <User size={13} />}
                  </div>

                  <div className={`max-w-[80%] ${isAssistant ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-xs'
                          : 'bg-emerald-600 text-white rounded-tr-sm shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 px-1 mt-0.5 inline-block">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {copilotLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Bot size={13} />
                </div>
                <div className="bg-white border border-gray-200 px-3.5 py-2 rounded-2xl rounded-tl-sm shadow-xs flex items-center gap-2 text-xs text-gray-500">
                  <Loader2 size={12} className="animate-spin text-emerald-600" />
                  <span>Consultando con DeepSeek...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias Rápidas */}
          {messages.length <= 2 && (
            <div className="px-3 py-1.5 bg-gray-50/70 border-t border-gray-100 flex flex-wrap gap-1.5 shrink-0">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[11px] text-gray-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-full px-2.5 py-0.5 transition-colors cursor-pointer text-left truncate max-w-full"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input de Pregunta */}
          <div className="p-3 bg-white border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-2 bg-[#f5f5f7] border border-gray-200 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Haz una pregunta sobre CineDa..."
                disabled={copilotLoading}
                className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || copilotLoading}
                title="Enviar pregunta"
                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer shrink-0"
              >
                <Send size={12} />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-1.5">
              Presiona <kbd className="font-mono bg-gray-100 px-1 rounded border border-gray-200">Enter</kbd> para enviar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
