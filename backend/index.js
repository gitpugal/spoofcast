var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');


//models
let User = require('./models/userModel');
let Music = require('./models/musicModel');
// const User = require('./models/userModel');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://pugalarasan:pugalarasan@cluster1.gtxc1qt.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser: true});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("Connected to database successfully!");
})

app.post("/login", (req, res) => {
    const Users = new User({
        uid: req.body.uid,
        favorites: req.body.favorites || [],
        following: req.body.following || [],
    })

    Users.save()
        .then(() => res.json('Exercise added!'))
        .catch(err => res.status(400).json('Error: '+err));
})


app.get("/", (req, res) => {
    User.find()
        .then(notes => res.json(notes))
        .catch(err => res.status(400).json('Error: '+err))
})


app.get("/:id", (req, res) => {
    User.findOne({uid: req.params.id})
        .then(notes => res.json(notes))
        .catch(err => res.status(400).json('Error: '+err))
})


 app.put("/:id", async (req, res) => {
    const userr = await User.findOne({uid: req.params.id})
    // .then(res.json("cannot fetch user"))
    // .catch(err => console.log(err))
        
    userr.favorites.push(req.body.mid);
    console.log(userr.favorites, req.body.mid)
    userr.save()
        .then(resu => res.json(resu))
        .catch(err => res.json(err))
})

app.put("/deleteFav/:id", async (req, res) => {
    const userr = await User.findOne({uid: req.params.id})
        
    userr.favorites = userr.favorites.filter((music) => music != req.body.mid)
    console.log(userr.favorites, req.body.mid)
    userr.save()
        .then(resu => res.json(resu))
        .catch(err => res.json(err))
    // setTimeout(()=> {
    //     User.findOne({uid: req.params.id})
    //                 .then(resu => res.json(resu))
    //                 .catch(err => res.json(err))
    // }, 6000)
    
})
// favorites.filter(music => music == req.body.mid)
app.post("/admin/music", (req, res) => {
    const Musics = new Music({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        speaker: req.body.speaker,
        file: req.body.file,
        uid: req.body.uid,
        mid: req.body.mid
    })

    Musics.save()
        .then(resu => res.json(resu))
        .catch(err => console.log(err))
})


app.get("/admin/musics/:id", (req, res) => {
    Music.find({uid: req.params.id})
        .then(result => res.json(result))
        .catch(err => res.json(err))
})


app.get("/admin/musics/search/:name", (req, res) => {
   Music.find({ name : {'$regex': req.params.name,$options:'i'}})
        .then(result => res.json(result))
        .catch(err => res.json(err))
})

app.get("/admin/musics/", (req, res) => {
    Music.find()
        .then(result => res.json(result))
        .catch(err => res.json(err))
})
app.delete("/admin/musics/:id", (req, res) => {
    Music.findOneAndDelete({mid: req.params.id})
        .then(result => res.json(result))
        .catch(err => res.json(err))
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`)
})