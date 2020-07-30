function generatePassword(){
    var length = currentUser.settings.passwordLength;
    var password = "";
    var picker = 0;
    while(password.length < length){
        picker = Math.floor(Math.random() * 3) + 1

        if (picker == 1 && currentUser.settings.letters){
            password = password + String.fromCharCode(Math.floor(Math.random() * (122- 65)) + 65);
        }

        if (picker == 2 && currentUser.settings.specialCharacters){
            password = password + String.fromCharCode(Math.floor(Math.random() * (47 - 33)) + 33);
        }

        if (picker == 3 && currentUser.settings.numbers){
            password = password + String.fromCharCode(Math.floor(Math.random() * (57 - 48)) + 48);
        }
    }

    document.getElementById("password").setAttribute("value", password);
}