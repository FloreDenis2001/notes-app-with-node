const app = require('./app/app');

const User = require('./database/models/User');
// const Order = require('./database/models/Order');

// User.hasMany(Order, {foreignKey: 'userId'});

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000);