var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'))

// DB schema
var navifeedSchema = mongoose.Schema({
  // name:{type:String, required:true, unique:true},
  content:{type: String, required: true, unique: true},
  // email:{type:String},
  // phone:{type:String}
});
var Navifeed = mongoose.model('navifeed', navifeedSchema);

// Routes
// Home
app.get('/', function(req, res){
  res.redirect('/navifeeds');
});
// Navifeeds - Index
app.get('/navifeeds/', function(req, res){
  Navifeed.find({}, function(err, navifeeds){
    if(err) return res.json(err);
    res.render('navifeeds/index', {navifeeds:navifeeds});
  });
});
// Navifeeds - New
app.get('/navifeeds/new', function(req, res){
  res.render('navifeeds/new');
});
// Navifeeds - create
app.post('/navifeeds', function(req, res){
  Navifeed.create(req.body, function(err, navifeed){
    if(err) return res.json(err);
    res.redirect('/navifeeds');
  });
});
// Navifeeds - show
app.get('/navifeeds/:id', function(req, res){
  Navifeed.findOne({_id:req.params.id}, function(err, navifeed){
    if(err) return res.json(err);
    res.render('navifeeds/show', {navifeed:navifeed});
  });
});
// Navifeeds - edit
app.get('/navifeeds/:id/edit', function(req, res){
  Navifeed.findOne({_id:req.params.id}, function(err, navifeed){
    if(err) return res.json(err);
    res.render('navifeeds/edit', {navifeed:navifeed});
  });
});
// Navifeeds - update
app.put('/navifeeds/:id', function(req, res){
  Navifeed.findOneAndUpdate({_id:req.params.id}, req.body, function(err, navifeed){
    if(err) return res.json(err);
    res.redirect('/navifeeds/'+req.params.id);
  });
});
// Navifeeds - destroy
app.delete('/navifeeds/:id', function(req, res){
  Navifeed.deleteOne({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/navifeeds');
  });
});

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
