const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/library');
mongoose.connect('mongodb+srv://userone:userone@ictakfiles.zmywv.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    fname : String,
    lname : String,
    email : String,
    phno : String,
    username : String,
    paswd : String
});

var UserData = mongoose.model('userdata' , UserSchema);

module.exports = UserData;