import dotenv from 'dotenv';

dotenv.config();

const apiBaseUrl = process.env.DANAWA_API_BASE_URL;
const searchPath = process.env.DANAWA_SEARCH_PATH || '/v1/search';
const apiKey = process.env.DANAWA_API_KEY;

const danawaController = {};

danawaController.search = async (req, res) => {
  const q = String(req.query.q || '').trim();
  const page = String(req.query.page || '1').trim();
  const size = String(req.query.size || '10').trim();

  if (!q) {
    return res.status(400).json({ status: 'fail', message: 'q 파라미터가 필요합니다.' });
  }

  if (!apiBaseUrl || !apiKey) {
    return res.status(500).json({
      status: 'fail',
      message: '서버 환경변수(DANAWA_API_BASE_URL, DANAWA_API_KEY)가 설정되지 않았습니다.'
    });
  }

  try {
    const target = new URL(searchPath, apiBaseUrl);
    target.searchParams.set('query', q);
    target.searchParams.set('page', page);
    target.searchParams.set('size', size);

    const response = await fetch(target, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        Authorization: `Bearer ${apiKey}`
      }
    });

    const bodyText = await response.text();
    let body;

    try {
      body = JSON.parse(bodyText);
    } catch {
      body = { raw: bodyText };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        status: 'fail',
        message: '다나와 API 호출이 실패했습니다.',
        upstream: body
      });
    }

    return res.status(200).json({ status: 'success', data: body });
  } catch (err) {
    return res.status(502).json({
      status: 'fail',
      message: '외부 API 연결 중 오류가 발생했습니다.',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export default danawaController;
