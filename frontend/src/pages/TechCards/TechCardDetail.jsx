import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function TechCardDetail({ cardId, onEdit }) {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechCard();
  }, [cardId]);

  const fetchTechCard = async () => {
    try {
      const response = await api.get(`/tech-cards/${cardId}`);
      setCard(response.data.data);
    } catch (error) {
      console.error('Ошибка загрузки техкарты:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner-border"></div>;
  if (!card) return <div>Техкарта не найдена</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title mb-1">{card.productName}</h4>
        <p className="text-muted mb-0">№ {card.documentNumber}</p>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <p><strong>Заказчик:</strong> {card.customer}</p>
            <p><strong>Название заказа:</strong> {card.orderName}</p>
            <p><strong>Код изделия:</strong> {card.productCode}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Статус:</strong> 
              <span className={`badge ms-2 ${card.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                {card.status === 'completed' ? 'Завершено' : 'В работе'}
              </span>
            </p>
            <p><strong>Количество:</strong> {card.currentQuantity}/{card.totalQuantity}</p>
            <p><strong>Создано:</strong> {new Date(card.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        {card.pdfUrl && (
          <div className="mt-3">
            <strong>PDF документ: </strong>
            <a href={card.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary ms-2">
              📄 Открыть PDF
            </a>
          </div>
        )}
      </div>
      <div className="card-footer">
        <button className="btn btn-primary" onClick={onEdit}>
          Редактировать техкарту
        </button>
      </div>
    </div>
  );
}