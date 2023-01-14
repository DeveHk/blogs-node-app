const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//--------Data
const users = []

//-----Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.listen(5001)

//------Functions
const authenticate_create = async (req, res) => {
    const user = users.find(user=>user.name==req.body.user)
    if(user)
    res.status(400).send("user already exists")
    else{
    //authenticate user first
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.user, password: hashedPass }
        users.push(user)
        res.status(201).send()
    }
    catch{
        res.status(500).send()
    }}
}

const authenticate_login=async(req,res)=>{
    const user = users.find(user=>user.name==req.body.user)
    if(user){
        try{
            if(await bcrypt.compare(req.body.password, user.password))
            res.status(201).send("loggedin")
            else
            res.status(400).send("wrong password")
        }catch(e){
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


