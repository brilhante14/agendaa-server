const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const rotasAtividades = require("./routes/atividades");
const rotasUsuarios = require("./routes/usuarios");
const rotasTurmas = require("./routes/turmas");
const rotasMateriais = require('./routes/materiais');

const app = express();
dotenv.config();

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

app.use("/atividades", rotasAtividades);
app.use("/materiais", rotasMateriais);
app.use("/usuarios", rotasUsuarios);
app.use("/turmas", rotasTurmas);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL_MONGO)
   .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
   .catch((error) => console.log(error.message));
