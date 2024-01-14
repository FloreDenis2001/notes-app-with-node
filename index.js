const app = require('./app/app');

const User = require('./database/models/User');
const Notes = require('./database/models/Notes');

User.hasMany(Notes, {foreignKey: 'userId'});

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000);