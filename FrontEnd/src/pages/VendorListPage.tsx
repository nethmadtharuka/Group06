import { useEffect, useState } from 'react'
import axios from 'axios'
import { LoaderIcon } from 'lucide-react'

export const VendorListPage = () => {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchVendors = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:8080/api/vendors')
      setVendors(res.data || [])
    } catch (err) {
      setError('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Registered Vendors</h2>
      <div className="mb-4">
        <button onClick={fetchVendors} className="px-3 py-1 bg-indigo-600 text-white rounded-md">Refresh</button>
      </div>
      {loading ? (
        <div className="flex items-center text-gray-600">
          <LoaderIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500" />
          Loading vendors...
        </div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : vendors.length === 0 ? (
        <div className="text-gray-600">No vendors registered yet.</div>
      ) : (
        <div className="grid gap-3">
          {vendors.map((v) => (
            <div key={v.id || v.userId} className="p-3 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">{v.companyName}</div>
                  <div className="text-sm text-gray-600">{v.serviceType} — {v.address}</div>
                </div>
                <div className="text-sm text-gray-500">User: {v.userId}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
