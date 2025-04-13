const express = require(`express`);
const {join} = require(`path`)


const app = express();

// All static files *.css and *.js
app.use(express.static(join(__dirname,`../client/pages`)));

// Serves 0AZer Config file
app.use(`./client/scripts/auth_config`,(req,res) =>{
  res.sendFile(join(__dirname,"auth_config.json"));
});


// Serves LoginPage.html
app.get(`/`,(_,res)=>{
  res.sendFile(join(__dirname,`./client/pages/LoginPage.html`));
});


app.listen(3000,()=>console.log(`Application running on part 3000`));