# bank app

## run

```bash
cd backend
cp .env.example .env
npm install
npm run start
```

## API

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/account/me`
- POST `/api/account/deposit`
- POST `/api/account/withdraw`
- POST `/api/account/change-password`
- DELETE `/api/account`
- GET `/api/account/transactions?limit=20&offset=0`
