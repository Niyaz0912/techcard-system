import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function EditTechCard({ cardId, onSuccess }) {
  const [formData, setFormData] = useState({
    customer: '', orderName: '', productName: '', 
    productCode: '', totalQuantity: 0, documentNumber: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechCard();
  }, [cardId]);

  const fetchTechCard = async () => {
    try {
      const response = await api.get(`/tech-cards/${cardId}`);
      const card = response.data.data;
      setFormData({
        customer: card.customer,
        orderName: card.orderName,
        productName: card.productName,
        productCode: card.productCode,
        totalQuantity: card.totalQuantity,
        documentNumber: card.documentNumber
      });
    } catch (error) {
      console.error('Ошибка загрузки техкарты:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tech-cards/${cardId}`, formData);
      onSuccess();
    } catch (error) {
      alert('Ошибка обновления техкарты: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="spinner-border"></div>;

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Редактировать техкарту</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Заказчик *</label>
              <input type="text" className="form-control" value={formData.customer} 
                onChange={(e) => setFormData({...formData, customer: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Название заказа *</label>
              <input type="text" className="form-control" value={formData.orderName} 
                onChange={(e) => setFormData({...formData, orderName: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Изделие *</label>
              <input type="text" className="form-control" value={formData.productName} 
                onChange={(e) => setFormData({...formData, productName: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Код изделия *</label>
              <input type="text" className="form-control" value={formData.productCode} 
                onChange={(e) => setFormData({...formData, productCode: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Количество *</label>
              <input type="number" className="form-control" value={formData.totalQuantity} 
                onChange={(e) => setFormData({...formData, totalQuantity: parseInt(e.target.value) || 0})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Номер документа *</label>
              <input type="text" className="form-control" value={formData.documentNumber} 
                onChange={(e) => setFormData({...formData, documentNumber: e.target.value})} required />
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-success me-2">Сохранить изменения</button>
            <button type="button" className="btn btn-secondary" onClick={onSuccess}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}