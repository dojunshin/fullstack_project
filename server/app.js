import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDbClientName } from './db/dbClient.js';
import indexRouter from './Routes/index.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  })
);

// Routes
app.use('/api', indexRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'danawa-api-proxy',
    dbClient: getDbClientName()
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\n[오류] 포트 ${port}가 이미 사용 중입니다.\n` +
      `다음 명령으로 점유 프로세스를 종료하세요:\n` +
      `  kill $(lsof -nP -iTCP:${port} -sTCP:LISTEN -t)\n`
    );
    process.exit(1);
  } else {
    throw err;
  }
});
