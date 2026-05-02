FROM mysql:8.0
ADD https://raw.githubusercontent.com/dojunshin/fullstack_project/main/server/sql/products.mysql.sql /docker-entrypoint-initdb.d/init.sql
RUN chmod 644 /docker-entrypoint-initdb.d/init.sql
