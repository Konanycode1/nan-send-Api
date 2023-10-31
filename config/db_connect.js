import mongoose from "mongoose";



// mongoose.connect(`mongodb+srv://nfcdjobo:nfcdjobo@testnansender.ztm8pnu.mongodb.net/?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect(`mongodb+srv://Diom:Diom@nansend.9snu0wv.mongodb.net/?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("Base de données connectée !"))
.catch(error=>console.log("connexion à la base de données réfusée !", error.message));

export default mongoose;


