var express = require('express')
// this is the express app
var app = express();
app.use(express.static(__dirname));

// this middleware is used to parse the body
var body_parser = require('body-parser')
app.use(body_parser.json());

//configuring json web token
var jwt = require('jsonwebtoken');

// this is for cor request
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

var http = require('http').Server(app);

var io = require('socket.io')(http);

var users = [];
var connections = [];

clients = {};

io.on('connection', (socket)=> {

  connections.push(socket);
  console.log('a user connected through web socket and total connections: %s ', connections.length);

  socket.on('disconnect', (data) => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('a user disconnected through web socket and total connections: %s ', connections.length);

    // for(var name in clients) {
  	// 	if(clients[name].socket === socket.id) {
  	// 		delete clients[name];
  	// 		break;
  	// 	}
    // }

  });

  socket.on('message', function(data){
    clients[data.username] = {
      "socket": socket.id
    };

    console.log(clients);
  });

  socket.on('login', async (data, callback) => {
    var user = await findUser(data.email, (res) => callback(sendAuthErrorWebSocket()));
    if(!user) {
      callback(sendAuthErrorWebSocket());
      return;
    }

    if( user.password == data.password) {
      console.log(connections);
      // socket.name = user.email;
      // connections.push(socket);
      callback(sendTokenWebSocket(user));
      makeUserOnline(user);
    }
    else
    callback(sendAuthErrorWebSocket());
  });

  socket.on('logout', async (data, callback) => {
    connections.splice(connections.indexOf(socket), 1);
    makeUserOffline(data);
  });

});

var mongoose = require('mongoose');

// un comment this to connect to mlab online chat db
// var dbUrl = 'mongodb://user_a:welcome@ds219000.mlab.com:19000/chat_app_db'

// this is local mongodb
var dbUrl = 'mongodb://user_a:welcome@bita-lpt24:27017/chatApplication'

mongoose.connect(dbUrl, err => {
  console.log('mongo db connection successful')
})


var User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  email: String,
  password: String
})

var Message = mongoose.model('Message', {
  to: String,
  from: String,
  name: String,
  message: String
})

var server = http.listen(3000, () => {
  console.log('server is listening to port no '+ server.address().port)
});


const messages = [{
  "name": "Tim",
  "message": "Hello world"
}];

//managing route with Router

var api = express.Router();
var auth = express.Router();

api.get('/messages/:from/:to', async(req, res)=> {

  var from = req.params['from']
  var to = req.params['to']

// var messages = await Message.$where('(this.from=== from || this.to=== from) && (this.from === to || this.to === to)'
  var messages = await Message.$where(`(this.from=== "${from}" || this.to=== "${from}") && (this.from === "${to}" || this.to === "${to}")`).exec();
  res.send(messages);
} )


api.post('/messages', (req, res) => {

  var message = new Message(req.body);

  message.save((err, savedMessage)=> {
    if (err) {
      res.sendStatus(500);
    }
    // connections.forEach(socket => {

      // if(socket.name === message.to || socket.name === message.from) {
        // socket.emit('message', message);
      // }
    // })

    if (clients[message.from]){
      io.sockets.connected[clients[message.from].socket].emit("message", message);
    }
    if (clients[message.to]){
      io.sockets.connected[clients[message.to].socket].emit("message", message);
    }

    res.send(savedMessage);

  })
})


api.get('/onlineUsers', (req, res) => {
  res.send(users);
})

api.get('/test', (req, res) => {
  res.send('test');
})

auth.post('/register', async(req, res) => {

  var user = new User(req.body);

  await user.save((err, product)=> {
    if (err) {
      res.sendStatus(500);
    }
    user = product;
  });

  makeUserOnline(user);
  sendToken(user, res);

  //   TODO: in prod env, secret is not hard - coded

})


auth.get('/users/me', checkAuthenticated, (req, res) => {
  res.json(req.user);
})

app.use('/api', api);
app.use('/auth', auth);


function sendToken(user, res) {
  var token = jwt.sign(user.email, '123');
  res.json({firstName: user.firstName, token: token});
}

function sendTokenWebSocket(user) {
  var token = jwt.sign(user.email, '123');

  return {success: true, firstName: user.firstName, token: token, email: user.email};
}

function sendAuthError(res) {
  return res.json({success: false, message: 'email or password not valid'})
}

function sendAuthErrorWebSocket() {
  return {success: false, message: 'email or password not valid'};
}


function checkAuthenticated(req, res, next) {

  if (!req.header('authorization'))
    return res.status(401).send({message: 'Unauthorized requested. Missing authentication header'})

  var token = req.header('authorization').split(' ')[1];

  var payload = jwt.decode(token, '123');

  if(!payload)
  return res.status(401).send({message: 'Unauthorized requested. Authentication header is invalid'})

  req.user = findUser(payload, (res) => sendAuthError(res));

  next();
}

async function findUser(email, errorFunction) {

  var user;
  await User.findOne({email: email}, (err, foundUser) => {
    if (err) {
      errorFunction()
    }
    user = foundUser

  });

  return user;
}

function makeUserOnline(user) {
  var foundUser = users.find(dbUser => dbUser.id === user.id);
  if (foundUser === undefined) {
    users.push(user);
    io.emit('newOnlineUser', user);
  }

}
function makeUserOffline(data) {
  const user = users.find(user => user.email === data.email);

  if(user) {
    const index = users.indexOf(user, 0);
    if (index > -1) {
      users.splice(index, 1);
    }
  }

  io.emit('newOfflineUser', user);
}
