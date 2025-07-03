// Middleware
app.use(express.json()); // to parse JSON request bodies
app.use('/api/user', require('./Routes/user'));
app.use('/api/notes', require('./Routes/notes'));
