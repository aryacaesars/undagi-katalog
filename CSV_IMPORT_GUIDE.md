# CSV Import Feature Documentation

## Overview
Fitur import CSV memungkinkan admin untuk menambahkan atau mengganti data pricing plans dalam jumlah banyak menggunakan file CSV, sehingga tidak perlu input manual satu per satu.

## Features
- ✅ Import data dari file CSV
- ✅ Download template CSV dengan format yang benar
- ✅ Validasi data sebelum import
- ✅ Option untuk replace data existing atau menambah data baru
- ✅ Export data existing ke CSV
- ✅ Drag & drop file upload
- ✅ Error handling dan success feedback
- ✅ Auto-seed jika database kosong

## How to Use

### 1. Access Admin Panel
- Buka halaman admin: `/dashboard/pricing-plans/admin`
- Atau dari halaman utama (development mode), klik tombol "Admin Panel"

### 2. Download Template
- Klik "Download Template" untuk mendapatkan file CSV dengan format yang benar
- File template berisi contoh data dan struktur yang diperlukan

### 3. Prepare CSV Data
- Edit file template atau buat file CSV baru
- Pastikan format sesuai dengan panduan di bawah

### 4. Import Data
- Klik "Import CSV" di admin panel
- Drag & drop file CSV atau klik "Select CSV File"
- Pilih "Replace existing data" jika ingin mengganti semua data lama
- Klik "Import Data"

## CSV Format Guide

### Required Fields
- `name` - Nama paket (contoh: "Basic", "Premium")
- `subtitle` - Subtitle paket (contoh: "Solusi Dasar Terjangkau")
- `price` - Harga paket (contoh: "15 juta")
- `originalPrice` - Harga asli sebelum diskon (contoh: "20 juta")

### Optional Fields
- `discount` - Persentase diskon (contoh: "25%")
- `description` - Deskripsi paket
- `features` - Fitur-fitur (pisahkan dengan `|`)
- `limitations` - Keterbatasan (pisahkan dengan `|`)
- `popular` - true/false (hanya satu yang boleh true)
- `color` - Warna theme (blue, red, purple, green, etc.)
- `sortOrder` - Urutan tampilan (angka)
- `isActive` - Status aktif true/false

### Format Rules
1. **Features & Limitations**: Gunakan `|` (pipe) sebagai pemisah
   ```
   "Kitchen set standar|Countertop granite|Sink stainless steel"
   ```

2. **Boolean Values**: Gunakan "true" atau "false" (dengan quotes)
   ```
   "true", "false"
   ```

3. **Quotes**: Wrap dengan quotes jika value mengandung koma
   ```
   "Paket dasar untuk dapur kecil, dengan kualitas standar"
   ```

4. **Popular Plans**: Hanya satu plan yang boleh popular=true

## Example CSV
```csv
name,subtitle,price,originalPrice,discount,description,features,limitations,popular,color,sortOrder,isActive
"Basic","Solusi Dasar","15 juta","20 juta","25%","Paket dasar untuk renovasi dapur","Kitchen set standar|Countertop granite|Garansi 1 tahun","Maksimal 3 meter|Tidak termasuk appliances","false","blue","1","true"
"Regular","Pilihan Terpopuler","35 juta","45 juta","22%","Paket lengkap dengan kualitas premium","Kitchen set custom|Countertop granite import|Garansi 2 tahun","Maksimal 5 meter|1 appliance included","true","red","2","true"
```

## API Endpoints

### Import CSV
- **POST** `/api/pricing-plans/import`
- **Content-Type**: `multipart/form-data`
- **Body**: 
  - `file`: CSV file
  - `replaceExisting`: boolean

### Download Template
- **GET** `/api/pricing-plans/template`
- **Response**: CSV file download

### Seed Default Data
- **POST** `/api/pricing-plans/seed`
- **Response**: JSON with created plans

## Error Handling
- File validation (CSV format, size limit 5MB)
- Data validation (required fields, format checking)
- Database transaction (rollback on error)
- User-friendly error messages

## Features Integration
- Auto-refresh data setelah import berhasil
- Seamless integration dengan existing pricing plans component
- Fallback ke data demo jika database kosong
- Auto-seed database saat pertama kali akses

## File Locations
- `lib/csv-parser.js` - CSV parsing utilities
- `components/csv-importer.jsx` - Import UI component  
- `app/api/pricing-plans/import/route.js` - Import API endpoint
- `app/api/pricing-plans/template/route.js` - Template download API
- `app/dashboard/pricing-plans/admin/page.js` - Admin management page
- `public/sample-pricing-plans.csv` - Sample CSV file

## Sample Files
- Template CSV: `/api/pricing-plans/template`
- Sample CSV: `/sample-pricing-plans.csv`
