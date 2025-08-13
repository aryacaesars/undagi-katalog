'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Download, Search } from 'lucide-react'
import { useCatalogueSearch } from '../../hooks/useCatalogueSearch'
import { useEffect } from 'react'

export default function CatalogueContent({ items = [] }) {
  const { query, setQuery, suggestions, filtered } = useCatalogueSearch(items)

  // Close suggestions on escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setQuery('') }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setQuery])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h2 className="text-2xl font-semibold">Kelola Katalog Produk</h2>
        <div className="flex-1 md:max-w-md relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama / spesifikasi / jenis..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
              {query && suggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-md border bg-white shadow-lg max-h-64 overflow-auto text-sm">
                  {suggestions.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setQuery(s.namaBarang)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      <div className="font-medium">{s.namaBarang}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{s.spesifikasi}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button className="flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Tambah Produk
            </Button>
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">Jenis</th>
                  <th className="px-4 py-2 text-left">Spesifikasi</th>
                  <th className="px-4 py-2 text-right">Qty</th>
                  <th className="px-4 py-2 text-right">Harga</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map(item => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{item.namaBarang}</td>
                    <td className="px-4 py-2">{item.jenis}</td>
                    <td className="px-4 py-2 max-w-xs truncate" title={item.spesifikasi}>{item.spesifikasi}</td>
                    <td className="px-4 py-2 text-right">{item.qty}</td>
                    <td className="px-4 py-2 text-right">{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(item.hargaSatuan || 0)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-gray-500" colSpan={5}>
                      Tidak ada data cocok untuk query "{query}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
