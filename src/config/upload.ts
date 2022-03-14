import crypto from 'crypto';
import multer from 'multer';
import path from 'path';

export interface IUpload {
  storage: multer.StorageEngine;
}

function upload(folder: string): IUpload {
  const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', folder),
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(16).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  });

  return { storage };
}

const uploadConfig = { upload };

export default uploadConfig;
