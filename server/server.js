const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Message = require('./models/message');
const User = require('./models/user');
const Conversation = require('./models/conversation')
const socket = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const PORT = 8080;

// Assign the value of your mongoDB connection string to this constant
const dbConnectString = 'mongodb+srv://admin:adMiN12.33@cluster0-zme9p.mongodb.net/test?retryWrites=true&w=majority';

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

// GET list of conversation users
app.get('/api/conversations/users', authMiddleware, (req, res) => {
    Conversation.find(
        { partisipants: req.user.id },
        { partisipants: 1, _id: 0 }
    ).then(conv => {
        const users = conv.map(el => {
            el.partisipants.splice( el.partisipants.indexOf(req.user.id), 1 );
            return el.partisipants[0];
        })
        return users;
    }).then(users => {
        User.find(
            { _id: { $nin: [...users, req.user.id] } },
            { email: 0, password: 0, register_date: 0 }).then(user => {
            res.send(user).status(200)
        }).catch(err => {
            console.log(err)
            res.send(err).status(500)
        });
    });
})

// GET list of conversations    
app.get('/api/conversations', authMiddleware, (req, res) => {
    Conversation.find({partisipants: req.user.id}).then(conversations => {
        if (conversations.length > 0) {
            conversations.forEach(el => {
                el.partisipants.splice( el.partisipants.indexOf(req.user.id), 1 );
                return el.partisipants[0];
            })
            // conversations.aggregate([{
            //     $lookup: {
            //             from: "users",
            //             localField: conversations.partisipants[0],
            //             foreignField: "_id",
            //             as: "user_data"
            //         }
            // }])
            console.log(conversations);
            res.send(conversations).status(200);
        } else {
            res.status(200).json({msg: 'No active conversations.'});
        }
    }).catch(err => {
        console.log(err)
        res.send(err).status(500)
    })
})

// Create a new conversation
app.post('/api/conversations', authMiddleware, (req, res) => {
    const partisipants = [req.body.id, req.user.id]
    Conversation.create({partisipants}).then(conversation => {
        res.send(conversation).status(200);
    }).catch(err => {
        console.log(err)
        res.send(err).status(500)
    })
})

// DELETE conversation
app.delete('/api/conversations/:id', authMiddleware, (req, res) => {
    Conversation.findById(req.params.id)
    .then(conversation => conversation.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
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

// DELETE message
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

    socket.on('add-conversation', data => {
        io.sockets.emit('add-conversation', data)
    })

    socket.on('delete-conversation', data => {
        io.sockets.emit('delete-conversation', data)
    })
});