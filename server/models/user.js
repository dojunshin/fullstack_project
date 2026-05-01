import { executeSelect, executeStatement } from '../db/queryExecutor.js';

export async function createUser({ name, email, password, phone }) {
  const [result] = await executeStatement('UserMapper.createUser', { name, email, password, phone });
  return result.insertId;
}

export async function findByEmail(email) {
  const rows = await executeSelect('UserMapper.findByEmail', { email });
  return rows[0] || null;
}

export async function findById(id) {
  const rows = await executeSelect('UserMapper.findById', { id });
  return rows[0] || null;
}
