import fs from 'fs/promises';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: false
});

const statementRegistry = new Map();
let initialized = false;

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getNodeText(node) {
  if (typeof node === 'string') {
    return node.trim();
  }

  if (typeof node === 'object' && node !== null) {
    const candidates = ['#text', '__cdata'];

    for (const key of candidates) {
      if (typeof node[key] === 'string') {
        return node[key].trim();
      }
    }
  }

  return '';
}

function registerStatement(namespace, statementType, statementNode) {
  const id = statementNode?.['@_id'];
  const databaseId = String(statementNode?.['@_databaseId'] || 'default').toLowerCase();
  const sql = getNodeText(statementNode);

  if (!id || !sql) {
    return;
  }

  const key = `${namespace}.${id}`;

  if (!statementRegistry.has(key)) {
    statementRegistry.set(key, new Map());
  }

  statementRegistry.get(key).set(databaseId, {
    type: statementType,
    sql
  });
}

function parseMapperXml(xmlText) {
  const parsed = parser.parse(xmlText);
  const mapper = parsed?.mapper;

  if (!mapper) {
    return;
  }

  const namespace = mapper['@_namespace'];

  if (!namespace) {
    return;
  }

  for (const selectNode of toArray(mapper.select)) {
    registerStatement(namespace, 'select', selectNode);
  }
}

export async function initializeXmlMappers(baseDir) {
  if (initialized) {
    return;
  }

  const files = await fs.readdir(baseDir);
  const xmlFiles = files.filter((name) => name.endsWith('.xml'));

  await Promise.all(
    xmlFiles.map(async (name) => {
      const absolutePath = path.join(baseDir, name);
      const xmlText = await fs.readFile(absolutePath, 'utf8');
      parseMapperXml(xmlText);
    })
  );

  initialized = true;
}

export function getStatementById(statementId, dbClientName) {
  const variants = statementRegistry.get(statementId);

  if (!variants) {
    throw new Error(`XML 매퍼를 찾을 수 없습니다: ${statementId}`);
  }

  const dbKey = String(dbClientName || 'default').toLowerCase();
  const statement = variants.get(dbKey) || variants.get('default');

  if (!statement) {
    throw new Error(`매퍼는 존재하지만 DB 타입(${dbKey})에 맞는 쿼리가 없습니다: ${statementId}`);
  }

  return statement;
}
