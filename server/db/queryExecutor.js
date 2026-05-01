import path from 'path';
import { fileURLToPath } from 'url';
import { getDbClientName, queryWithDb } from './dbClient.js';
import { getStatementById, initializeXmlMappers } from './xmlMapperRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mapperDir = path.join(__dirname, '..', 'mappers');

function compileMySqlBindings(sql, params) {
  const values = [];
  const compiledSql = sql.replace(/#\{([a-zA-Z0-9_]+)\}/g, (_match, key) => {
    values.push(params[key]);
    return '?';
  });

  return {
    sql: compiledSql,
    bindings: values
  };
}

function compileOracleBindings(sql, params) {
  const bindings = {};
  let index = 0;

  const compiledSql = sql.replace(/#\{([a-zA-Z0-9_]+)\}/g, (_match, key) => {
    const bindKey = `b${index}`;
    bindings[bindKey] = params[key];
    index += 1;
    return `:${bindKey}`;
  });

  return {
    sql: compiledSql,
    bindings
  };
}

function compileBindings(dbClientName, sql, params) {
  if (dbClientName === 'oracle') {
    return compileOracleBindings(sql, params);
  }

  return compileMySqlBindings(sql, params);
}

export async function executeSelect(statementId, params = {}) {
  await initializeXmlMappers(mapperDir);

  const dbClientName = getDbClientName();
  const statement = getStatementById(statementId, dbClientName);

  if (statement.type !== 'select') {
    throw new Error(`현재는 select만 지원합니다: ${statementId}`);
  }

  const { sql, bindings } = compileBindings(dbClientName, statement.sql, params);
  return queryWithDb(sql, bindings);
}

export async function executeStatement(statementId, params = {}) {
  await initializeXmlMappers(mapperDir);

  const dbClientName = getDbClientName();
  const statement = getStatementById(statementId, dbClientName);

  const { sql, bindings } = compileBindings(dbClientName, statement.sql, params);
  return queryWithDb(sql, bindings);
}
