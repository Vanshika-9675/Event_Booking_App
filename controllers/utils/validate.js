const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

exports.validateEmail =(email)=>{
    return emailRegex.test(email);
}

exports.validatePassword = (password)=>{
    return passwordRegex.test(password);
}
