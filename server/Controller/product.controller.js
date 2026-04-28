import { executeSelect } from '../db/queryExecutor.js';

const productController = {};

productController.searchProducts = async (req, res) => {
  const q = String(req.query.q || '').trim();
  const page = Math.max(1, Number(req.query.page || 1));
  const size = Math.max(1, Math.min(100, Number(req.query.size || 10)));

  if (!q) {
    return res.status(400).json({ status: 'fail', message: 'q 파라미터가 필요합니다.' });
  }

  const offset = (page - 1) * size;

  try {
    const rows = await executeSelect('ProductMapper.searchProducts', {
      keywordLike: `%${q}%`,
      limit: size,
      offset,
      startRow: offset + 1,
      endRow: offset + size
    });

    return res.status(200).json({ status: 'success', data: rows, page, size });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

productController.getProductById = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isFinite(id)) {
    return res.status(400).json({ status: 'fail', message: '유효한 id가 필요합니다.' });
  }

  try {
    const rows = await executeSelect('ProductMapper.findById', { id });
    const item = rows[0] || null;

    if (!item) {
      return res.status(404).json({ status: 'fail', message: '데이터가 없습니다.' });
    }

    return res.status(200).json({ status: 'success', data: item });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

export default productController;
