const express = require('express')
const uid = require('uniqid')
const path = require('path')
const app = express()

app.use(express.urlencoded({ extended: true }))// middleware

/*blogs = {
    12345: {
        id: '12345',
        meta: {
            author: 'harsh',
            likes: '1000',
        },
        blog: {
            title: 'On API',
            content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam, in dolorum dignissimos voluptatibus porro numquam cum labore aspernatur vel adipisci, unde dolorem ex, distinctio corporis beatae impedit. Esse libero quod ea qui blanditiis autem debitis facilis totam nesciunt quisquam modi eos quia, est dolore ullam reprehenderit facere, laudantium pariatur iure illum soluta? Eaque libero iste perspiciatis voluptate, aut odit explicabo?"
        }
    }
}*/
blogs = [
    {
        id: '12345',
        meta: {
            author: 'harsh',
            likes: '1000',
        },
        blog: {
            title: 'On API',
            content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam, in dolorum dignissimos voluptatibus porro numquam cum labore aspernatur vel adipisci, unde dolorem ex, distinctio corporis beatae impedit. Esse libero quod ea qui blanditiis autem debitis facilis totam nesciunt quisquam modi eos quia, est dolore ullam reprehenderit facere, laudantium pariatur iure illum soluta? Eaque libero iste perspiciatis voluptate, aut odit explicabo?"
        }
    }
]

app.listen('3000', () => {
    console.log('server initiated')
})

const index=(req, res) => {
    const { id } = req.params
    const blog = blogs.find(b => b.id == id)
    if (blog)
        res.send(blog)
    else
        res.send({ status: "no blog found" })
}
/*const create = async (req, res) => {
    console.log(req.body)
    const { title, body, author } = req.body
    if (title && body) {
        const uid = await new Promise(
            (res, rej) => {
                resolve(uid())
            }
        )
        blogs.push({
            id: uid,
            meta: {
                author: author || 'unknown',
                likes: '0'
            },
            blog: {
                title,
                content: body
            }
        }
        )
        res.send({ sucess: "blog added", uid })
    }
    else res.send({ error: "insufficint params" })
}*/

const create=(req, res) => {
    console.log(req.body)
    const { title, body, author } = req.body
    if (title && body) {
        blogs.push({
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
        )
        res.send({ sucess: "blog added", uid:(blogs[blogs.length-1].id) })
    }
    else res.send({ error: "insufficint params" })
}

const update=(req, res) => {
    const { id } = req.params
    const { title, body, author } = req.body
    const blog = blogs.find(b => b.id == id)
    if (blog) {
        console.log(author, body, title)
        author && (blog.meta.author = author)
        title && (blog.blog.title = title)
        body && (blog.blog.content = body)
        res.send({ ...blog, status: "updated succesfuly" })
    }

    else res.send({ status: "no blog exists" })
}
const delet= (req, res) => {
    const { id } = req.params
    const blog = blogs.find(b => b.id == id)
    if (blog) {
        blogs = blogs.filter(b => b.id != id)
        res.send({ ...blog, status: "deleted succesfuly" })
    }
    else res.send({ status: "no blog exists" })
}


//INDEX
app.get('/blog/:id', index)
app.get('/blog', (req, res) => {
    res.send(blogs)
})
//CREATE POST
app.post('/blog', create)

//UPDATE
app.patch('/blog/:id', update)

//DELETE
app.delete('/blog/:id',delet)




//DEFAULT
app.use('/', (req, res) => {
    res.redirect('/blog')
})