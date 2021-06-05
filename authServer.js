if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


app.use(express.json());

let refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token; 
    if(refreshToken == null) res.status(401).send('No refresh Token');
    if(!refreshTokens.includes(refreshToken)) return res.status(403).send('Refresh token invalid');
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send('Forbiddened');
        const accessToken = generateAccessToken({name: user.name});
        res.json({accessToken});
    });
})

app.post('/posts', (req, res) => {

    res.json(posts.filter(post => req.user.name === post.username));
})

app.post('/login', (req, res) => {
    // authenticate user

    const username = req.body.username;
    const user = {
        name: username
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({accessToken, refreshToken})
})

app.delete('/logout', (req, res) => {
    console.log(req.body.token);
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.status(204).send('Logout');
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listens on port ${PORT}`);
})