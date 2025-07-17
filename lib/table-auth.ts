// Tabla authentication utilities

// Restaurant tables configuration
export const RESTAURANT_TABLES = [
  "MESA-001", "MESA-002", "MESA-003", "MESA-004", "MESA-005",
  "MESA-006", "MESA-007", "MESA-008", "MESA-009", "MESA-010",
  "MESA-011", "MESA-012", "MESA-013", "MESA-014", "MESA-015",
  "MESA-016", "MESA-017", "MESA-018", "MESA-019", "MESA-020"
] as const

export type TableId = typeof RESTAURANT_TABLES[number]

// Validate if table exists
export function isValidTable(tableId: string): tableId is TableId {
  return RESTAURANT_TABLES.includes(tableId as TableId)
}

// Validate table access - simplified for permanent QR codes
export function validateTableAccess(tableId: string): {
  isValid: boolean
  error?: string
  tableId?: TableId
} {
  // Check if table ID is valid
  if (!isValidTable(tableId)) {
    return {
      isValid: false,
      error: "Mesa no válida"
    }
  }

  // For QR access, just validate the table exists
  return {
    isValid: true,
    tableId: tableId
  }
}

// Generate QR URL for a table (permanent QR codes)
export function generateQRUrl(tableId: TableId, baseUrl: string = "http://192.168.80.82:3000"): string {
  // QR codes only contain table ID - no date needed!
  return `${baseUrl}?table=${tableId}`
}

// Parse URL parameters from QR scan
export function parseQRParams(searchParams: URLSearchParams): {
  tableId?: string
} {
  return {
    tableId: searchParams.get('table') || undefined
  }
} 