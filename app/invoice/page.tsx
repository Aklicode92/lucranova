'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchInvoices = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fel vid hämtning av fakturor:', error)
        setError('Kunde inte hämta fakturor')
      } else {
        setInvoices(data || [])
      }
    }
    fetchInvoices()
  }, [router])

  const markAsPaid = async (invoiceId: number) => {
    const paymentDate = prompt('Ange inbetalningsdatum (ÅÅÅÅ-MM-DD):')
    if (!paymentDate) return
    const { error } = await supabase
      .from('invoices')
      .update({ is_paid: true, payment_date: paymentDate })
      .eq('id', invoiceId)
    if (error) alert('Kunde inte markera som betald.')
    else location.reload()
  }

  const handleDownloadPDF = (invoice: any) => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text('FAKTURA', 105, 20, { align: 'center' })

    // Avsändare (vänster sida)
    doc.setFontSize(10)
    doc.text(invoice.sender_company_name || '', 20, 30)
    doc.text(invoice.sender_address || '', 20, 35)
    doc.text(invoice.sender_zip_city || '', 20, 40)
    doc.text(invoice.sender_country || '', 20, 45)
    doc.text(`Tel: ${invoice.sender_phone || ''}`, 20, 50)
    doc.text(`E-post: ${invoice.sender_email || ''}`, 20, 55)

    // Mottagare (höger sida)
    const rightX = 140
    doc.setFontSize(11)
    doc.text(`Mottagare:`, rightX, 30)
    doc.setFontSize(10)
    doc.text(invoice.receiver_name || '', rightX, 35)
    doc.text(invoice.receiver_address || '', rightX, 40)
    doc.text(invoice.receiver_zip_city || '', rightX, 45)
    doc.text(invoice.receiver_orgnr ? `Org.nr: ${invoice.receiver_orgnr}` : '', rightX, 50)

    // Fakturadetaljer
    const detailY = 70
    doc.text(`Fakturanummer: ${invoice.invoice_number || ''}`, 20, detailY)
    doc.text(`Fakturadatum: ${invoice.invoice_date || ''}`, 20, detailY + 6)
    doc.text(`Förfallodatum: ${invoice.due_date || ''}`, 20, detailY + 12)

    // Fakturarader
    const rows = (invoice.description || '').split(', ').map((desc: string) => [desc, invoice.type, `${invoice.amount} kr`, `${invoice.moms}%`])

    autoTable(doc, {
      startY: detailY + 25,
      head: [['Beskrivning', 'Typ', 'Belopp (kr)', 'Moms %']],
      body: rows,
      styles: { fontSize: 10, textColor: [0, 0, 0] },
      headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
      margin: { left: 20, right: 20 },
    })

    const momsBelopp = (parseFloat(invoice.amount) * parseFloat(invoice.moms)) / 100
    const total = parseFloat(invoice.amount) + momsBelopp
    const endY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(11)
    doc.text(`Att betala: ${total.toFixed(2)} kr`, 20, endY)
    doc.setFontSize(10)
    doc.text(`Bankgiro: ${invoice.sender_bankgiro || ''}`, 20, endY + 6)
    doc.text(`E-post: ${invoice.sender_email || ''}`, 20, endY + 12)
    doc.text(`OCR: ${invoice.invoice_number || ''}`, 20, endY + 18)

    doc.save(`faktura-${invoice.invoice_number || 'pdf'}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 font-sans text-neutral-800 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight mb-6">Mina fakturor</h1>
      <p className="mb-8 text-[15px] text-neutral-600">Här ser du en översikt över dina skapade fakturor. Du kan ladda ner, markera som betald eller skapa nya fakturor.</p>

      {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}

      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="min-w-full text-[15px] text-left text-neutral-800">
          <thead className="text-xs uppercase bg-gray-100 text-neutral-700">
            <tr>
              <th scope="col" className="px-6 py-3">#</th>
              <th scope="col" className="px-6 py-3">Mottagare</th>
              <th scope="col" className="px-6 py-3">Belopp</th>
              <th scope="col" className="px-6 py-3">Beskrivning</th>
              <th scope="col" className="px-6 py-3">Datum</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b hover:shadow-md transition-all">
                <td className="px-6 py-4 font-medium whitespace-nowrap">#{invoice.invoice_number || 'Ej angivet'}</td>
                <td className="px-6 py-4">{invoice.receiver_name}</td>
                <td className="px-6 py-4">{invoice.amount} kr</td>
                <td className="px-6 py-4">{invoice.description}</td>
                <td className="px-6 py-4">{new Date(invoice.created_at).toLocaleDateString('sv-SE')}</td>
                <td className="px-6 py-4">
                  {invoice.is_paid ? (
                    <span className="text-green-600 font-semibold">Betald<br />({invoice.payment_date || ''})</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Ej betald</span>
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleDownloadPDF(invoice)}
                    className="text-sm text-white bg-[#1A264F] hover:bg-[#2B3B6C] font-medium rounded-xl px-5 py-2 shadow transition"
                  >
                    Ladda ner PDF
                  </button>
                  {!invoice.is_paid && (
                    <button
                      onClick={() => markAsPaid(invoice.id)}
                      className="text-sm text-white bg-green-600 hover:bg-green-500 font-medium rounded-xl px-5 py-2 shadow transition"
                    >
                      Markera som betald
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
