const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/UserRoutes');
const userRoutes = require('./routes/UserRoutes');
const cors = require('cors');

// Express app
const app = express();

// Middleware
app.use(express.json());

// Allow CORS for all routes
app.use(cors());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Default route
app.get('/', (req, res) => {
    res.json("Hello");
});

// Connect to MongoDB database
mongoose.connect("mongodb+srv://yazeed:5707538E@cluster0.11nyslj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    app.listen(4000, ()=>{
        console.log("Server listening on port 4000")
    })
})
.catch((error) => {
    console.error('Database connection error:', error.message);
});

