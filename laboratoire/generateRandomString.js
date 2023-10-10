
const generateRandomString = (string, long) =>{
    let randomString = "";
    for (let i = 0; i < long; i++){
        randomString += string[Math.floor(Math.random()*string.length)];
    }
    return randomString[0] !== "0" ? randomString.toUpperCase() : generateRandomString(string, long);
}
export default generateRandomString;


