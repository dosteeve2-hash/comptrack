'use client'

import { useCallback, useState } from 'react'
import type { Facture } from '@/lib/data'

interface FacturePDFProps {
  facture: Facture
  entrepriseNom?: string
}

const TVA_RATE = 0.18

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtNum(n: number) {
  return Math.round(n).toLocaleString('fr-FR')
}

export function FacturePDF({ facture, entrepriseNom = 'Mon Entreprise' }: FacturePDFProps) {
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handlePDF = useCallback(async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    const W = 210
    const margin = 15
    let y = 0

    // ── Header band Navy ──
    doc.setFillColor(7, 14, 31)
    doc.rect(0, 0, W, 40, 'F')

    // CT badge
    doc.setFillColor(34, 217, 138)
    doc.roundedRect(margin, 9, 20, 8, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(7, 14, 31)
    doc.text('CT', margin + 10, 14, { align: 'center' })

    // App name + enterprise
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(245, 240, 232)
    doc.text('CompTrack', margin + 24, 14)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(155, 168, 196)
    doc.text(entrepriseNom, margin + 24, 20)

    // FACTURE title + numero
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(240, 168, 50)
    doc.text('FACTURE', W - margin, 15, { align: 'right' })
    doc.setFontSize(9)
    doc.setTextColor(245, 240, 232)
    doc.text(facture.numero, W - margin, 22, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(155, 168, 196)
    doc.text(`Émise le ${fmtDate(facture.dateCreation)}`, W - margin, 28, { align: 'right' })
    doc.text(`Échéance ${fmtDate(facture.dateEcheance)}`, W - margin, 33, { align: 'right' })

    y = 52

    // ── Client block ──
    doc.setFillColor(240, 242, 250)
    doc.roundedRect(margin, y, W - 2 * margin, 16, 2, 2, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(100, 120, 155)
    doc.text('FACTURÉ À', margin + 5, y + 6)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(20, 30, 60)
    doc.text(facture.client, margin + 5, y + 13)

    y += 24

    // ── Table header ──
    doc.setFillColor(7, 14, 31)
    doc.rect(margin, y, W - 2 * margin, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(245, 240, 232)
    doc.text('DESCRIPTION', margin + 4, y + 5.5)
    doc.text('QTÉ', 128, y + 5.5, { align: 'right' })
    doc.text('P.U. HT', 148, y + 5.5, { align: 'right' })
    doc.text('TVA 18%', 166, y + 5.5, { align: 'right' })
    doc.text('TOTAL TTC', W - margin - 2, y + 5.5, { align: 'right' })

    y += 10
    let totalHT = 0

    facture.articles.forEach((art, idx) => {
      const tva = art.total * TVA_RATE
      const ttc = art.total * (1 + TVA_RATE)
      totalHT += art.total

      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 253)
        doc.rect(margin, y - 1, W - 2 * margin, 9, 'F')
      }

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(25, 35, 60)
      doc.text(art.description, margin + 4, y + 5)
      doc.text(String(art.quantite), 128, y + 5, { align: 'right' })
      doc.text(fmtNum(art.prixUnitaire), 148, y + 5, { align: 'right' })
      doc.text(fmtNum(tva), 166, y + 5, { align: 'right' })
      doc.setFont('helvetica', 'bold')
      doc.text(fmtNum(ttc), W - margin - 2, y + 5, { align: 'right' })
      y += 9
    })

    y += 4
    doc.setDrawColor(210, 220, 235)
    doc.line(margin, y, W - margin, y)
    y += 6

    // ── Totaux ──
    const tX = 125
    const totalTVA = totalHT * TVA_RATE
    const totalTTC = totalHT * (1 + TVA_RATE)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 120, 155)
    doc.text('Sous-total HT :', tX, y)
    doc.setTextColor(25, 35, 60)
    doc.text(fmtNum(totalHT) + ' FCFA', W - margin, y, { align: 'right' })
    y += 7

    doc.setTextColor(100, 120, 155)
    doc.text('TVA (18%) :', tX, y)
    doc.setTextColor(25, 35, 60)
    doc.text(fmtNum(totalTVA) + ' FCFA', W - margin, y, { align: 'right' })
    y += 4

    doc.setDrawColor(210, 220, 235)
    doc.line(tX, y + 1, W - margin, y + 1)
    y += 6

    // TTC row
    doc.setFillColor(7, 14, 31)
    doc.roundedRect(tX - 2, y - 1, W - margin - tX + 4, 9, 1, 1, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(245, 240, 232)
    doc.text('TOTAL TTC :', tX + 2, y + 5.5)
    doc.setTextColor(240, 168, 50)
    doc.text(fmtNum(totalTTC) + ' FCFA', W - margin - 2, y + 5.5, { align: 'right' })

    y += 20

    // ── Footer conditions ──
    doc.setFillColor(240, 242, 250)
    doc.rect(margin, y, W - 2 * margin, 22, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(100, 120, 155)
    doc.text('CONDITIONS DE PAIEMENT', margin + 5, y + 6)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(40, 55, 80)
    doc.text('Paiement : virement bancaire, Orange Money, Moov Money, Wave', margin + 5, y + 12)
    doc.text("Pénalités de retard : 1 % par semaine après échéance", margin + 5, y + 18)

    // Credit
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(180, 185, 200)
    doc.text(`Généré par CompTrack · ${new Date().toLocaleDateString('fr-FR')}`, W / 2, 290, { align: 'center' })

    doc.save(`${facture.numero}.pdf`)
  }, [facture, entrepriseNom])

  return (
    <>
      <button
        onClick={handlePDF}
        className="p-1.5 rounded-lg transition-all hover:opacity-80 flex items-center"
        style={{
          color: 'var(--gold)', border: '1px solid rgba(240,168,50,0.25)',
          background: 'rgba(240,168,50,0.08)', fontSize: '14px', lineHeight: 1,
        }}
        title="Télécharger PDF"
      >
        📄
      </button>
      <button
        onClick={() => showToast('Email envoyé ✓')}
        className="p-1.5 rounded-lg transition-all hover:opacity-80 flex items-center"
        style={{ color: 'var(--cyan)', fontSize: '14px', lineHeight: 1 }}
        title="Envoyer par email"
      >
        ✉️
      </button>
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl animate-slide-up"
          style={{ background: 'var(--cyan)', color: '#000', whiteSpace: 'nowrap' }}
        >
          {toast}
        </div>
      )}
    </>
  )
}
