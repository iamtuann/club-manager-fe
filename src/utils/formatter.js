export function formatDate(date) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }
  if (date != null) {
    return date.toLocaleDateString('vi-VI', options);
  } else 
    return "";
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-US').format(price)
}