# CSV Import Testing Script

# Sample CSV content untuk testing import pricing plans
name,subtitle,price,originalPrice,discount,description,features,limitations,popular,color,sortOrder,isActive
"Starter","Paket Pemula Hemat","10 juta","15 juta","33%","Paket hemat untuk dapur mini dengan kualitas terjamin","Kitchen set basic|Countertop formica|Sink plastik|Kran standar|Garansi 6 bulan","Maksimal 2 meter|Tidak termasuk instalasi listrik","false","blue","1","true"
"Professional","Solusi Profesional","25 juta","35 juta","29%","Paket professional dengan material berkualitas tinggi","Kitchen set premium|Countertop granite|Sink stainless double|Kran ceramic|LED lighting|Exhaust fan|Garansi 18 bulan","Maksimal 4 meter|1 major appliance","true","red","2","true"
"Executive","Kemewahan Eksekutif","50 juta","70 juta","29%","Paket mewah dengan desain eksklusif dan material premium","Custom kitchen set|Marble countertop|Premium sink|Smart faucet|Smart lighting|Built-in appliances|Kitchen island|Designer consultation|Garansi 2 tahun","","false","purple","3","true"
"Budget","Solusi Budget","8 juta","12 juta","33%","Paket super hemat untuk renovasi dapur sederhana","Kitchen set sederhana|Countertop basic|Sink single|Kran plastik|Garansi 3 bulan","Maksimal 1.5 meter|Self installation|Material terbatas","false","green","0","false"

# Instructions:
# 1. Copy content above (excluding headers) dan save sebagai .csv file
# 2. Upload melalui admin panel di /dashboard/pricing-plans/admin
# 3. Pilih "Replace existing data" jika ingin mengganti semua data lama
# 4. Klik "Import Data"

# Format Rules:
# - Features dan limitations dipisah dengan | (pipe)
# - Popular: true/false (hanya satu yang boleh true)
# - isActive: true/false 
# - Color: blue, red, purple, green, yellow, etc.
# - Price dan originalPrice: format string (misal: "10 juta")
