const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const connectDb = require("./db/db");
const userRoutes = require('./routers/userRouters');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

// ✅ Connect to Database
connectDb();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users', userRoutes);

// ✅ Start Server AFTER Defining Routes
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
