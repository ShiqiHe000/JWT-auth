if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


app.use(express.json());

const posts = [
    {
        username: "Mary", 
        title: "post 1"
    }, 
    {
        username: "Jack", 
        title: "post 2"
    }
];

app.get('/', (req, res) => {
    res.send('home page');
})

app.post('/posts', authenticateToken, (req, res) => {

    res.json(posts.filter(post => req.user.name === post.username));
})


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(401).send('Unauthorized');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send('Forbidden');
        req.user = user;
        next();
    })

}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listens on port ${PORT}`);
})