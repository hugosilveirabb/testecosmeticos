'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  // Estado para armazenar as ações de marketing
  const [actions, setActions] = useState([]);
  
  // Estado para controlar a exibição do formulário
  const [showForm, setShowForm] = useState(false);
  
  // Estado para armazenar a ação selecionada para edição
  const [selectedAction, setSelectedAction] = useState(null);
  
  // Estado para controlar a visualização atual (calendário ou lista)
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
  
  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedActions = localStorage.getItem('marketingActions');
      if (savedActions) {
        try {
          const parsedActions = JSON.parse(savedActions);
          // Converter strings de data para objetos Date
          const formattedActions = parsedActions.map((action) => ({
            ...action,
            start: new Date(action.start),
            end: new Date(action.end),
            tasks: action.tasks ? action.tasks.map((task) => ({
              ...task,
              deadline: new Date(task.deadline),
              subtasks: task.subtasks ? task.subtasks.map((subtask) => ({
                ...subtask,
                deadline: new Date(subtask.deadline)
              })) : []
            })) : []
          }));
          setActions(formattedActions);
        } catch (error) {
          console.error('Erro ao carregar ações do localStorage:', error);
        }
      }
    }
  }, []);
  
  // Salvar dados no localStorage quando actions mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('marketingActions', JSON.stringify(actions));
    }
  }, [actions]);
  
  // Função para adicionar ou atualizar uma ação
  const handleSaveAction = (action) => {
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
  const handleEditAction = (action) => {
    setSelectedAction(action);
    setShowForm(true);
  };
  
  // Função para excluir uma ação
  const handleDeleteAction = (actionId) => {
    if (confirm('Tem certeza que deseja excluir esta ação de marketing?')) {
      setActions(prevActions => prevActions.filter(a => a.id !== actionId));
    }
  };
  
  // Função para formatar data
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };
  
  // Função para gerar ID único
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  // Componente de formulário simplificado
  const SimpleForm = () => {
    const [action, setAction] = useState(() => {
      if (selectedAction) {
        return { ...selectedAction };
      }
      
      // Valores padrão para uma nova ação
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 7);
      
      return {
        id: generateId(),
        title: '',
        start: today,
        end: endDate,
        frequency: 'semanal',
        budget: 0,
        objective: '',
        seasonality: '',
        targetCustomer: '',
        products: [],
        revenueGoal: 0,
        roas: 0,
        responsible: '',
        status: 'planejado',
        tasks: [],
      };
    });
    
    const [newProduct, setNewProduct] = useState('');
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      
      if (name === 'budget' || name === 'revenueGoal' || name === 'roas') {
        setAction({
          ...action,
          [name]: parseFloat(value) || 0,
        });
      } else {
        setAction({
          ...action,
          [name]: value,
        });
      }
    };
    
    const handleDateChange = (e, field) => {
      const date = new Date(e.target.value);
      setAction({
        ...action,
        [field]: date,
      });
    };
    
    const handleAddProduct = () => {
      if (newProduct.trim()) {
        setAction({
          ...action,
          products: [...action.products, newProduct.trim()],
        });
        setNewProduct('');
      }
    };
    
    const handleRemoveProduct = (index) => {
      const updatedProducts = [...action.products];
      updatedProducts.splice(index, 1);
      setAction({
        ...action,
        products: updatedProducts,
      });
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveAction(action);
    };
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {selectedAction ? 'Editar Ação de Marketing' : 'Nova Ação de Marketing'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título da Ação
              </label>
              <input
                type="text"
                name="title"
                value={action.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequência
              </label>
              <select
                name="frequency"
                value={action.frequency}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="semanal">Semanal</option>
                <option value="quinzenal">Quinzenal</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                value={action.start instanceof Date ? action.start.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange(e, 'start')}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Término
              </label>
              <input
                type="date"
                value={action.end instanceof Date ? action.end.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange(e, 'end')}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verba (R$)
              </label>
              <input
                type="number"
                name="budget"
                value={action.budget}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável
              </label>
              <select
                name="responsible"
                value={action.responsible}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecione um responsável</option>
                {responsibleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta de Receita (R$)
              </label>
              <input
                type="number"
                name="revenueGoal"
                value={action.revenueGoal}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ROAS Esperado
              </label>
              <input
                type="number"
                name="roas"
                value={action.roas}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={action.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="planejado">Planejado</option>
                <option value="em andamento">Em Andamento</option>
                <option value="concluído">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          
          {/* Objetivo e Sazonalidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivo da Campanha
              </label>
              <textarea
                name="objective"
                value={action.objective}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sazonalidade
              </label>
              <textarea
                name="seasonality"
                value={action.seasonality}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          {/* Cliente Ideal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente Ideal
            </label>
            <textarea
              name="targetCustomer"
              value={action.targetCustomer}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          {/* Produtos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produtos Ofertados
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder="Nome do produto"
              />
              <button
                type="button"
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Adicionar
              </button>
            </div>
            
            <div className="mt-2 space-y-2">
              {action.products.map((product, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                  <span>{product}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              ))}
              {action.products.length === 0 && (
                <p className="text-gray-500 italic">Nenhum produto adicionado</p>
              )}
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedAction(null);
              }}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  // Componente de visualização de calendário simplificado
  const SimpleCalendar = () => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filtrar ações para o mês atual
    const currentMonthActions = actions.filter(action => {
      const actionStart = new Date(action.start);
      const actionEnd = new Date(action.end);
      
      return (
        (actionStart.getMonth() === currentMonth && actionStart.getFullYear() === currentYear) ||
        (actionEnd.getMonth() === currentMonth && actionEnd.getFullYear() === currentYear) ||
        (actionStart < new Date(currentYear, currentMonth, 1) && 
         actionEnd > new Date(currentYear, currentMonth + 1, 0))
      );
    });
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {months[currentMonth]} {currentYear}
        </h2>
        
        {currentMonthActions.length > 0 ? (
          <div className="space-y-4">
            {currentMonthActions.map(action => (
              <div 
                key={action.id} 
                className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleEditAction(action)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{action.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    action.status === 'planejado' ? 'bg-blue-100 text-blue-800' :
                    action.status === 'em andamento' ? 'bg-yellow-100 text-yellow-800' :
                    action.status === 'concluído' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {action.status}
                  </span>
                </div>
                
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Período:</span> {formatDate(action.start)} - {formatDate(action.end)}</div>
                  <div><span className="font-medium">Responsável:</span> {action.responsible}</div>
                  <div><span className="font-medium">Verba:</span> R$ {action.budget.toLocaleString('pt-BR')}</div>
                  <div><span className="font-medium">Meta:</span> R$ {action.revenueGoal.toLocaleString('pt-BR')}</div>
                </div>
                
                <div className="mt-2 text-sm">
                  <span className="font-medium">Objetivo:</span> {action.objective.substring(0, 100)}{action.objective.length > 100 ? '...' : ''}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhuma ação de marketing programada para este mês.
            Clique em "Nova Ação" para adicionar.
          </p>
        )}
      </div>
    );
  };
  
  // Componente de visualização em lista
  const ActionsList = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Lista de Ações de Marketing
        </h2>
        
        {actions.length > 0 ? (
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
                        {formatDate(action.start)} - {formatDate(action.end)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{action.responsible}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        R$ {action.budget.toLocaleString('pt-BR')}
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
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhuma ação de marketing cadastrada.
            Clique em "Nova Ação" para adicionar.
          </p>
        )}
      </div>
    );
  };
  
  // Componente para exportar PDF (simplificado)
  const SimplePdfExporter = () => {
    const handleExportPdf = () => {
      alert('Funcionalidade de exportação em PDF será implementada em uma versão futura.');
    };
    
    return (
      <button
        onClick={handleExportPdf}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
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
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        Exportar PDF
      </button>
    );
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
                onClick={() => setCurrentView('list')}
                className={`px-4 py-2 rounded-md ${
                  currentView === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Lista
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedAction(null);
                  setShowForm(true);
                }}
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
              
              <SimplePdfExporter />
            </div>
          </div>
        </header>
        
        {showForm ? (
          <SimpleForm />
        ) : (
          <>
            {currentView === 'calendar' ? (
              <SimpleCalendar />
            ) : (
              <ActionsList />
            )}
          </>
        )}
      </div>
    </main>
  );
}
