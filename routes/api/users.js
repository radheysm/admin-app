const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

// @routes    POST api/users
// @desc      registration User
// @access    Public

router.post('/',[
   check('name',"Name is required").not().isEmpty(),
   check('email',"Please enter a valid email address").isEmail(),
   check('password',"Please Enter a password with 6 or more character").isLength({min:6})
], async (req,res)=> {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {name, email, password} = req.body;
        try {
            let user = await User.findOne({email});
            if(user){
                return res.status(500).json({errors:[{msg:"User Already exists"}]});
            }
           
            user = new User({
                name,
                email,
                password
            });
            // Encrypt Password
            
            const salt = await bcrypt.genSalt(10);
            console.log(salt);
            user.password = await bcrypt.hash(password, salt);
            
            await user.save();
            
            const payload = {
                user:{
                    id:user.id
                }
            }
            
            jwt.sign(payload, config.get('jwtToken'), {expiresIn:360000}, (err,token)=>{
             
                if(err) throw err;
                res.json({token});

            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }


});



module.exports = router;