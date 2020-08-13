'use strict';
const Hapi = require('@hapi/hapi')
const jwt = require('jsonwebtoken')


const secret = "foo"
const person = {
    login: 'test',
    password: 12345
}
const init = async () =>{

const server = Hapi.server({port:5000, host:'localhost'})

server.route({
    method:'GET',
    path: '/',
    handler: (request, h) => {
        console.log(h)
        return 'Hello World!';
    }
    
})
server.route({
    method: 'POST',
    path:'/login',
    handler:(req, h)=>{
        const {login, password} = req.payload
      
        if(login === person.login && password === person.password){
            const token = jwt.sign({
                login,password
            },secret)
            return {message: 'ok', token};
        }else{
            return {message: 'user not found or don`t correct'};
        }
            
        

    }
})



await server.start();
console.log('Server running on %s', server.info.uri);
}
init()