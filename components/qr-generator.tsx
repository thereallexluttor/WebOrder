"use client"

import { useState } from "react"
import { QrCode, Download, Copy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateQRUrl, RESTAURANT_TABLES, type TableId } from "@/lib/table-auth"

export function QRGenerator() {
  const [selectedTable, setSelectedTable] = useState<TableId | "">("")
  const [generatedUrl, setGeneratedUrl] = useState<string>("")

  const handleGenerateQR = (tableId: TableId) => {
    const url = generateQRUrl(tableId, window.location.origin)
    setGeneratedUrl(url)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl)
      alert("URL copiada al portapapeles")
    } catch (err) {
      console.error("Error al copiar:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <QrCode className="w-16 h-16 mx-auto mb-4 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Generador de Códigos QR - Bella Vista
          </h1>
          <p className="text-gray-600">
            Genera códigos QR para cada mesa del restaurante
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generar QR para Mesa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Select value={selectedTable} onValueChange={(value) => setSelectedTable(value as TableId)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecciona una mesa" />
                </SelectTrigger>
                <SelectContent>
                  {RESTAURANT_TABLES.map((table) => (
                    <SelectItem key={table} value={table}>
                      {table}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={() => selectedTable && handleGenerateQR(selectedTable)}
                disabled={!selectedTable}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Generar QR
              </Button>
            </div>

            {generatedUrl && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">URL Generada para {selectedTable}:</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={generatedUrl} 
                    readOnly 
                    className="flex-1 p-2 border rounded text-sm"
                  />
                  <Button onClick={copyToClipboard} size="sm" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="bg-white p-4 rounded-lg inline-block border">
                    <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                        <p className="text-xs text-gray-500">
                          Código QR para {selectedTable}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          (Use un generador de QR externo con la URL de arriba)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generar Todos los QR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RESTAURANT_TABLES.map((table) => {
                const url = generateQRUrl(table, window.location.origin)
                return (
                  <div key={table} className="bg-gray-50 rounded-lg p-4 text-center">
                    <h3 className="font-semibold mb-2">{table}</h3>
                    <div className="w-32 h-32 bg-white rounded border mx-auto mb-2 flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="text-xs text-gray-400 mt-1">QR {table}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 break-all">{url}</p>
                    <Button 
                      onClick={() => navigator.clipboard.writeText(url)}
                      size="sm" 
                      variant="outline" 
                      className="mt-2 w-full"
                    >
                      Copiar URL
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">📋 Instrucciones para el Personal:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Copia las URLs generadas arriba</li>
            <li>2. Usa un generador de códigos QR online (ej: qr-code-generator.com)</li>
            <li>3. Pega cada URL para generar el código QR correspondiente</li>
            <li>4. Imprime los códigos QR y colócalos en cada mesa</li>
            <li>5. Los códigos QR funcionarán automáticamente sin necesidad de cambiarlos</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 