export class Formatter {
  static formatDate (value: Date): string {
    const date = new Date(value)

    return Intl.DateTimeFormat('es-ES', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    }).format(date)
  }

  // Método para convertir a formato ISO 8601 para los metatags
  static formatDateToISO(value: Date): string {
    const date = new Date(value);
    
    return date.toISOString(); // Ejemplo: "2024-11-04T10:30:00.000Z"
  }
}

