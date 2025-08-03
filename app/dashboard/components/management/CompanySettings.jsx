'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save, X, Settings, Building2, FileText, DollarSign } from 'lucide-react'

export default function CompanySettings({ 
  companyData,
  invoiceCounter,
  isEditingCompany,
  setIsEditingCompany,
  isSubmitting,
  saveCompanySettings,
  updateInvoiceCounterHandler,
  handleCompanyInputChange
}) {
  const [tempInvoiceCounter, setTempInvoiceCounter] = useState(invoiceCounter)

  const handleUpdateInvoiceCounter = async () => {
    try {
      await updateInvoiceCounterHandler(tempInvoiceCounter)
    } catch (error) {
      alert('Gagal memperbarui invoice counter: ' + error.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Company Settings</h2>
        {!isEditingCompany && (
          <Button 
            onClick={() => setIsEditingCompany(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Edit Settings
          </Button>
        )}
      </div>

      {/* Company Information */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Informasi Perusahaan</h3>
        </div>

        {isEditingCompany ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Nama Perusahaan</Label>
                <Input
                  id="companyName"
                  name="name"
                  value={companyData.name || ''}
                  onChange={handleCompanyInputChange}
                  placeholder="Masukkan nama perusahaan"
                />
              </div>
              
              <div>
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  name="email"
                  type="email"
                  value={companyData.email || ''}
                  onChange={handleCompanyInputChange}
                  placeholder="company@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="companyPhone">Telepon</Label>
                <Input
                  id="companyPhone"
                  name="phone"
                  value={companyData.phone || ''}
                  onChange={handleCompanyInputChange}
                  placeholder="+62 xxx-xxxx-xxxx"
                />
              </div>
              
              <div>
                <Label htmlFor="companyWebsite">Website</Label>
                <Input
                  id="companyWebsite"
                  name="website"
                  value={companyData.website || ''}
                  onChange={handleCompanyInputChange}
                  placeholder="https://www.company.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="companyAddress">Alamat</Label>
              <Textarea
                id="companyAddress"
                name="address"
                value={companyData.address || ''}
                onChange={handleCompanyInputChange}
                placeholder="Masukkan alamat lengkap perusahaan"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="companyDescription">Deskripsi Perusahaan</Label>
              <Textarea
                id="companyDescription"
                name="description"
                value={companyData.description || ''}
                onChange={handleCompanyInputChange}
                placeholder="Deskripsi singkat tentang perusahaan"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyLogo">URL Logo</Label>
                <Input
                  id="companyLogo"
                  name="logo"
                  value={companyData.logo || ''}
                  onChange={handleCompanyInputChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div>
                <Label htmlFor="companySignature">URL Tanda Tangan</Label>
                <Input
                  id="companySignature"
                  name="signature"
                  value={companyData.signature || ''}
                  onChange={handleCompanyInputChange}
                  placeholder="https://example.com/signature.png"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={saveCompanySettings}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
              <Button 
                onClick={() => setIsEditingCompany(false)}
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Nama Perusahaan</Label>
                <p className="text-lg font-semibold">{companyData.name || 'Belum diatur'}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p>{companyData.email || 'Belum diatur'}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Telepon</Label>
                <p>{companyData.phone || 'Belum diatur'}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Website</Label>
                <p>{companyData.website || 'Belum diatur'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Alamat</Label>
                <p className="whitespace-pre-line">{companyData.address || 'Belum diatur'}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Deskripsi</Label>
                <p className="whitespace-pre-line">{companyData.description || 'Belum diatur'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Pengaturan Invoice</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="invoiceCounter">Nomor Invoice Berikutnya</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="invoiceCounter"
                type="number"
                value={tempInvoiceCounter}
                onChange={(e) => setTempInvoiceCounter(parseInt(e.target.value) || 1)}
                className="w-32"
                min="1"
              />
              <Button 
                onClick={handleUpdateInvoiceCounter}
                variant="outline"
                disabled={tempInvoiceCounter === invoiceCounter}
              >
                Update
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Invoice berikutnya akan bernomor: INV-{String(tempInvoiceCounter).padStart(4, '0')}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Format Nomor Invoice</h4>
            <p className="text-sm text-gray-600">
              Format: INV-YYYY (contoh: INV-0001, INV-0002, dst.)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Nomor akan otomatis bertambah setiap kali invoice baru dibuat.
            </p>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Informasi Bisnis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {companyData.totalInvoices || 0}
            </div>
            <div className="text-sm text-gray-600">Total Invoice</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {companyData.totalProducts || 0}
            </div>
            <div className="text-sm text-gray-600">Total Produk</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {companyData.totalCustomers || 0}
            </div>
            <div className="text-sm text-gray-600">Total Pelanggan</div>
          </div>
        </div>
      </div>

      {/* Assets Preview */}
      {(companyData.logo || companyData.signature) && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Preview Asset</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyData.logo && (
              <div>
                <Label className="text-sm font-medium text-gray-500 mb-2 block">Logo Perusahaan</Label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img 
                    src={companyData.logo} 
                    alt="Company Logo"
                    className="max-h-24 mx-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                  <div className="text-center text-gray-400 text-sm hidden">
                    Gagal memuat logo
                  </div>
                </div>
              </div>
            )}
            
            {companyData.signature && (
              <div>
                <Label className="text-sm font-medium text-gray-500 mb-2 block">Tanda Tangan</Label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img 
                    src={companyData.signature} 
                    alt="Signature"
                    className="max-h-24 mx-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                  <div className="text-center text-gray-400 text-sm hidden">
                    Gagal memuat tanda tangan
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
