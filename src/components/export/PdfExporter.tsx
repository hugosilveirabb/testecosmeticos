'use client';

import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MarketingAction } from '../calendar/MarketingCalendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PdfExporterProps {
  actions: MarketingAction[];
  fileName?: string;
}

const PdfExporter: React.FC<PdfExporterProps> = ({
  actions,
  fileName = 'plano-marketing-anual.pdf',
}) => {
  // Função para exportar o plano de marketing como PDF
  const exportToPdf = async () => {
    // Criar um novo documento PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let yPosition = margin;
    
    // Adicionar título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const title = 'Plano Anual de Marketing - E-commerce de Cosméticos';
    doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    // Adicionar data de geração
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    doc.text(`Gerado em: ${today}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Adicionar resumo
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo do Plano', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const totalBudget = actions.reduce((sum, action) => sum + action.budget, 0);
    const totalRevenue = actions.reduce((sum, action) => sum + action.revenueGoal, 0);
    const averageRoas = totalBudget > 0 ? totalRevenue / totalBudget : 0;
    
    doc.text(`Total de Ações: ${actions.length}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Verba Total: R$ ${totalBudget.toLocaleString('pt-BR')}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Receita Esperada: R$ ${totalRevenue.toLocaleString('pt-BR')}`, margin, yPosition);
    yPosition += 5;
    doc.text(`ROAS Médio: ${averageRoas.toFixed(2)}`, margin, yPosition);
    yPosition += 15;
    
    // Adicionar tabela de ações
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Ações de Marketing', margin, yPosition);
    yPosition += 10;
    
    // Cabeçalho da tabela
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition - 5, pageWidth - (margin * 2), 7, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Título', margin + 2, yPosition);
    doc.text('Período', margin + 50, yPosition);
    doc.text('Responsável', margin + 90, yPosition);
    doc.text('Verba (R$)', margin + 130, yPosition);
    doc.text('Status', margin + 160, yPosition);
    yPosition += 7;
    
    // Ordenar ações por data de início
    const sortedActions = [...actions].sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    
    // Adicionar linhas da tabela
    doc.setFont('helvetica', 'normal');
    
    for (const action of sortedActions) {
      // Verificar se precisa de uma nova página
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin + 10;
      }
      
      const startDate = format(new Date(action.start), 'dd/MM/yyyy');
      const endDate = format(new Date(action.end), 'dd/MM/yyyy');
      
      // Limitar o tamanho do título
      let title = action.title;
      if (title.length > 25) {
        title = title.substring(0, 22) + '...';
      }
      
      doc.text(title, margin + 2, yPosition);
      doc.text(`${startDate} - ${endDate}`, margin + 50, yPosition);
      doc.text(action.responsible, margin + 90, yPosition);
      doc.text(action.budget.toLocaleString('pt-BR'), margin + 130, yPosition);
      doc.text(action.status, margin + 160, yPosition);
      
      yPosition += 7;
      
      // Adicionar linha separadora
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, yPosition - 3, pageWidth - margin, yPosition - 3);
    }
    
    yPosition += 10;
    
    // Adicionar detalhes de cada ação
    doc.addPage();
    yPosition = margin;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes das Ações', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    for (const action of sortedActions) {
      // Verificar se precisa de uma nova página
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Título da ação
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(action.title, margin, yPosition);
      yPosition += 7;
      
      // Informações básicas
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      const startDate = format(new Date(action.start), 'dd/MM/yyyy');
      const endDate = format(new Date(action.end), 'dd/MM/yyyy');
      
      doc.text(`Período: ${startDate} - ${endDate}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Frequência: ${action.frequency}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Responsável: ${action.responsible}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Verba: R$ ${action.budget.toLocaleString('pt-BR')}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Meta de Receita: R$ ${action.revenueGoal.toLocaleString('pt-BR')}`, margin, yPosition);
      yPosition += 5;
      doc.text(`ROAS Esperado: ${action.roas.toFixed(2)}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Status: ${action.status}`, margin, yPosition);
      yPosition += 8;
      
      // Objetivo e Sazonalidade
      doc.setFont('helvetica', 'bold');
      doc.text('Objetivo:', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      
      // Quebrar texto longo em múltiplas linhas
      const objectiveLines = doc.splitTextToSize(action.objective, pageWidth - (margin * 2));
      doc.text(objectiveLines, margin, yPosition);
      yPosition += objectiveLines.length * 5;
      
      doc.setFont('helvetica', 'bold');
      doc.text('Sazonalidade:', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      
      const seasonalityLines = doc.splitTextToSize(action.seasonality, pageWidth - (margin * 2));
      doc.text(seasonalityLines, margin, yPosition);
      yPosition += seasonalityLines.length * 5;
      
      // Cliente Ideal
      doc.setFont('helvetica', 'bold');
      doc.text('Cliente Ideal:', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      
      const targetCustomerLines = doc.splitTextToSize(action.targetCustomer, pageWidth - (margin * 2));
      doc.text(targetCustomerLines, margin, yPosition);
      yPosition += targetCustomerLines.length * 5;
      
      // Produtos
      doc.setFont('helvetica', 'bold');
      doc.text('Produtos Ofertados:', margin, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      
      if (action.products.length > 0) {
        action.products.forEach(product => {
          doc.text(`• ${product}`, margin + 5, yPosition);
          yPosition += 5;
        });
      } else {
        doc.text('Nenhum produto definido', margin + 5, yPosition);
        yPosition += 5;
      }
      
      yPosition += 3;
      
      // Tarefas
      doc.setFont('helvetica', 'bold');
      doc.text('Tarefas:', margin, yPosition);
      yPosition += 5;
      
      if (action.tasks.length > 0) {
        action.tasks.forEach((task, index) => {
          // Verificar se precisa de uma nova página
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = margin;
          }
          
          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 1}. ${task.title}`, margin + 5, yPosition);
          yPosition += 5;
          
          doc.setFont('helvetica', 'normal');
          doc.text(`Responsável: ${task.responsible} | Prazo: ${format(new Date(task.deadline), 'dd/MM/yyyy')} | Status: ${task.status}`, margin + 10, yPosition);
          yPosition += 5;
          
          // Subtarefas
          if (task.subtasks.length > 0) {
            doc.text('Subtarefas:', margin + 10, yPosition);
            yPosition += 5;
            
            task.subtasks.forEach((subtask, subIndex) => {
              // Verificar se precisa de uma nova página
              if (yPosition > pageHeight - 15) {
                doc.addPage();
                yPosition = margin;
              }
              
              doc.text(`${index + 1}.${subIndex + 1}. ${subtask.title}`, margin + 15, yPosition);
              yPosition += 4;
              doc.text(`Responsável: ${subtask.responsible} | Prazo: ${format(new Date(subtask.deadline), 'dd/MM/yyyy')} | Status: ${subtask.status}`, margin + 20, yPosition);
              yPosition += 5;
            });
          }
          
          yPosition += 3;
        });
      } else {
        doc.setFont('helvetica', 'normal');
        doc.text('Nenhuma tarefa definida', margin + 5, yPosition);
        yPosition += 5;
      }
      
      // Adicionar separador entre ações
      yPosition += 5;
      doc.setDrawColor(150, 150, 150);
      doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
      yPosition += 10;
    }
    
    // Salvar o PDF
    doc.save(fileName);
  };

  return (
    <button
      onClick={exportToPdf}
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

export default PdfExporter;
