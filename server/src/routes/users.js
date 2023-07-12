const express = require('express');

const router = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

//jwt secret
const jwtSecret = process.env.JWT_SECRET;


const User = require('../models/Users');



router.post('/register', async (req, res) => {
    try {
        let {username, email, password} = req.body;
        console.log(req.body);
        

        // validate

        if (!username || !email || !password)
            return res.status(400).json({msg: "Not all fields have been entered."});
        if (password.length < 6)
            return res.status(400).json({msg: "The password needs to be at least 6 characters long."});

        const existingUser = await User.findOne({email: email});
        if (existingUser)
            return res.status(400).json({msg: "An account with this email already exists."});

        //Create user
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });
        const savedUser = await newUser.save();
        res.json(savedUser);

    } catch (err) {
        res.status(500).json({error: err.message});
    }
    
});

router.post('/login', async(req, res) => {
    try{
        const {email, password} = req.body;

        // validate
        if (!email || !password)
        return res.status(400).json({'msg:': 'Not all fields have been entered.'});

        const existinUser = await User.findOne({email: email});
        if (!existinUser)
        return res.status(400).json({'msg:': 'No account with this email has been registered.'});

        const isMatch = await bcrypt.compare(password, existinUser.password);

        if (!isMatch)
        return res.status(400).json({'msg:': 'Invalid credentials.'});

        const token = jwt.sign({id: existinUser._id}, jwtSecret);

        res.json({
            token,
            existinUser: {
                id: existinUser._id,
                username: existinUser.username,
                email: existinUser.email,
            },
        });

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});














module.exports = router;
