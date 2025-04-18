'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import { format, parseISO, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Tipos para as ações de marketing
export interface MarketingAction {
  id: string;
  title: string;
  start: Date;
  end: Date;
  frequency: 'semanal' | 'quinzenal' | 'mensal';
  budget: number;
  objective: string;
  seasonality: string;
  targetCustomer: string;
  products: string[];
  revenueGoal: number;
  roas: number;
  responsible: string;
  status: 'planejado' | 'em andamento' | 'concluído' | 'cancelado';
  tasks: {
    id: string;
    title: string;
    deadline: Date;
    responsible: string;
    status: 'pendente' | 'em andamento' | 'concluído';
    subtasks: {
      id: string;
      title: string;
      deadline: Date;
      responsible: string;
      status: 'pendente' | 'em andamento' | 'concluído';
    }[];
  }[];
}

interface MarketingCalendarProps {
  actions: MarketingAction[];
  onSelectAction: (action: MarketingAction) => void;
  onAddAction: (date: Date) => void;
}

const MarketingCalendar: React.FC<MarketingCalendarProps> = ({
  actions,
  onSelectAction,
  onAddAction,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);

  // Função para formatar eventos no calendário
  const eventStyleGetter = (event: MarketingAction) => {
    let backgroundColor = '#3174ad';
    
    // Cores diferentes baseadas no status
    switch (event.status) {
      case 'planejado':
        backgroundColor = '#3174ad';
        break;
      case 'em andamento':
        backgroundColor = '#f39c12';
        break;
      case 'concluído':
        backgroundColor = '#27ae60';
        break;
      case 'cancelado':
        backgroundColor = '#e74c3c';
        break;
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontWeight: 'bold',
      },
    };
  };

  // Função para formatar o título do evento
  const eventTitleAccessor = (event: MarketingAction) => {
    return `${event.title} - R$ ${event.budget.toLocaleString('pt-BR')}`;
  };

  // Função para navegar entre meses
  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  // Função para lidar com clique duplo em uma data (adicionar nova ação)
  const handleSelectSlot = ({ start }: { start: Date }) => {
    onAddAction(start);
  };

  // Função para lidar com clique em um evento (editar ação)
  const handleSelectEvent = (event: MarketingAction) => {
    onSelectAction(event);
  };

  // Personalização dos componentes do calendário
  const components = {
    toolbar: CustomToolbar,
  };

  // Componente personalizado para a barra de ferramentas
  function CustomToolbar({ date, onNavigate, label }: any) {
    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={() => onNavigate('TODAY')}>
            Hoje
          </button>
          <button type="button" onClick={() => onNavigate('PREV')}>
            Anterior
          </button>
          <button type="button" onClick={() => onNavigate('NEXT')}>
            Próximo
          </button>
        </span>
        <span className="rbc-toolbar-label">{label}</span>
        <span className="rbc-btn-group">
          <button type="button" onClick={() => setView(Views.MONTH)}>
            Mês
          </button>
          <button type="button" onClick={() => setView(Views.WEEK)}>
            Semana
          </button>
          <button type="button" onClick={() => setView(Views.DAY)}>
            Dia
          </button>
          <button type="button" onClick={() => setView(Views.AGENDA)}>
            Agenda
          </button>
        </span>
      </div>
    );
  }

  // Mensagens em português
  const messages = {
    today: 'Hoje',
    previous: 'Anterior',
    next: 'Próximo',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    allDay: 'Dia inteiro',
    noEventsInRange: 'Não há ações de marketing neste período.',
  };

  return (
    <div className="h-[700px] w-full">
      <Calendar
        localizer={{
          format: (date, format) => format(date, format, { locale: ptBR }),
          formats: {
            dateFormat: 'dd',
            dayFormat: 'dd ddd',
            monthHeaderFormat: 'MMMM yyyy',
            dayHeaderFormat: 'dddd MMM dd',
            dayRangeHeaderFormat: ({ start, end }) => 
              `${format(start, 'dd MMM', { locale: ptBR })} - ${format(end, 'dd MMM', { locale: ptBR })}`,
          },
          startOfWeek: () => 0, // Domingo
          getRange: (date, unit) => {
            if (unit === 'month') {
              return [startOfMonth(date), endOfMonth(date)];
            }
            return [date, addMonths(date, 1)];
          },
        }}
        events={actions}
        startAccessor="start"
        endAccessor="end"
        titleAccessor={eventTitleAccessor}
        style={{ height: '100%' }}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        view={view}
        onView={setView}
        date={currentDate}
        onNavigate={handleNavigate}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        components={components}
        messages={messages}
        popup
      />
    </div>
  );
};

export default MarketingCalendar;
