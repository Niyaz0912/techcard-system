import { useState } from 'react';
import TechCardsList from './TechCardsList';
import CreateTechCard from './CreateTechCard';
import TechCardDetail from './TechCardDetail';
import EditTechCard from './EditTechCard';

export default function TechCards() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'detail', 'edit'
  const [selectedCardId, setSelectedCardId] = useState(null);

  const handleCreateSuccess = () => {
    setCurrentView('list');
  };

  const handleViewCard = (id) => {
    setSelectedCardId(id);
    setCurrentView('detail');
  };

  const handleEditCard = (id) => {
    setSelectedCardId(id);
    setCurrentView('edit');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2">Технологические карты</h1>
          <p className="text-muted">Управление производственными техкартами</p>
        </div>
        
        {currentView === 'list' && (
          <button className="btn btn-primary" onClick={() => setCurrentView('create')}>
            + Создать техкарту
          </button>
        )}
        {currentView !== 'list' && (
          <button className="btn btn-secondary" onClick={() => setCurrentView('list')}>
            ← Назад к списку
          </button>
        )}
      </div>

      {currentView === 'list' && (
        <TechCardsList onView={handleViewCard} onEdit={handleEditCard} />
      )}

      {currentView === 'create' && (
        <CreateTechCard onSuccess={handleCreateSuccess} onCancel={() => setCurrentView('list')} />
      )}

      {currentView === 'detail' && selectedCardId && (
        <TechCardDetail cardId={selectedCardId} onEdit={() => handleEditCard(selectedCardId)} />
      )}

      {currentView === 'edit' && selectedCardId && (
        <EditTechCard cardId={selectedCardId} onSuccess={() => setCurrentView('list')} />
      )}
    </div>
  );
}