import multer from 'multer';
import path from 'path';

// Создаем хранилище для файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Папка для загрузок
  },
  filename: (req, file, cb) => {
    // Уникальное имя файла: timestamp-originalname
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Настройка multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Проверяем что файл PDF
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Только PDF файлы разрешены'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // Максимум 10MB
  }
});

export const uploadPDF = upload.single('pdf');