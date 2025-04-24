// app/page.tsx
'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Välkommen till Enkelfaktura.se</h1>
        <p className="text-lg text-gray-700 mb-6">
          Enkelfaktura.se är den smarta och enkla webbtjänsten för dig som är företagare i Sverige och vill skicka fakturor på ett snabbt, smidigt och korrekt sätt. Perfekt för dig som säljer tjänster eller produkter.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/invoice/new"
            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded"
          >
            Skapa faktura
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2 px-6 rounded"
          >
            Logga in
          </Link>
          <Link
            href="/signup"
            className="border border-blue-500 text-blue-600 hover:border-blue-600 hover:text-blue-700 font-semibold py-2 px-6 rounded"
          >
            Skapa konto
          </Link>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          <p>
            Enkelfaktura.se förenklar din vardag genom att samla fakturering, moms och kundinformation på ett ställe. Ingen nedladdning, ingen krångel.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Så fungerar det</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left text-gray-700">
          <div>
            <h3 className="font-bold mb-2">1. Skapa konto</h3>
            <p>Registrera dig enkelt med din e-postadress och kom igång direkt utan bindningstid.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">2. Skapa faktura</h3>
            <p>Fyll i mottagare, beskrivning, belopp, moms och om det gäller en vara eller tjänst. Skicka med ett klick.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">3. Hantera allt på ett ställe</h3>
            <p>Se dina tidigare fakturor, håll koll på betalda och obetalda, och exportera till bokföring.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mt-24 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Vanliga frågor</h2>
        <div className="space-y-6 text-left text-gray-700">
          <div>
            <h3 className="font-bold">Är tjänsten gratis?</h3>
            <p>Ja, du kan skapa och skicka fakturor helt gratis. Vi kommer erbjuda fler funktioner i framtiden som du kan välja att lägga till.</p>
          </div>
          <div>
            <h3 className="font-bold">Behöver jag installera något?</h3>
            <p>Nej, allt fungerar direkt i webbläsaren – både på dator och mobil.</p>
          </div>
          <div>
            <h3 className="font-bold">Hur hanteras mina uppgifter?</h3>
            <p>Vi använder säker och krypterad teknik via Supabase och delar aldrig din data med tredje part.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mt-24 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Om oss</h2>
        <p className="text-gray-700">
          Enkelfaktura.se är skapad av företagare, för företagare. Vi förstår behovet av enkelhet och kontroll i vardagen – och har byggt en tjänst som speglar det.
        </p>
      </div>
    </main>
  )
}
