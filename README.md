# Blog API
### _This is a RESTful API to Use as Backend for a Blog Website_
##### For CRUD operations
This API uses file system for storage, ready to deploy, created with expressJs.
Authentication generated JWT token which will be used for authorization

## Features
- Authorization will be needed for Create Update Delete opration only
- Read is free for all
- Tocken is not scheduled to expire
- Two different servers, one for auth and another for CRUD will run


### Routes for the API are:
| Methos   |      Route      |  Description |
|----------|:-------------:|------:|
| auth: |  | |
| POST |   /signup  |   new account |
| POST | /login |    generate auth tocken |
| Crud: | |
|GET| /blog/:user/:id|    blog by user and id |
|  | /blog/:user |    blogs by user |
|  | /blog |   All blogs  |
| POST | /blog |    Create new blog |
| PATCH | /blog/:id |    Update blog |
| DELETE | /blog:id |    Delete blog |
> All requestes must have `authorisation : Bearer 'token' ` to get authorized
