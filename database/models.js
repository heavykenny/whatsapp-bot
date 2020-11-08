const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    number: {type: String, required: true},
    course: {type: String, required: false},
    university: {type: String, required: false},
    university_asked: {type: String, required: false},
    course_asked: {type: String, required: false},

  },
  {collection: 'users'}
)
mongoose.model('User', UserSchema);