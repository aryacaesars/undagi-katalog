# Dashboard Refactoring Documentation

Dashboard telah direfactor dari file monolitik (1000+ lines) menjadi struktur yang lebih modular dan maintainable.

## Struktur Baru

```
app/dashboard/
├── page.js (Main dashboard - simplified)
├── components/
│   ├── content/           # Komponen untuk menampilkan data (read-only)
│   ├── management/        # Komponen untuk manajemen data (CRUD)
│   │   ├── BannerManagement.jsx
│   │   ├── CatalogueManagement.jsx
│   │   ├── PricingManagement.jsx
│   │   ├── CompanySettings.jsx
│   │   └── ManagementRouter.jsx
│   ├── sidebar/
│   └── Header.jsx
└── hooks/
    ├── useDashboardData.js
    ├── useNavigation.js
    └── useManagementData.js
```

## Pemisahan Responsibility

### 1. **Main Dashboard (page.js)**
- Simplified dari 1000+ lines menjadi ~100 lines
- Hanya menghandle routing dan state management utama
- Membedakan antara content (display) dan management (CRUD)

### 2. **Management Components**
Setiap komponen management menangani CRUD operations untuk kategori spesifik:

#### **BannerManagement.jsx**
- Create, Read, Update, Delete banner
- Toggle active/inactive status
- Form validation dan error handling

#### **CatalogueManagement.jsx**
- CRUD operations untuk katalog produk
- CSV import/export functionality
- Pagination dan search/filter
- Bulk operations

#### **PricingManagement.jsx**
- CRUD untuk pricing plans
- CSV import/export dengan template
- Features dan limitations management
- Plan status management

#### **CompanySettings.jsx**
- Company information management
- Invoice settings
- Business statistics display
- Asset preview (logo, signature)

### 3. **Content Components**
- Tetap di folder `content/` untuk display purposes
- Read-only components untuk dashboard overview

### 4. **Custom Hooks**
#### **useManagementData.js**
- Centralized state management untuk form data
- Reset functions untuk cleanup
- Shared state between management components

## Benefits dari Refactoring

### 1. **Maintainability**
- Setiap komponen fokus pada satu responsibility
- Lebih mudah debug dan test
- Code lebih readable dan organized

### 2. **Reusability**
- Komponen dapat digunakan kembali
- Hook dapat digunakan di komponen lain
- Modular architecture

### 3. **Scalability**
- Mudah menambah komponen management baru
- State management yang terstruktur
- Clear separation of concerns

### 4. **Developer Experience**
- Faster development time
- Easier onboarding untuk developer baru
- Better code organization

## How to Add New Management Component

1. **Buat komponen baru di `management/`**
```jsx
// NewFeatureManagement.jsx
export default function NewFeatureManagement({ 
  data, 
  setData, 
  isSubmitting, 
  setIsSubmitting 
}) {
  // Component logic here
}
```

2. **Tambahkan ke ManagementRouter.jsx**
```jsx
case 'newfeature':
  return <NewFeatureManagement {...props} />
```

3. **Update sidebar navigation**
```jsx
// Di Sidebar.jsx
{ id: 'newfeature', label: 'New Feature', icon: IconComponent }
```

## Migration Notes

- Semua fungsi CRUD telah dipindahkan ke komponen management masing-masing
- State management tetap menggunakan hooks yang ada
- API calls tetap sama, hanya dipindahkan lokasi
- UI/UX tetap sama, hanya struktur code yang berubah

## Performance Improvements

- Lazy loading untuk management components
- Reduced bundle size per page
- Better tree shaking
- Improved memory usage

## Testing Strategy

- Unit tests untuk setiap management component
- Integration tests untuk router
- Hook testing dengan React Testing Library
- E2E tests untuk complete workflows
