const express = require('express');
const router = express.Router();
const request = require('request');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const multer= require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname);
    },
    filename:function(req, file, cb){
        const now = new Date().toISOString(); 
        const date = now.replace(/:/g, '-'); 
        cb(null, date + file.originalname);
    }
});

const fileFilter = (req, file, cb) =>{
      if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
          cb(null,true);
      }
      else{
          cb(null, false);
      }
};

const upload = multer({
    storage:storage, 
    limits:{
    fileSize:1024 * 1024 * 5 
     },
     fileFilter:fileFilter
});

// @routes    GET api/proifle/me
// @desc      GET current user's profile
// @access    Private

router.get('/me',auth, async (req, res)=> {
    try{
        const profile = await Profile.findOne({user:req.user.id}).populate('user',
        ['user']);
     
        if(!profile){
            
            return res.status(400).json({msg:"There is no profile for this user"});
        }

        res.send(profile);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});




// @route     POST api/profile
// @desc      Create or Update User's profile
// @access    Private

router.post('/', [
    auth, 
    upload.single('profileImage')
], async (req,res) =>{
    console.log(req.file.path);
    const{address, phone, about, profileImage} = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if(address) profileFields.address = address;
    if(phone) profileFields.phone = phone;
    if(about) profileFields.about = about;
    if(profileImage) profileFields.profileImage = profileImage;

    try {
        let profile = await Profile.findOne({user:req.user.id});
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            );
            return res.json(profile);
        }
        // Create 
        profileFields.profileImage = req.file.path;
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route     GET api/profile
// @desc      GET all profile
// @access    Public

router.get('/', async (req, res)=>{
    try {
        const profile = await Profile.find().populate('user',['name']);
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});




module.exports = router;