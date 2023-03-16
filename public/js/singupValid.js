const username = document.getElementById('username')
const email = document.getElementById('email')
const pass = document.getElementById('pw1')
const pass2 = document.getElementById('pw2')
const form = document.getElementById('form')

const err = document.getElementById('err')


// =======================SUBMIT BUTTON
form.addEventListener('submit',(e) => {
let usernameError = true
let passwordError = true
let confirmPasswordError = true
let emailError = true

let mess = []

// =======================USERNAME
// error if username is not valid 3 characters
if(username.value === '' || username.value == null || username.value.lenght < 3){
    usernameError = false
    mess.push('Username is required')
}
if(username.value === '' || username.value == null || username.value.lenght < 3){
    usernameError = false
    mess.push('Username is required')
}
// =======================EMAIL
// error if email is invalid
if(email.value === '' || email.value == null){
    emailError = false
    mess.push('Email is required')
}
if(email.value === '' || email.value == null){
    let reg = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
    if (!reg.test(emailValue)) {
        emailError = false
        mess.push('Email is invalid')
    }
      
}
// =======================PW1
// error if password is invalid if less than 10
if(pass.value.lenght <=8){
    passwordError = false
    mess.push('Password must be longer than 7 characters')
}
// error if password is invalid if bigger than 20
if(pass.value.lenght >20){
    passwordError = false
    mess.push('Password must be smaller than 20 characters')
}
if(pass.search(/[A-Z]/i) < 0 ){
    passwordError = false
    mess.push('Password need contain Capital letter')
}

if(pass.search(/[a-z]/i) < 0){
    passwordError = false
    mess.push('Password need contain lower case letter')
}
if(pass.search(/[#^&*$%!@]/) <0){
    passwordError = false
    mess.push('Password need contain special character')
}

if(pass.search(/[0-9]/) <0){
    passwordError = false
    mess.push('Password need contain number')
}

// =======================PW2
// error if password does not match
if(pass2.value != pass.value){
    confirmPasswordError = false
    mess.push('Password does not match')
}


if(mess.length>0){
e.preventDefault()
err.innerText = mess.join(',')
}

// Submit button
$("#submit").click(function () {
    if (
      usernameError == true &&
      passwordError == true &&
      confirmPasswordError == true &&
      emailError == true
    ) {
      return true;
    } else {
      return false;
    }
  });
})
