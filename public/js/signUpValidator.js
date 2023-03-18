// function that takes one input and validate if password contain all vaild lettersa
$(document).ready(function () {
  form.addEventListener('submit',(e) => {

    // Validate Username
    $("#usercheck").hide();
    let userNameErr = true;
    $("#username").keyup(function () {
      validateUsername();
    });
    
   // function that take value of username and 
   // if empty string "" return false
    function validateUsername() {
      let usernameValue = $("#username").val();
      if (usernameValue.length == "") {
        $("#usercheck").show();
        userNameErr = false;
        return false;
    // else if lenght of username is less then 3 or more then 11 returm false
      } else if (usernameValue.length < 3 || usernameValue.length > 11) {
        $("#usercheck").show();
        $("#usercheck").html("**length of username must be between 3 and 11");
        userNameErr = false;
        return false;
    // else hide passchcek
      } else {
        $("#usercheck").hide();
      }
    }


    // Validate Password
    $("#passcheck").hide();
    let passError = true;
    $("#pw1").keyup(function () {
      validatePassword();
    });

    function validatePassword() {
      let passValue = $("#pw1").val();
      if (passValue.length == "") {
        $("#passcheck").show();
        passError = false;
        return false;
      }
      if (passValue.length < 8 || passValue.length > 17) {
        $("#passcheck").show();
        $("#passcheck").html(
          "**length of your password must be between 8 and 17"
        );
        $("#passcheck").css("color", "red");
        passError = false;
        return false;
      }

      if(pass.search(/[a-z]/i) < 0){
        $("#passcheck").show();
        $("#passcheck").html(
          "**your password must contain lower case letter"
        );
        $("#passcheck").css("color", "red");
        passError = false;
        return false;
      }

      if(pass.search(/[A-Z]/i) < 0 ){
        $("#passcheck").show();
        $("#passcheck").html(
          "**your password must contain Capital letter"
        );
        $("#passcheck").css("color", "red");
        passError = false;
        return false;
      }

      if(pass.search(/[0-9]/) <0){
        $("#passcheck").show();
        $("#passcheck").html(
          "**your password must contain at least one number from 0-9"
        );
        $("#passcheck").css("color", "red");
        passError = false;
        return false;
      }

      if(pass.search(/[#^&*$%!@]/) <0){
        $("#passcheck").show();
        $("#passcheck").html(
          "**your password must contain special symbol"
        );
        $("#passcheck").css("color", "red");
        passError = false;
        return false;
      }
      if(pass.lenght > 0){
        alert(pass.join("\n"));
        passError = false;
        return false;

      }else {
        $("#passcheck").hide();
      }
    }

   
    // Validate Confirm Password
    $("#passcheck2").hide();
    let confirmPasswordError = true;
    $("#pw2").keyup(function () {
      validateConfirmPassword();
    });
    function validateConfirmPassword() {
      let confirmPassValue = $("#pw2").val();
      let passValue = $("#password").val();
      if (passValue != confirmPassValue) {
        $("#passcheck2").show();
        $("#passcheck2").html("**Password didn't Match");
        $("#passcheck2").css("color", "red");
        confirmPassError = false;
        return false;
      } else {
        $("#passcheck2").hide();
      }
    }


    // Email validation part
  const email = document.getElementById("email");
  email.addEventListener("blur", () => {
    let reg = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
    let emailValue = email.value;
    if (reg.test(emailValue)) {
      email.classList.remove("is-invalid");
      emailErr = true;
    } else {
      email.classList.add("is-invalid");
      emailErr = false;
    }
  });
   
    // Submit button
    $("#submitbtn").click(function () {
      validateUsername();
      validatePassword();
      validateConfirmPassword();
      validateEmail();
      if (
        usernameError == true &&
        passwordError == true &&
        confirmPasswordError == true &&
        emailError == true
      ) {
        return true;
      } else {
        e.preventDefault();
        return false;
      }
    });
  });


})
    


  
