const app = require('./app/app');

const User = require('./database/models/User');
const Notes = require('./database/models/Notes');
const NoteShare = require('./database/models/Enrollment');
const Enrollment = require('./database/models/Enrollment');

Notes.belongsToMany(User, { through: Enrollment, foreignKey: 'noteId', as: 'ErollNoteUsers' });
User.belongsToMany(Notes, { through: Enrollment, foreignKey: 'userId', as: 'EnrollNotes' });

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000);