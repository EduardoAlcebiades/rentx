import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

import { connect } from '..';

async function create() {
  const connection = await connect();

  const id = uuidV4();
  const password = await hash('admin', 8);

  await connection.query(
    `
    INSERT INTO users(id, name, email, password, is_admin, driver_license, created_at)
    values('${id}', 'admin', 'admin@rentx.com', '${password}', true, 'XXXXXX', 'now()');
    `,
  );

  await connection.close();
}

create().then(() => console.log('User admin has been created successful!'));
