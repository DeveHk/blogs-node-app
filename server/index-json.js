const express = require('express')
const uid = require('uniqid')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = express()
const fs = require('fs')

//-----Middleware
app.use(express.urlencoded({ extended: true }))
//return the user authorizing the token
const authenticateTocken = (req, res, nex) => {
    const authHeader = req.headers['authorisation']
    const tocken = authHeader && authHeader.split(' ')[1]
    if (tocken == null) return res.status(401).sned()

    jwt.verify(tocken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send(err)
        req.user = user
        nex()
    })
}

app.listen('3000', () => {
    console.log('server initiated json')
})

//------Functions
const checkUser = (us=null) => {
    let index = fs.readFileSync('./blogs/index.json')
    index = JSON.parse(index)
    let user=us
    us && ( user = index.find(u => u.user == us))
    return { index, user }
}
const userBlogList = (user) => {
    let index = fs.readFileSync("./blogs/index.json")
    index = JSON.parse(index)

    const usr = index.find(u => u.user == user)
    if (usr) {
        blogs = []
        let file = ''

        for (j of usr.blogs) {
            try {
                file = fs.readFileSync(`./blogs/${usr.user}/${j}.json`)
                blogs.push(JSON.parse(file))
            }
            catch { continue }
        }
        console.log(blogs)//*
        return blogs

    }
    else return usr
}

const indexUser = (req, res) => {
    const { user } = req.params
    const blogs = userBlogList(user)

    if (blogs) {
        res.status(201).send(blogs)

    }
    else res.status(400).send("no user found")
}
const indexUserId = (req, res) => {
    const { user, id } = req.params
    const blogs = userBlogList(user)

    if (blogs) {
        const blog = blogs.find(b => b.id == id)
        if (blog)
            res.status(201).send(blog)
        else res.status(400).send("no blog found")
    }
    else res.status(400).send("no user found")
}

const indexAll = (req, res) => {
    let index = fs.readFileSync("./blogs/index.json")
    index = JSON.parse(index)

    blogs = []
    let file = ''
    for (i of index) {
        for (j of i.blogs) {
            try {
                file = fs.readFileSync(`./blogs/${i.user}/${j}.json`)
                blogs.push(JSON.parse(file))
            }
            catch { continue }
        }
    }
    res.send(blogs)
}


const create = (req, res) => {
    let { user, index } = checkUser(req.user.user)

    const { title, body, author } = req.body
    if (title && body) {
        const blog = {
            id: uid(),
            user: req.user.user,
            meta: {
                author: author || req.user.user,
                likes: '0'
            },
            blog: {
                title,
                content: body
            }
        }
        fs.writeFileSync(`./blogs/${req.user.user}/${blog.id}.json`, JSON.stringify(blog, null, 2), 'utf8')


        //append to index
        user.blogs.push(blog.id)
        fs.writeFileSync("./blogs/index.json", JSON.stringify(index, null, 2), 'utf8')

        //send response
        res.send({ sucess: "blog added", uid: blog.id })
    }
    else res.status(400).send({ error: "insufficint params" })
}

const update = (req, res) => {
    const { id } = req.params

    const { title, body, author } = req.body
    fs.readFile(`./blogs/${req.user.user}/${id}.json`, 'utf8', (error, data) => {
        if (error) {
            res.status(400).send({ err: "no blog found !!!!" })
        }
        else {
            let blog = JSON.parse(data);
            author && (blog.meta.author = author)
            title && (blog.blog.title = title)
            body && (blog.blog.content = body)

            fs.writeFileSync(`./blogs/${req.user.user}/${id}.json`, JSON.stringify(blog, null, 2), 'utf8')
            res.status(200).send({ ...blog, status: "updated succesfuly" })
        }
    }
    )

}




const delet = (req, res) => {
    const { id } = req.params
    const {index,user}= checkUser(req.user.user)
    fs.unlink(`./blogs/${req.user.user}/${id}.json`, (err) => {
        if (err)
            res.status(400).send({err: "no such blog" })
        else {
            //remove from index
            user.blogs.splice(user.blogs.indexOf(id), 1)
            fs.writeFileSync("./blogs/index.json", JSON.stringify(index, null, 2), 'utf8')
            res.status(200).send({ message: "succesfuly deleted the blog" })
        }
    })
}



//------Routes
/*INDEX*/
app.get('/blog/:user/:id', indexUserId)
app.get('/blog/:user', indexUser)
app.get('/blog', indexAll)

/*CREATE POST*/
app.post('/blog', authenticateTocken, create)

/*UPDATE*/
app.patch('/blog/:id', authenticateTocken, update)

/*DELETE*/
app.delete('/blog/:id',authenticateTocken, delet)


//DEFAULT
app.use('/', (req, res) => {
    res.redirect('/blog')
})