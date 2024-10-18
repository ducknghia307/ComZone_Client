export default function validateConfirmPassword(
  password: string,
  confirm: string
) {
  return String(password).match(String(confirm));
}
