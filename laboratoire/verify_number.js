
const regex = /^\+\d{1,3}\s?\d{6,}$/;
const verify_number = phone => regex.test(phone);

export default verify_number;
