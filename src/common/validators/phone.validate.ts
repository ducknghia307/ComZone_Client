export default function validatePhoneNumber(phone: string) {
  return String(phone).match(/\d/g) && phone.length > 9 && phone.length < 12;
}

//Valid formats: 0999 999 999 || 0999 999 9999
//Invalid format: +84 222 333 4444
