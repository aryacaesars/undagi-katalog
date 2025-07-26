# Database Setup dengan Prisma dan Neon DB

## Prerequisites
- Node.js 18+
- Account Neon DB (https://neon.tech)

## Setup Instructions

### 1. Konfigurasi Environment Variables
Buat file `.env` di root project dan isi dengan:

```env
# Database URL dari Neon DB
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# Next.js Environment
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Setup Neon Database
1. Login ke https://console.neon.tech
2. Buat project baru
3. Copy connection string dari dashboard
4. Paste ke `DATABASE_URL` di file `.env`

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Push Schema ke Database
```bash
npm run db:push
```

### 5. Seed Database dengan Data Awal
```bash
npm run db:seed
```

## Available Scripts

### Database Commands
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset database and run migrations

## Database Schema

### Tables
1. **banners** - Banner/Hero section data
2. **catalogues** - Product catalog data
3. **users** - User management
4. **carts** - Shopping cart functionality
5. **cart_items** - Cart items
6. **orders** - Order management
7. **order_items** - Order items
8. **settings** - Website settings

## API Endpoints

### Banners
- `GET /api/banners` - Get all banners
- `GET /api/banners?active=true` - Get active banners only
- `POST /api/banners` - Create banner
- `GET /api/banners/[id]` - Get banner by ID
- `PUT /api/banners/[id]` - Update banner
- `DELETE /api/banners/[id]` - Delete banner

### Catalogues
- `GET /api/catalogues` - Get all catalogues (with pagination)
- `GET /api/catalogues?jenis=Elektronik` - Filter by category
- `GET /api/catalogues?search=laptop` - Search products
- `POST /api/catalogues` - Create catalogue
- `GET /api/catalogues/[id]` - Get catalogue by ID
- `PUT /api/catalogues/[id]` - Update catalogue
- `DELETE /api/catalogues/[id]` - Delete catalogue

### Bulk Operations
- `POST /api/catalogues/bulk` - Bulk import catalogues (for CSV upload)
- `DELETE /api/catalogues/bulk` - Bulk delete catalogues

## Usage in Components

### Fetching Data
```javascript
// Get all banners
const response = await fetch('/api/banners')
const { data: banners } = await response.json()

// Get all catalogues
const response = await fetch('/api/catalogues')
const { data: catalogues } = await response.json()
```

### Creating Data
```javascript
// Create banner
const response = await fetch('/api/banners', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New Banner',
    subtitle: 'Banner subtitle',
    // ... other fields
  }),
})

// Create catalogue
const response = await fetch('/api/catalogues', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jenis: 'Elektronik',
    namaBarang: 'Laptop',
    // ... other fields
  }),
})
```

### Bulk Import CSV
```javascript
const response = await fetch('/api/catalogues/bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    catalogues: [
      {
        jenis: 'Elektronik',
        namaBarang: 'Laptop',
        qty: 10,
        hargaSatuan: 5000000,
        // ... other fields
      },
      // ... more items
    ]
  }),
})
```

## Migration dari State ke Database

Untuk mengintegrasikan database dengan dashboard yang sudah ada, update functions di dashboard:

1. Ganti `useState` dengan API calls
2. Gunakan `useEffect` untuk fetch data
3. Update CRUD operations untuk hit API endpoints
4. Handle loading dan error states

## Production Considerations

1. **Environment Variables**: Pastikan `DATABASE_URL` di production menggunakan connection string production
2. **Migrations**: Gunakan `prisma migrate deploy` di production
3. **Connection Pooling**: Neon DB sudah handle connection pooling
4. **Error Handling**: Implement proper error handling di API routes
5. **Validation**: Add input validation menggunakan library seperti Zod
6. **Authentication**: Implement authentication untuk protect admin routes

## Troubleshooting

### Common Issues
1. **Connection Error**: Pastikan DATABASE_URL benar dan database accessible
2. **Schema Sync Issues**: Run `prisma db push` untuk sync schema
3. **Client Generation**: Run `prisma generate` setelah schema changes

### Debug Mode
Untuk debugging, tambahkan ke schema.prisma:
```prisma
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}
```
