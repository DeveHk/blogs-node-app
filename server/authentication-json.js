const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const fs = require('fs')

//-----Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.listen(5001)

//------Functions
const checkUser=(us)=>{
    let index= fs.readFileSync('./blogs/index.json')
    index=JSON.parse(index)
    const user = index.find(u => u.user == us)
    return {index,user}
}
const authenticate_create = async (req, res) => {

    let {index,user}=checkUser(req.body.user)
    if (user)
        res.status(400).send("user already exists")
    else {
        //authenticate user first
        try {
            const hashedPass = await bcrypt.hash(req.body.password, 10)
            const user = { user: req.body.user, password: hashedPass, blogs:[] }
            fs.mkdirSync(`./blogs/${user.user}`)
            index.push(user)
            fs.writeFileSync("./blogs/index.json",JSON.stringify(index, null , 2),'utf8')
            res.status(201).send()
        }
        catch(err) {
            console.log(err)//*
            res.status(500).send()
        }
    }
}

const authenticate_login = async (req, res) => {
    //check if user exists
    let {user}=checkUser(req.body.user)

    if (user) {
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                //jwt session token(athorization)
                const acTkn=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
                res.status(201).json({accessTocken:acTkn})
            }
            else
                res.status(400).send("wrong password")
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }

    }
    else
        res.status(400).send("no user")
}

const user = (req, res) => {
    res.json(users)
}

//------Routes

/*Create new account, adds it to list of user*/
app.post('/signup', authenticate_create)

/*authenticates user account, matching from user list*/
app.post('/login', authenticate_login)

/*list of all users with their passwords*/
app.get('/user', user)

////////////////////////////////////////////////////////////////DUMMY
/*const post=[{
    user:'user',
    title:'trinity',
    body:'brandided'
},
{
    user:'admin',
    title:'trinidsdsdty',
    body:'brandidfdfsdaded'
}
]
app.get('/post',authenticateTocken,(req,res)=>{
    console.log(req.user)
    res.json(post.filter(post=>post.user==req.user.name))
})*/