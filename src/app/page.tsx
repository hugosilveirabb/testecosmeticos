'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importações dinâmicas com SSR desativado
const MarketingCalendar = dynamic(() => import('../components/calendar/MarketingCalendar'), { 
  ssr: false,
  loading: () => <p>Carregando calendário...</p>
});

const ActionForm = dynamic(() => import('../components/forms/ActionForm'), { 
  ssr: false,
  loading: () => <p>Carregando formulário...</p>
});

const MarketingTimeline = dynamic(() => import('../components/timeline/MarketingTimeline'), { 
  ssr: false,
  loading: () => <p>Carregando linha do tempo...</p>
});

const PdfExporter = dynamic(() => import('../components/export/PdfExporter'), { 
  ssr: false,
  loading: () => <p>Carregando exportador...</p>
});

export default function Home() {
  // Estado para verificar se estamos no navegador
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Estado para armazenar as ações de marketing
  const [actions, setActions] = useState([]);
  
  // Estado para controlar a exibição do formulário
  const [showForm, setShowForm] = useState(false);
  
  // Estado para armazenar a ação selecionada para edição
  const [selectedAction, setSelectedAction] = useState(null);
  
  // Estado para controlar a visualização atual
  const [currentView, setCurrentView] = useState('calendar');
  
  // Lista de responsáveis
  const responsibleOptions = [
    'Gerente de E-commerce',
    'Gerente de Marketing Digital',
    'Analista de Mídia',
    'Social Media',
    'Analista de E-commerce',
    'Produtor de Conteúdo',
    'Analista de SEO',
    'Analista de Redes Sociais',
    'Analista de Conteúdo',
    'Atendente de Vendas/SAC',
    'Assistente de Logística',
    'Web Designer',
    'Desenvolvedor',
    'Analista de BI'
  ];
  
  // Verificar se estamos no navegador
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Se não estamos no navegador, retornar mensagem de carregamento
  if (!isBrowser) {
    return <div className="p-8 text-center">Carregando planejador de marketing...</div>;
  }
  
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            Planejamento Anual de Marketing - E-commerce de Cosméticos
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Defina ações com frequência semanal, quinzenal ou mensal, considerando verba, objetivo, sazonalidade e mais.
          </p>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('calendar')}
                className={`px-4 py-2 rounded-md ${
                  currentView === 'calendar' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Calendário
              </button>
              <button
                onClick={() => setCurrentView('timeline')}
                className={`px-4 py-2 rounded-md ${
                  currentView === 'timeline' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Linha do Tempo
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedAction(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Nova Ação
              </button>
            </div>
          </div>
        </header>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          <p>Planejador de Marketing carregado com sucesso!</p>
          <p>Clique em "Nova Ação" para começar a criar seu plano de marketing.</p>
        </div>
      </div>
    </main>
  );
}
