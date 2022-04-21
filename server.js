
const express = require('express')
const app = express()
const port = 3000
app.use(express.json())

//cors
var cors = require('cors')
app.use(cors())

//env
const dotenv = require('dotenv')
dotenv.config()

//mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL, () => console.log('connected to the database'))
const userSh = require('./model/model')

//bcript
const bcrypt = require('bcrypt')
let saltrounds = 10

//signup
app.post('/signup', async function (req, res) {

    const salt = bcrypt.genSaltSync(saltrounds);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newuser = new userSh({
        username: req.body.username,
        password: hash
    })
    try {
        const checkusername = await userSh.exists({username: req.body.username})
        if(!checkusername){
            const savedUser = await newuser.save()
            res.status(200).json(savedUser)
        }else{
            res.status(400).send('Please use a different username, username is already taken')
        }
    } catch (err) {
        res.send(err.message)
    }
})

//login
app.post('/login', async function (req, res) {

    const chackuser = await userSh.findOne({ username: req.body.username })

    if(!chackuser) 
    return res.status(400).send('Username is does not exists')

    const hashpassword = chackuser.password
    const compareresult = bcrypt.compareSync(req.body.password, hashpassword)

    if (!compareresult) 
    return res.status(400).send('Password is incorrect')

    res.status(200).send('Logged in successfully!')
})


//listen
app.listen(port, () => console.log('server is running'))
