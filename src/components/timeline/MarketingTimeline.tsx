'use client';

import React, { useState, useEffect } from 'react';
import { MarketingAction } from '../calendar/MarketingCalendar';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MarketingTimelineProps {
  actions: MarketingAction[];
  onSelectAction: (action: MarketingAction) => void;
  startDate?: Date;
  endDate?: Date;
}

const MarketingTimeline: React.FC<MarketingTimelineProps> = ({
  actions,
  onSelectAction,
  startDate = new Date(),
  endDate = addMonths(new Date(), 12),
}) => {
  const [months, setMonths] = useState<Date[]>([]);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  // Inicializa os meses para a linha do tempo
  useEffect(() => {
    const monthsArray = eachMonthOfInterval({
      start: startOfMonth(startDate),
      end: endOfMonth(endDate),
    });
    setMonths(monthsArray);
  }, [startDate, endDate]);

  // Calcula totais
  useEffect(() => {
    let budget = 0;
    let revenue = 0;
    
    actions.forEach(action => {
      budget += action.budget;
      revenue += action.revenueGoal;
    });
    
    setTotalBudget(budget);
    setTotalRevenue(revenue);
  }, [actions]);

  // Filtra ações por mês
  const getActionsByMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    return actions.filter(action => {
      const actionStart = new Date(action.start);
      const actionEnd = new Date(action.end);
      
      return (
        (actionStart >= monthStart && actionStart <= monthEnd) ||
        (actionEnd >= monthStart && actionEnd <= monthEnd) ||
        (actionStart <= monthStart && actionEnd >= monthEnd)
      );
    });
  };

  // Calcula orçamento total por mês
  const getBudgetByMonth = (month: Date) => {
    const monthActions = getActionsByMonth(month);
    return monthActions.reduce((total, action) => total + action.budget, 0);
  };

  // Obtém cor baseada no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planejado':
        return 'bg-blue-500';
      case 'em andamento':
        return 'bg-yellow-500';
      case 'concluído':
        return 'bg-green-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Formata valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Linha do Tempo de Marketing</h2>
      
      {/* Resumo geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total de Ações</h3>
          <p className="text-3xl font-bold">{actions.length}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Verba Total</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalBudget)}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Receita Esperada</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>
      
      {/* Linha do tempo por mês */}
      <div className="space-y-4">
        {months.map((month, index) => {
          const monthActions = getActionsByMonth(month);
          const monthBudget = getBudgetByMonth(month);
          const isExpanded = expandedMonth === index;
          
          return (
            <div key={month.toString()} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Cabeçalho do mês */}
              <div 
                className="flex items-center justify-between bg-gray-100 p-4 cursor-pointer"
                onClick={() => setExpandedMonth(isExpanded ? null : index)}
              >
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-semibold">
                    {format(month, 'MMMM yyyy', { locale: ptBR })}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {monthActions.length} ações
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">{formatCurrency(monthBudget)}</span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Conteúdo expandido do mês */}
              {isExpanded && (
                <div className="p-4">
                  {monthActions.length > 0 ? (
                    <div className="space-y-3">
                      {monthActions.map(action => (
                        <div 
                          key={action.id} 
                          className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => onSelectAction(action)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(action.status)}`}></div>
                              <h4 className="font-medium">{action.title}</h4>
                            </div>
                            <span className="font-semibold">{formatCurrency(action.budget)}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Período:</span> {format(new Date(action.start), 'dd/MM/yyyy')} - {format(new Date(action.end), 'dd/MM/yyyy')}
                            </div>
                            <div>
                              <span className="font-medium">Responsável:</span> {action.responsible}
                            </div>
                            <div>
                              <span className="font-medium">Frequência:</span> {action.frequency}
                            </div>
                          </div>
                          
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Objetivo:</span> {action.objective.substring(0, 100)}{action.objective.length > 100 ? '...' : ''}
                          </div>
                          
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progresso das tarefas</span>
                              <span>
                                {action.tasks.filter(task => task.status === 'concluído').length} / {action.tasks.length}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ 
                                  width: `${action.tasks.length > 0 
                                    ? (action.tasks.filter(task => task.status === 'concluído').length / action.tasks.length) * 100 
                                    : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center py-4">
                      Nenhuma ação de marketing programada para este mês
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketingTimeline;
