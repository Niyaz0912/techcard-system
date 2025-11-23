import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function TechCardsList({ onEdit, onView }) {
  const [techCards, setTechCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechCards();
  }, []);

  const fetchTechCards = async () => {
    try {
      const response = await api.get('/tech-cards');
      setTechCards(response.data.data);
    } catch (error) {
      console.error('Ошибка загрузки техкарт:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить техкарту?')) {
      try {
        await api.delete(`/tech-cards/${id}`);
        fetchTechCards();
      } catch (error) {
        alert('Ошибка удаления техкарты');
      }
    }
  };

  if (loading) return <div className="spinner-border"></div>;

  return (
    <div className="row">
      {techCards.map(card => (
        <div key={card.id} className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-1">{card.productName}</h5>
              <small className="text-muted">№ {card.documentNumber}</small>
            </div>
            <div className="card-body">
              <p className="card-text"><strong>Заказчик:</strong> {card.customer}</p>
              <p className="card-text"><strong>Код:</strong> {card.productCode}</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className={`badge ${card.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                  {card.status === 'completed' ? 'Завершено' : 'В работе'}
                </span>
                <div className="text-end">
                  <div className="h5 mb-0">{card.currentQuantity}/{card.totalQuantity}</div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="btn-group w-100">
                <button className="btn btn-sm btn-outline-primary" onClick={() => onView(card.id)}>
                  Просмотр
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(card.id)}>
                  Редакт.
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(card.id)}>
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}