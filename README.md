# Danawa Open API Web App

Node.js(최신) + React(최신) + TypeScript(TSX) 기반으로 구성한 간단한 다나와 Open API 검색 웹앱입니다.

## 구성
- `client`: React + Vite + TypeScript(TSX) 프론트엔드
- `server`: Express 백엔드 (다나와 Open API 프록시)

## 사전 준비
1. Node.js 20+ 설치
2. 루트에서 의존성 설치

```bash
npm install
npm --prefix client install
npm --prefix server install
```

## 환경변수 설정
1. `server/.env.example`를 `server/.env`로 복사
2. 다나와 Open API 정보 입력

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
DANAWA_API_BASE_URL=https://openapi.danawa.com
DANAWA_SEARCH_PATH=/v1/search
DANAWA_API_KEY=your-real-api-key
```

3. `client/.env.example`를 `client/.env`로 복사

```env
VITE_API_BASE_URL=http://localhost:4000
```

## 실행
```bash
npm run dev
```
- 프론트: `http://localhost:5173`
- 백엔드: `http://localhost:4000`

## API
- `GET /api/health`
- `GET /api/search?q=노트북&page=1&size=10`
- `GET /api/products?q=노트북&page=1&size=10`
- `GET /api/products/:id`

## XML 매퍼(MyBatis 스타일) DB 조회
Node.js 백엔드에 XML 매퍼 기반 조회 계층을 추가했습니다.

- 매퍼 파일 위치: `server/mappers/ProductMapper.xml`
- 실행기: `server/db/queryExecutor.js`
- 라우트 연결: `server/Routes/product.api.js`, `server/Controller/product.controller.js`

### DB 전환 방식
`server/.env`에서 `DB_CLIENT`만 바꾸면 같은 매퍼 ID로 DB를 바꿔 조회할 수 있습니다.

- MySQL: `DB_CLIENT=mysql`
- Oracle: `DB_CLIENT=oracle`

Oracle을 사용할 때는 서버 폴더에서 드라이버를 추가 설치하세요.

```bash
npm --prefix server install oracledb
```

### 매퍼 작성 규칙
- namespace + id로 쿼리를 호출합니다. 예: `ProductMapper.searchProducts`
- 파라미터는 `#{paramName}` 형식으로 바인딩합니다.
- DB별 SQL 분기는 `databaseId` 속성으로 처리합니다.
	- `<select id="searchProducts" databaseId="mysql">...</select>`
	- `<select id="searchProducts" databaseId="oracle">...</select>`

### 샘플 테이블
기본 예제는 `products` 테이블을 가정합니다. 예시 스키마는 `server/sql/products.mysql.sql` 파일을 참고하세요.

## 참고
다나와 Open API 인증 헤더/파라미터 규격은 실제 문서 기준으로 조정이 필요할 수 있습니다.
현재 기본값으로 `X-API-KEY`와 `Authorization: Bearer`를 함께 전송합니다.
