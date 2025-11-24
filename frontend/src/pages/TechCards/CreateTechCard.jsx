import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

export default function CreateTechCard({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    customer: '', orderName: '', productName: '',
    productCode: '', totalQuantity: 0, documentNumber: '',
    pdfFile: null // Добавляем поле для файла
  });
  const [uploading, setUploading] = useState(false);
  const { user } = useAuthStore();

  // Обработчик выбора файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, pdfFile: file });
    } else if (file) {
      alert('Пожалуйста, выберите PDF файл');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // ВРЕМЕННО убираем PDF загрузку
      const dataToSend = {
        customer: formData.customer,
        orderName: formData.orderName,
        productName: formData.productName,
        productCode: formData.productCode,
        totalQuantity: formData.totalQuantity,
        documentNumber: formData.documentNumber,
        createdBy: user?.id || 2 // временно хардкод если user null
      };

      console.log('📤 Отправляемые данные:', dataToSend);

      await api.post('/tech-cards', dataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      onSuccess();
    } catch (error) {
      console.error('Create error:', error);
      alert('Ошибка при создании техкарты: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title mb-0">Создать новую техкарту</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Заказчик *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Название заказчика"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Название заказа *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Название заказа"
                value={formData.orderName}
                onChange={(e) => setFormData({ ...formData, orderName: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Изделие *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Наименование изделия"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Код изделия *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Артикул или код"
                value={formData.productCode}
                onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Количество *</label>
              <input
                type="number"
                className="form-control"
                placeholder="0"
                value={formData.totalQuantity}
                onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value) || 0 })}
                min="0"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Номер документа *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Номер техкарты"
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                required
              />
            </div>

            {/* ПОЛЕ ДЛЯ ЗАГРУЗКИ PDF */}
            <div className="col-12">
              <label className="form-label">
                <strong>📄 PDF технологической карты</strong>
              </label>
              <input
                type="file"
                className="form-control"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <div className="form-text">
                Загрузите технологическую карту в формате PDF (опционально)
                {formData.pdfFile && (
                  <span className="text-success ms-2">
                    ✓ Файл выбран: {formData.pdfFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-success me-2"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Создание...
                </>
              ) : (
                'Создать техкарту'
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={uploading}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
