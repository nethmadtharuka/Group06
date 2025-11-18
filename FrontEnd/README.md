# EventCraft Frontend

Event management system frontend built with React, TypeScript, and Vite.

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (default: https://eventcraft-backend-production-b9b7.up.railway.app)

## Environment Variables

Create a `.env` file in the root directory:

```bash
# API Base URL (optional - defaults to production URL)
VITE_API_BASE_URL=https://eventcraft-backend-production-b9b7.up.railway.app/api
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Building for Production

```bash
# Build for production
npm run build
```

The production build will be in the `dist` directory.

## Production Deployment

### Build Output
After running `npm run build`, the `dist` folder contains:
- Optimized and minified JavaScript bundles
- CSS files
- Static assets (images, videos, etc.)
- `index.html`

### Deployment Options

#### Option 1: Static Hosting (Vercel, Netlify, etc.)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Set environment variable `VITE_API_BASE_URL` if needed

#### Option 2: Traditional Web Server (Nginx, Apache)
1. Build the project: `npm run build`
2. Copy the `dist` folder contents to your web server's public directory
3. Configure your server to serve `index.html` for all routes (SPA routing)

**Nginx Example:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/eventcraft/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Option 3: Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Production Build Features

- **Code Splitting**: Automatic code splitting for optimal loading
- **Minification**: All JavaScript and CSS are minified
- **Console Removal**: All `console.log` statements are removed in production
- **Source Maps**: Disabled for security (can be enabled if needed)
- **Tree Shaking**: Unused code is automatically removed

## Environment Configuration

The app uses Vite's environment variable system:
- Variables must be prefixed with `VITE_` to be exposed to the client
- Access via `import.meta.env.VITE_VARIABLE_NAME`
- `.env` files are loaded automatically

## Troubleshooting

### API Connection Issues
- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS settings on the backend
- Ensure the backend is accessible from your deployment domain

### Routing Issues (404 on refresh)
- Configure your server to serve `index.html` for all routes
- This is required for client-side routing to work

### Build Errors
- Clear `node_modules` and `dist` folders
- Run `npm install` again
- Check Node.js version (requires 18+)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
