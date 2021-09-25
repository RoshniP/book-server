const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/library');
mongoose.connect('mongodb+srv://userone:userone@ictakfiles.zmywv.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');

const Schema = mongoose.Schema;
const CarSchema = new Schema({
    title : String,
    author : String,
    genre : Array,
    summary : String,
    image : String
});

var CarData = mongoose.model('cardata' , CarSchema);

module.exports = CarData;