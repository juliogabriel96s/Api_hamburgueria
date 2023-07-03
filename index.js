const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())

const users = []

const checkUsed = (request, response, next) =>{
    const {id} = request.params

    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({message: 'user not found'})
    }

    request.userIndex = index
    request.userId = id

    next()
}

const checkedMethodAndUrl = (request, response, next) =>{
    const url = request.url
    const method = request.method

    console.log(method, url)

    next()
}

app.post('/order', checkedMethodAndUrl, (request, response) =>{
const {order, clientName, price, status} = request.body

const user = {id: uuid.v4(), order, clientName, price, status}

users.push(user)

return response.status(201).json(users)

})

app.get('/order', checkedMethodAndUrl, (request, response) =>{
return response.json(users)
})

app.put('/order/:id', checkUsed, checkedMethodAndUrl,(request, response) =>{
  const index = request.userIndex 
  const id = request.userId
  const {order, clientName, price, status} = request.body

  const updateUser = {id, order, clientName, price, status}

  users[index] = updateUser

  return response.json(updateUser)

})

app.delete('/order/:id', checkUsed, checkedMethodAndUrl, (request, response) =>{
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json(users)
})/

app.get('/order/:id',checkUsed, checkedMethodAndUrl,(request, response) =>{
   const index = request.userIndex

   return response.json(users[index])
    })

app.patch('/order/:id',checkUsed, checkedMethodAndUrl, (request, response) =>{
    const {order, clientName, price,} = request.body
    const index = request.userIndex 
    const {id} = request.params
    const user = {id, order, clientName, price, status: 'pronto'}

    users[index] = user
    console.log(user)
  return response.json(user)
 })
    
app.listen(port, () =>{
    console.log(`server started on port ${port}`)
})