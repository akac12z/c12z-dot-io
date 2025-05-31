export const isValidDateFormat = (dateString: string): boolean => {
  const dateFormatMustBe = /^\d{2}-\d{2}-\d{4}$/; // Expresión regular para DD-MM-YYYY

  if (!dateFormatMustBe.test(dateString))
    throw new Error("The date must be in the format DD-MM-YYYY!");

  const [day, month, year] = dateString.split("-").map(Number);

  // Asegurarse de que la fecha sea válida
  const date = new Date(year, month - 1, day); // Month está basado en 0, por eso restamos 1 al mes

  if (
    date.getFullYear() !== year || // Comprobamos si el año es correcto
    date.getMonth() !== month - 1 || // Comprobamos si el mes es correcto
    date.getDate() !== day // Comprobamos si el día es correcto
  ) {
    throw new Error(
      "The date is invalid, make sure you have spelled the date correctly. Remember, it must be DD-MM-YYYY and be real!"
    );
  }

  return true;
};

// Función para convertir la fecha en ISO para las metatags
export const convertDateToISO8601 = (dateString: string): string => {
  isValidDateFormat(dateString); // Validamos la fecha en formato DD-MM-YYYY

  const [day, month, year] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Month está basado en 0, por eso restamos 1 al mes
  return date.toISOString();
};
