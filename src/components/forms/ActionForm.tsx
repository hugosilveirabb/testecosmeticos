'use client';

import React, { useState, useEffect } from 'react';
import { MarketingAction } from '../calendar/MarketingCalendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActionFormProps {
  initialAction?: MarketingAction;
  onSave: (action: MarketingAction) => void;
  onCancel: () => void;
  responsibleOptions: string[];
}

const ActionForm: React.FC<ActionFormProps> = ({
  initialAction,
  onSave,
  onCancel,
  responsibleOptions,
}) => {
  const [action, setAction] = useState<MarketingAction>(() => {
    if (initialAction) {
      return { ...initialAction };
    }
    
    // Valores padrão para uma nova ação
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 7);
    
    return {
      id: crypto.randomUUID(),
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
  const [newTask, setNewTask] = useState({
    title: '',
    responsible: '',
    deadline: new Date(),
  });
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [newSubtask, setNewSubtask] = useState({
    title: '',
    responsible: '',
    deadline: new Date(),
  });

  // Função para atualizar campos simples
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  // Função para atualizar datas
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    const date = new Date(e.target.value);
    setAction({
      ...action,
      [field]: date,
    });
  };

  // Função para adicionar produto
  const handleAddProduct = () => {
    if (newProduct.trim()) {
      setAction({
        ...action,
        products: [...action.products, newProduct.trim()],
      });
      setNewProduct('');
    }
  };

  // Função para remover produto
  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...action.products];
    updatedProducts.splice(index, 1);
    setAction({
      ...action,
      products: updatedProducts,
    });
  };

  // Função para adicionar tarefa
  const handleAddTask = () => {
    if (newTask.title.trim() && newTask.responsible) {
      const task = {
        id: crypto.randomUUID(),
        title: newTask.title.trim(),
        responsible: newTask.responsible,
        deadline: newTask.deadline,
        status: 'pendente' as const,
        subtasks: [],
      };
      
      setAction({
        ...action,
        tasks: [...action.tasks, task],
      });
      
      setNewTask({
        title: '',
        responsible: '',
        deadline: new Date(),
      });
    }
  };

  // Função para remover tarefa
  const handleRemoveTask = (index: number) => {
    const updatedTasks = [...action.tasks];
    updatedTasks.splice(index, 1);
    setAction({
      ...action,
      tasks: updatedTasks,
    });
    
    if (selectedTaskIndex === index) {
      setSelectedTaskIndex(null);
    }
  };

  // Função para adicionar subtarefa
  const handleAddSubtask = () => {
    if (selectedTaskIndex !== null && newSubtask.title.trim() && newSubtask.responsible) {
      const updatedTasks = [...action.tasks];
      const subtask = {
        id: crypto.randomUUID(),
        title: newSubtask.title.trim(),
        responsible: newSubtask.responsible,
        deadline: newSubtask.deadline,
        status: 'pendente' as const,
      };
      
      updatedTasks[selectedTaskIndex].subtasks.push(subtask);
      
      setAction({
        ...action,
        tasks: updatedTasks,
      });
      
      setNewSubtask({
        title: '',
        responsible: '',
        deadline: new Date(),
      });
    }
  };

  // Função para remover subtarefa
  const handleRemoveSubtask = (taskIndex: number, subtaskIndex: number) => {
    const updatedTasks = [...action.tasks];
    updatedTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
    
    setAction({
      ...action,
      tasks: updatedTasks,
    });
  };

  // Função para salvar a ação
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(action);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {initialAction ? 'Editar Ação de Marketing' : 'Nova Ação de Marketing'}
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
              value={format(action.start, 'yyyy-MM-dd')}
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
              value={format(action.end, 'yyyy-MM-dd')}
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
        
        {/* Tarefas */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Tarefas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Título da tarefa"
              />
            </div>
            
            <div>
              <select
                value={newTask.responsible}
                onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um responsável</option>
                {responsibleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="date"
                value={format(newTask.deadline, 'yyyy-MM-dd')}
                onChange={(e) => setNewTask({ ...newTask, deadline: new Date(e.target.value) })}
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Adicionar
              </button>
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            {action.tasks.map((task, taskIndex) => (
              <div key={task.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{task.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTaskIndex(selectedTaskIndex === taskIndex ? null : taskIndex)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      {selectedTaskIndex === taskIndex ? 'Fechar' : 'Subtarefas'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(taskIndex)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remover
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Responsável:</span> {task.responsible}
                  </div>
                  <div>
                    <span className="font-medium">Prazo:</span> {format(new Date(task.deadline), 'dd/MM/yyyy')}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {task.status}
                  </div>
                </div>
                
                {selectedTaskIndex === taskIndex && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Subtarefas</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                      <div>
                        <input
                          type="text"
                          value={newSubtask.title}
                          onChange={(e) => setNewSubtask({ ...newSubtask, title: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Título da subtarefa"
                        />
                      </div>
                      
                      <div>
                        <select
                          value={newSubtask.responsible}
                          onChange={(e) => setNewSubtask({ ...newSubtask, responsible: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Selecione um responsável</option>
                          {responsibleOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          value={format(newSubtask.deadline, 'yyyy-MM-dd')}
                          onChange={(e) => setNewSubtask({ ...newSubtask, deadline: new Date(e.target.value) })}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                        />
                        <button
                          type="button"
                          onClick={handleAddSubtask}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 space-y-2">
                      {task.subtasks.map((subtask, subtaskIndex) => (
                        <div key={subtask.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                          <div className="flex-1">
                            <div className="font-medium">{subtask.title}</div>
                            <div className="text-sm text-gray-600">
                              {subtask.responsible} | {format(new Date(subtask.deadline), 'dd/MM/yyyy')} | {subtask.status}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtask(taskIndex, subtaskIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                      {task.subtasks.length === 0 && (
                        <p className="text-gray-500 italic">Nenhuma subtarefa adicionada</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {action.tasks.length === 0 && (
              <p className="text-gray-500 italic">Nenhuma tarefa adicionada</p>
            )}
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
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

export default ActionForm;
