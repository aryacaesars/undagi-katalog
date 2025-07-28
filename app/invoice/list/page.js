'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useInvoices } from '@/lib/use-invoice'
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  FileText,
  Calendar,
  Building2,
  User
} from 'lucide-react'

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date))
}

export default function InvoiceListPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  const { 
    invoices, 
    loading, 
    error, 
    pagination, 
    fetchInvoices 
  } = useInvoices()

  useEffect(() => {
    fetchInvoices({
      page: currentPage,
      search,
      status: statusFilter
    })
  }, [currentPage, search, statusFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchInvoices({
      page: 1,
      search,
      status: statusFilter
    })
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status === statusFilter ? '' : status)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoice Management</h1>
          <p className="text-gray-600 mt-1">Manage your invoices and track payments</p>
        </div>
        <Link href="/invoice/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by invoice number, customer, or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'].map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusFilter(status)}
                  className="capitalize"
                >
                  {status.toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p>Loading invoices...</p>
        </div>
      )}

      {/* Invoice List */}
      {!loading && (
        <>
          <div className="grid gap-4">
            {invoices.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
                  <p className="text-gray-600 mb-4">
                    {search || statusFilter 
                      ? 'No invoices match your current filters.' 
                      : 'Get started by creating your first invoice.'
                    }
                  </p>
                  <Link href="/invoice/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Invoice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              invoices.map((invoice) => (
                <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{invoice.invoiceNumber}</h3>
                          <Badge className={statusColors[invoice.status]}>
                            {invoice.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              <span>{invoice.company.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{invoice.customer.name}</span>
                              {invoice.customer.company && (
                                <span className="text-gray-400">({invoice.customer.company})</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Created: {formatDate(invoice.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {formatDate(invoice.dueDate)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {formatCurrency(invoice.total)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Link href={`/invoice/${invoice.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/invoice/${invoice.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this invoice?')) {
                              // Handle delete
                              console.log('Delete invoice', invoice.id)
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Summary */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="text-center text-sm text-gray-600">
                Showing {invoices.length} of {pagination.total} invoices
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
