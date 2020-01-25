const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Message = require('./models/message');
const User = require('./models/user');
const socket = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const PORT = 8080;

// Assign the value of your mongoDB connection string to this constant
const dbConnectString = '';

// Updating mongoose's promise version
mongoose.Promise = global.Promise;

// Connecting to MongoDB through Mongoose
mongoose.connect(dbConnectString, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to the db');
}).catch((err) => {
    console.log(err);
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');

    next();
});

// Middleware to parse the request body as json
app.use(express.json());

// Register new user
app.post('/api/users', (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({msg: 'Please enter all fields.'})
    }

    User.findOne({email})
        .then(user => {
            if (user) return res.status(400).json({msg: 'User already exists.'})

            const newUser = new User({
                name,
                email,
                password
            });

            // Create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;

                    newUser.password = hash
                    newUser.save()
                        .then(user => {

                            jwt.sign(
                                { id: user.id },
                                'jwtSecret',
                                (err, token) => {
                                    if(err) throw err;

                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            name: user.name,
                                            email: user.email
                                        },
                                        status: "created"
                                    })
                                }
                            )
                        });
                })
            })
        })
});

// Auth user
app.post('/api/auth', (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({msg: 'Please enter all fields.'})
    }

    User.findOne({email})
        .then(user => {
            if (!user) return res.status(400).json({msg: "User doesn't exists."})

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({msg: 'Invalid credentials.'});

                    jwt.sign(
                        { id: user.id },
                        'jwtSecret',
                        (err, token) => {
                            if(err) throw err;

                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                },
                                status: "created"
                            })
                        }
                    )
                })
        })
});


app.get('/api/auth/user', authMiddleware, (req, res) => {
    User.findById(req.user.id)
      .select('-password')
      .then(user => res.json(user));
  });

// GET all the previous messages
app.get('/api/message', authMiddleware, (req, res) => {
    Message.find({}).exec((err, messages) => {
        if(err) {
            res.send(err).status(500);
        } else {
            res.send(messages).status(200);
        }
    });
});

// POST a new message
app.post('/api/message', authMiddleware, (req, res) => {
    Message.create(req.body).then((message) => {
        res.send(message).status(200);
    }).catch((err) => {
        console.log(err);
        res.send(err).status(500);
    });
});

// DELETE a new message
app.delete('/api/message/:id', authMiddleware, (req, res) => {
    Message.findById(req.params.id)
    .then(message => message.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

// Start the server at the specified PORT
let server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

let io = socket(server);

io.on('connection', (socket) => {
    socket.on('new-message', data => {
        io.sockets.emit('new-message', data)
    })

    socket.on('delete-message', data => {
        io.sockets.emit('delete-message', data)
    })
});