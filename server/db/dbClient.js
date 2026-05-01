import dotenv from 'dotenv';

dotenv.config();

const DB_CLIENT = (process.env.DB_CLIENT || 'mysql').toLowerCase();

let mysqlPool;
let oraclePool;
let oracleDb;
// 일단테스트....

async function getMysqlPool() {
  if (mysqlPool) {
    return mysqlPool;
  }

  const mysql = await import('mysql2/promise');

  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_SIZE || 10)
  });

  return mysqlPool;
}

async function getOraclePool() {
  if (oraclePool) {
    return { pool: oraclePool, oracleDb };
  }

  try {
    const mod = await import('oracledb');
    oracleDb = mod.default || mod;
  } catch {
    throw new Error('Oracle 사용 시 server 폴더에서 npm install oracledb를 먼저 실행하세요.');
  }

  oraclePool = await oracleDb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING || '127.0.0.1:1521/XEPDB1',
    poolMin: 1,
    poolMax: Number(process.env.DB_POOL_SIZE || 10),
    poolIncrement: 1
  });

  return { pool: oraclePool, oracleDb };
}

export function getDbClientName() {
  return DB_CLIENT;
}

export async function queryWithDb(sql, bindings) {
  if (DB_CLIENT === 'mysql') {
    const pool = await getMysqlPool();
    const [rows] = await pool.query(sql, bindings);
    return rows;
  }

  if (DB_CLIENT === 'oracle') {
    const { pool, oracleDb: odb } = await getOraclePool();
    const connection = await pool.getConnection();

    try {
      const result = await connection.execute(sql, bindings, {
        outFormat: odb.OUT_FORMAT_OBJECT,
        autoCommit: false
      });
      return result.rows || [];
    } finally {
      await connection.close();
    }
  }

  throw new Error(`지원하지 않는 DB_CLIENT 값입니다: ${DB_CLIENT}`);
}
