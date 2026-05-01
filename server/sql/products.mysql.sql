CREATE TABLE IF NOT EXISTS products (
  product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NULL,
  price INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (product_name, brand, price)
VALUES
  ('게이밍 노트북 A', 'BrandA', 1590000),
  ('초경량 노트북 B', 'BrandB', 1290000),
  ('사무용 노트북 C', 'BrandC', 890000);


ㅁㅁㅁ