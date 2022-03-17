import fs from 'fs';
import path from 'path';

import uploadConfig from '../../../../../config/upload';
import { IStorageProvider } from '../IStorageProvider';

class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder = '.'): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.tmpFolder, folder, file),
    );

    return file;
  }

  async delete(file: string, folder = '.'): Promise<void> {
    const filename = path.resolve(uploadConfig.tmpFolder, folder, file);

    try {
      await fs.promises.stat(filename);
    } catch (err) {
      return;
    }

    await fs.promises.unlink(filename);
  }
}

export { LocalStorageProvider };
