const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()
const post = require('../models/post')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(cors())

mongoose.connect('mongodb://39.105.81.51:27017/posts')
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", function(callback){
    console.log("connection Succeeded")
})

app.get('/posts', (req, res) => {
    post.find({},'title description', function (err, posts){
        if(err){ console.log(err)}
        res.send({
            posts:posts
        })
    }).sort({_id:-1})
})

app.post('/posts', (req,res,next) => {
    let db = req.db;
    let title = req.body.title;
    let description = req.body.description;
    let new_post = new post({
        title: title,
        description: description
    })

    new_post.save(function(err){
        if(err){
            console.log(err)
        }
        res.send({
            success: true,
            message: 'Post saved successfully!'
        })
    })
})

app.get('/post/:id', (req, res) => {
    var db = req.db;
    post.findById(req.params.id, 'title description', function(err, post){
        if(err){console.error(err)}
        res.send(post)
    })
})

app.put('/post/:id', function(req, res){
    var db = req.db;
    post.findById(req.params.id, 'title description', function(err, post){
        if(err){console.error(err)}

        post.title = req.body.title
        post.description = req.body.description
        post.save(function(err){
            if(err){
                console.log(err)
            }
            res.send({
                success: true
            })
        })
    })
})

app.delete('/posts/:id', function(req, res){
    var db = req.db;
    post.remove({
        _id:req.params.id
    }, function(err, post){
        if(err){
            res.send(err)
        }
        res.send({
            success: true
        })
    })
})
app.listen(process.env.PORT || 8081)
