import crypto from 'crypto';
import multer from 'multer';
import path from 'path';

export interface IUpload {
  storage: multer.StorageEngine;
}

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

const storage = multer.diskStorage({
  destination: tmpFolder,
  filename: (request, file, callback) => {
    const fileHash = crypto.randomBytes(16).toString('hex');
    const fileName = `${fileHash}-${file.originalname}`;

    return callback(null, fileName);
  },
});

const uploadConfig = { tmpFolder, storage };

export default uploadConfig;
