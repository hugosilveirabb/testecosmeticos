'use client';
import dynamic from 'next/dynamic';

const MarketingCalendar = dynamic(() => import('../components/calendar/MarketingCalendar'), { ssr: false });
const ActionForm = dynamic(() => import('../components/forms/ActionForm'), { ssr: false });
const MarketingTimeline = dynamic(() => import('../components/timeline/MarketingTimeline'), { ssr: false });
const PdfExporter = dynamic(() => import('../components/export/PdfExporter'), { ssr: false });
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function Home() {
  // Estado para armazenar as ações de marketing
  const [actions, setActions] = useState<MarketingAction[]>([]);
  
  // Estado para controlar a exibição do formulário
  const [showForm, setShowForm] = useState(false);
  
  // Estado para armazenar a ação selecionada para edição
  const [selectedAction, setSelectedAction] = useState<MarketingAction | null>(null);
  
  // Estado para controlar a visualização atual (calendário ou linha do tempo)
  const [currentView, setCurrentView] = useState<'calendar' | 'timeline'>('calendar');
  
  // Lista de responsáveis (baseada na pesquisa realizada)
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
  
  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const savedActions = localStorage.getItem('marketingActions');
    if (savedActions) {
      try {
        const parsedActions = JSON.parse(savedActions);
        // Converter strings de data para objetos Date
        const formattedActions = parsedActions.map((action: any) => ({
          ...action,
          start: new Date(action.start),
          end: new Date(action.end),
          tasks: action.tasks.map((task: any) => ({
            ...task,
            deadline: new Date(task.deadline),
            subtasks: task.subtasks.map((subtask: any) => ({
              ...subtask,
              deadline: new Date(subtask.deadline)
            }))
          }))
        }));
        setActions(formattedActions);
      } catch (error) {
        console.error('Erro ao carregar ações do localStorage:', error);
      }
    }
  }, []);
  
  // Salvar dados no localStorage quando actions mudar
  useEffect(() => {
    localStorage.setItem('marketingActions', JSON.stringify(actions));
  }, [actions]);
  
  // Função para adicionar ou atualizar uma ação
  const handleSaveAction = (action: MarketingAction) => {
    if (selectedAction) {
      // Atualizar ação existente
      setActions(prevActions => 
        prevActions.map(a => a.id === action.id ? action : a)
      );
    } else {
      // Adicionar nova ação
      setActions(prevActions => [...prevActions, action]);
    }
    
    setShowForm(false);
    setSelectedAction(null);
  };
  
  // Função para abrir o formulário para edição
  const handleEditAction = (action: MarketingAction) => {
    setSelectedAction(action);
    setShowForm(true);
  };
  
  // Função para abrir o formulário para nova ação
  const handleAddAction = (date: Date) => {
    setSelectedAction(null);
    setShowForm(true);
  };
  
  // Função para excluir uma ação
  const handleDeleteAction = (actionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta ação de marketing?')) {
      setActions(prevActions => prevActions.filter(a => a.id !== actionId));
    }
  };
  
  // Função para duplicar uma ação
  const handleDuplicateAction = (action: MarketingAction) => {
    const newAction = {
      ...action,
      id: crypto.randomUUID(),
      title: `${action.title} (Cópia)`,
    };
    setActions(prevActions => [...prevActions, newAction]);
  };
  
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
                onClick={() => handleAddAction(new Date())}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
                Nova Ação
              </button>
              
              <PdfExporter actions={actions} />
            </div>
          </div>
        </header>
        
        {showForm ? (
          <ActionForm
            initialAction={selectedAction || undefined}
            onSave={handleSaveAction}
            onCancel={() => {
              setShowForm(false);
              setSelectedAction(null);
            }}
            responsibleOptions={responsibleOptions}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-4">
            {currentView === 'calendar' ? (
              <MarketingCalendar
                actions={actions}
                onSelectAction={handleEditAction}
                onAddAction={handleAddAction}
              />
            ) : (
              <MarketingTimeline
                actions={actions}
                onSelectAction={handleEditAction}
              />
            )}
          </div>
        )}
        
        {!showForm && actions.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Gerenciar Ações</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsável
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verba
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {actions.map((action) => (
                    <tr key={action.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{action.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {format(new Date(action.start), 'dd/MM/yyyy')} - {format(new Date(action.end), 'dd/MM/yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{action.responsible}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {action.budget.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          action.status === 'planejado' ? 'bg-blue-100 text-blue-800' :
                          action.status === 'em andamento' ? 'bg-yellow-100 text-yellow-800' :
                          action.status === 'concluído' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {action.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAction(action)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDuplicateAction(action)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Duplicar
                          </button>
                          <button
                            onClick={() => handleDeleteAction(action.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
