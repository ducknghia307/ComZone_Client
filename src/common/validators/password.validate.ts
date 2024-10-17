export default function validatePassword(password: string) {
  return (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    password.length > 5 &&
    password.length < 21
  );
}

//A valid password must:
// + Contain 6-20 characters
// + Contain at least an UPPERCASE character
// + Contain at least a DIGIT character
