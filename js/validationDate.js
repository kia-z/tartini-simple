// validate date format
function isValidDate(input) {
    const fullDateRegex = /^\d{2}-\d{2}-\d{4}$/; // DD-MM-YYYY
    const yearMonthRegex = /^\d{2}-\d{4}$/; // MM-YYYY
    const yearOnlyRegex = /^\d{4}$/; // YYYY
  
    if (fullDateRegex.test(input)) {
        const [day, month, year] = input.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    } else if (yearMonthRegex.test(input)) {
        const [month, year] = input.split("-").map(Number);
        return month >= 1 && month <= 12 && year > 0;
    } else if (yearOnlyRegex.test(input)) {
        const year = Number(input);
        return year > 0;
    }
  
    return false; // Invalid format
  }
  