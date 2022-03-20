export default function validate(errors, name, value){
    switch (name){
        case 'email':
          let emailError = 
              value.indexOf('@') === -1 ? 'Email does not contain @' : ''; // value contains @ or not
              errors.email = emailError;
              break;
        case 'username':
          let usernameError;
           if(value.length < 4){
            usernameError = "username can't be less then 4 character" 
          }
              errors.username = usernameError;
              break;
        case 'password':
          let passwordError;
              
              if(value.length < 5){
                passwordError = "Password can't be less then 6 character" 
              }
              let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/;
              if(!re.test(value)){
                passwordError = "Password contain character and number"
              }
  
              errors.password = passwordError;
              break;
            default:
              return errors;
      }

}