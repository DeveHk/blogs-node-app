const express = require('express')
const uid = require('uniqid')
const path = require('path')
const app = express()
const fs = require('fs')

app.use(express.urlencoded({ extended: true }))// middleware


app.listen('3000', () => {
    console.log('server initiated json')
})

const index = (req, res) => {
    const { id } = req.params
        const blog = fs.readFile(`./blogs/b${id}.json`, 'utf8', (error, data) => {
            if (error) {

                res.send({ status: "unsuccesful", err: "no blog found" })
            }
            else
            res.send(JSON.parse(data));

        }
        )
    
}

const indexAll=(req, res) => {
    let ind=fs.readFileSync("./blogs/index.json")
    ind=JSON.parse(ind)
    blogs=[]
    let file=''
        for(i of ind)
        {
            try{
            file=fs.readFileSync(`./blogs/b${i}.json`)
            blogs.push(JSON.parse(file))
            }
            catch{continue}
        }
    res.send(blogs)
}


const create = (req, res) => {
    console.log(req.body)
    const { title, body, author } = req.body
    if (title && body) {
        const blog={
            id: uid(),
            meta: {
                author: author || 'unknown',
                likes: '0'
            },
            blog: {
                title,
                content: body
            }
        }
        fs.writeFileSync(`./blogs/b${blog.id}.json`,JSON.stringify(blog, null , 2),'utf8')

        //append to index
        let ind=fs.readFileSync("./blogs/index.json")
        ind=JSON.parse(ind)
        ind.push(blog.id)
        fs.writeFileSync("./blogs/index.json",JSON.stringify(ind, null , 2),'utf8')

        //send response
        res.send({ sucess: "blog added", uid: blog.id })
    }
    else res.send({ error: "insufficint params" })
}

const update = (req, res) => {
    const { id } = req.params
    const { title, body, author } = req.body
    fs.readFile(`./blogs/b${id}.json`, 'utf8', (error, data) => {
        if (error) {

            res.send({ status: "unsuccesful", err: "no blog found !!!!" })
        }
        else{
        let blog=JSON.parse(data);
        author && (blog.meta.author = author)
        title && (blog.blog.title = title)
        body && (blog.blog.content = body)
        fs.writeFileSync(`./blogs/b${id}.json`,JSON.stringify(blog, null , 2),'utf8')
        res.send({ ...blog, status: "updated succesfuly" })
        }
    }
    )
}

const delet = (req, res) => {
    const { id } = req.params
    fs.unlink(`./blogs/b${id}.json`,(err)=>{
        if(err)
        res.send({status:"unsuccesful",err:"no such file"})
        else{
        //remove from index
        let ind=fs.readFileSync("./blogs/index.json")
        ind=JSON.parse(ind)
        ind.splice(ind.indexOf(id),1)
        console.log(ind)
        fs.writeFileSync("./blogs/index.json",JSON.stringify(ind, null , 2),'utf8')
        res.send({status:"succesful"})
        }
    })
}




//INDEX
app.get('/blog/:id', index)
app.get('/blog', indexAll)
//CREATE POST
app.post('/blog', create)

//UPDATE
app.patch('/blog/:id', update)

//DELETE
app.delete('/blog/:id', delet)




//DEFAULT
app.use('/', (req, res) => {
    res.redirect('/blog')
})