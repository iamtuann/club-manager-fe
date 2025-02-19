export function isRequired(name) {
  return (v) => !isEmptyValue(v) || `${name} không được để trống`;
}

export function isEmptyValue(value) {
  if (typeof value === 'object') {
    for (const prop in value) {
      if (Object.hasOwn(value, prop)) {
        return false;
      }
    }
    return true;
  } else {
    return !value;
  }
}

export function isEmail(v) {
  const emailRegex = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/;
  return emailRegex.test(v) || "Email không đúng định dạng";
}

export function isPhoneNumber(v) {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(v) || "Số điện thoại không hợp lệ";
}