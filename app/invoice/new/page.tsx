'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CreateInvoicePage() {
  const router = useRouter()
  const [receiverName, setReceiverName] = useState('')
  const [receiverOrgNr, setReceiverOrgNr] = useState('')
  const [receiverAddress, setReceiverAddress] = useState('')
  const [receiverZipCity, setReceiverZipCity] = useState('')
  const [lines, setLines] = useState([{ description: '', quantity: 1, unit: '', price: '', discount: '', moms: '25', type: 'tjanst' }])
  const [freeText, setFreeText] = useState('')
  const [error, setError] = useState('')
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [subtotal, setSubtotal] = useState(0)
  const [totalWithVAT, setTotalWithVAT] = useState(0)
  const [paymentTerms, setPaymentTerms] = useState('30')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    const fetchUserAndCustomers = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)

      if (!error && data) {
        setCustomers(data)
      }
    }
    fetchUserAndCustomers()
  }, [router])

  useEffect(() => {
    const subtotal = lines.reduce((sum, line) => {
      const price = parseFloat(String(line.price) || '0')
      const quantity = parseFloat(String(line.quantity || '0'))
      const discount = parseFloat(String(line.discount) || '0')
      return sum + (price * quantity * (1 - discount / 100))
    }, 0)
    const vatRate = parseFloat(String(lines[0]?.moms || '0'))
    const total = subtotal + (subtotal * vatRate / 100)
    setSubtotal(subtotal)
    setTotalWithVAT(total)
  }, [lines])
  

  useEffect(() => {
    if (!invoiceDate || isNaN(parseInt(paymentTerms))) {
      setDueDate('')
      return
    }
    const date = new Date(invoiceDate)
    if (!isNaN(date.getTime())) {
      date.setDate(date.getDate() + parseInt(paymentTerms))
      setDueDate(date.toISOString().split('T')[0])
    } else {
      setDueDate('')
    }
  }, [invoiceDate, paymentTerms])
    

  const handleAddLine = () => {
    setLines([...lines, { description: '', quantity: 1, unit: '', price: '', discount: '', moms: '25', type: 'tjanst' }])
  }

  const handleRemoveLine = (index: number) => {
    const newLines = lines.filter((_, i) => i !== index)
    setLines(newLines)
  }

  const handleLineChange = (index: number, field: string, value: string) => {
    const newLines = [...lines]
    newLines[index][field] = value
    setLines(newLines)
  }

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId)
    const customer = customers.find(c => c.id === parseInt(customerId))
    if (customer) {
      setReceiverName(customer.name)
      setReceiverOrgNr(customer.orgnr)
      setReceiverAddress(customer.address)
      setReceiverZipCity(customer.zip_city)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Du måste vara inloggad för att skapa en faktura.')
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      setError('Kunde inte hämta din profilinformation.')
      return
    }

    const { data: latestInvoice } = await supabase
      .from('invoices')
      .select('invoice_number')
      .order('invoice_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    const nextInvoiceNumber = latestInvoice?.invoice_number
      ? latestInvoice.invoice_number + 1
      : 101

    const invoicePayload: any = {
      user_id: user.id,
      invoice_number: nextInvoiceNumber,
      receiver_name: receiverName,
      receiver_orgnr: receiverOrgNr,
      receiver_address: receiverAddress,
      receiver_zip_city: receiverZipCity,
      description: lines.map((l) => l.description).join(', '),
      amount: subtotal,
      moms: parseFloat(lines[0].moms),
      type: lines[0].type,
      sender_company_name: profile.company_name || '',
      sender_address: profile.address || '',
      sender_zip_city: profile.zip_city || '',
      sender_country: profile.country || '',
      sender_contact_name: profile.contact_name || '',
      sender_phone: profile.phone || '',
      sender_email: profile.email || '',
      sender_bankgiro: profile.bankgiro || '',
      free_text: freeText,
      invoice_date: invoiceDate,
      payment_date: dueDate,
    }

    const { error: insertError } = await supabase.from('invoices').insert([invoicePayload])

    if (insertError) {
      console.error('❌ Supabase insert error:', insertError)
      setError('Kunde inte skapa faktura.')
    } else {
      router.push('/invoice')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-10">
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#1A264F] mb-6">Skapa ny faktura</h1>
        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Välj kund</label>
            <select value={selectedCustomerId} onChange={(e) => handleCustomerChange(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2">
              <option value="">-- Välj kund --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} placeholder="Mottagarens namn" className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="text" value={receiverOrgNr} onChange={(e) => setReceiverOrgNr(e.target.value)} placeholder="Organisationsnummer" className="w-full border border-gray-300 rounded px-4 py-2" required />
            <input type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} placeholder="Adress" className="w-full border border-gray-300 rounded px-4 py-2 md:col-span-2" required />
            <input type="text" value={receiverZipCity} onChange={(e) => setReceiverZipCity(e.target.value)} placeholder="Postnummer och Ort" className="w-full border border-gray-300 rounded px-4 py-2 md:col-span-2" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fakturadatum</label>
              <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Betalningsvillkor (dagar)</label>
              <input type="number" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2" required />
              <p className="text-sm text-gray-600 mt-1">Förfallodatum: {dueDate}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-[#1A264F] mb-4">Fakturarader</h3>
            <div className="space-y-4">
              {lines.map((line, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
                  <input type="text" placeholder="Beskrivning" value={line.description} onChange={(e) => handleLineChange(index, 'description', e.target.value)} className="border border-gray-300 px-3 py-2 rounded w-full" required />
                  <input type="number" placeholder="Antal" value={line.quantity} onChange={(e) => handleLineChange(index, 'quantity', e.target.value)} className="border border-gray-300 px-3 py-2 rounded w-full" required />
                  <input type="text" placeholder="Enhet" value={line.unit} onChange={(e) => handleLineChange(index, 'unit', e.target.value)} className="border border-gray-300 px-3 py-2 rounded w-full" required />
                  <input type="number" placeholder="Pris" value={line.price} onChange={(e) => handleLineChange(index, 'price', e.target.value)} className="border border-gray-300 px-3 py-2 rounded w-full" required />
                  <input type="number" placeholder="Rabatt %" value={line.discount} onChange={(e) => handleLineChange(index, 'discount', e.target.value)} className="border border-gray-300 px-3 py-2 rounded w-full" />
                  <select value={line.type} onChange={(e) => handleLineChange(index, 'type', e.target.value)} className="border border-gray-300 px-3 py-2 rounded w-full">
                    <option value="0">0%</option>
                    <option value="6">6%</option>
                    <option value="12">12%</option>
                    <option value="25">25%</option>
                  </select>
                  <select value={line.type} onChange={(e) => handleLineChange(index, 'type', e.target.value)} className="border border-gray-300 px-3 py-2 rounded w-full">
                    <option value="tjanst">Tjänst</option>
                    <option value="vara">Vara</option>
                  </select>
                  <button type="button" onClick={() => handleRemoveLine(index)} className="text-red-600 hover:underline text-sm">Ta bort</button>
                </div>
              ))}
              <button type="button" onClick={handleAddLine} className="text-sm font-medium text-[#1A264F] hover:underline">+ Lägg till rad</button>
            </div>
          </div>

          <div className="mt-4 text-right text-gray-700">
            <p className="text-base">Summa exkl. moms: <strong>{subtotal.toFixed(2)} kr</strong></p>
            <p className="text-base">Totalt inkl. moms: <strong>{totalWithVAT.toFixed(2)} kr</strong></p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fritext (t.ex. betalningsvillkor eller hälsning)</label>
            <textarea value={freeText} onChange={(e) => setFreeText(e.target.value)} rows={4} className="w-full border border-gray-300 rounded px-4 py-2" placeholder="T.ex. Tack för ert förtroende. Betalning sker inom 30 dagar." />
          </div>

          <div className="pt-6">
            <button type="submit" className="bg-[#1A264F] hover:bg-[#2B3B6C] text-white px-6 py-3 rounded-lg w-full text-lg font-semibold">
              ✅ Skapa faktura
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
