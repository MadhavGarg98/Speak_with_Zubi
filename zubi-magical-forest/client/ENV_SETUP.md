# Environment Configuration

This project supports multiple backend configurations using Vite environment variables.

## Available Scripts

- `npm run dev` - Development mode (uses `.env.development`)
- `npm run dev:local` - Local development mode (uses `.env.local`)
- `npm run build` - Production build (uses `.env.production`)
- `npm run build:dev` - Development build (uses `.env.development`)
- `npm run preview` - Preview production build

## Environment Files

### `.env.local` (Local Development)
```
VITE_API_URL=http://localhost:3001
```

### `.env.development` (Development)
```
VITE_API_URL=http://localhost:3001
```

### `.env.production` (Production)
```
VITE_API_URL=https://your-deployed-backend-url.com
```

## How to Use

### For Local Development:
```bash
npm run dev:local
```

### For Development with Custom Backend:
1. Edit `.env.development`:
   ```
   VITE_API_URL=https://your-dev-backend.com
   ```
2. Run:
   ```bash
   npm run dev
   ```

### For Production:
1. Edit `.env.production`:
   ```
   VITE_API_URL=https://your-production-backend.com
   ```
2. Build:
   ```bash
   npm run build
   ```

## API Configuration

The project uses `src/utils/apiConfig.js` to handle API calls:

```javascript
import { apiCall } from './utils/apiConfig';

// Example usage
const response = await apiCall('/chat', {
  method: 'POST',
  body: JSON.stringify({ message: 'Hello' })
});
```

## Environment Variables

- `VITE_API_URL` - Your backend API URL
- Must be prefixed with `VITE_` to be exposed to the frontend

## Switching Between Environments

1. **Local**: Uses `http://localhost:3001`
2. **Development**: Configure in `.env.development`
3. **Production**: Configure in `.env.production`

The correct environment file is automatically loaded based on the script you run.
