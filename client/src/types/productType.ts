export type ProductItem = {
  id?: string | number;
  productCode?: string | number;
  name?: string;
  productName?: string;
  price?: string | number;
  minPrice?: string | number;
};

export type SearchResult = {
  status?: string;
  message?: string;
  data?: SearchResult | ProductItem[];
  items?: ProductItem[];
  results?: ProductItem[];
  [key: string]: unknown;
};
