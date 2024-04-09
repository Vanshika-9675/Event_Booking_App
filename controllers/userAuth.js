const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validateEmail ,validatePassword} = require('../utils/validate');

require('dotenv').config();

//api for customer registeration
exports.userRegister = async(req,res)=>{
    try {
        const {userName , email ,password} = req.body;

        if(!(userName && email && password)){
           return res.status(400).json({
                success:false,
                message:"Some fields are missing",    
          })
        }

        //validating email through regex
        if (!validateEmail(email)) {
            console.log('Email is invalid');
           return res.status(400).json({
                success:false,
                message:"Email is invalid!"
            })
         }    
         
         //validating password through regex
         if (!validatePassword(password)) {
            console.log('Choose a strong password');
           return res.status(400).json({
                success:false,
                message:"Enter a strong password of atleast 8 charachters long with an uppercase , lowercase , digit and a scpecial charachter"
            })
         }   
   
         //checking if user already exists
        const existingUser = await User.findOne({email});
   
        if(existingUser){
           return res.status(401).json({
               success:false,
               message:"USer already exist with this email",
          })
        }
   
        //secure password
        let hashedPassword;
        try{
          //10 is number of rounds 
          hashedPassword= await bcrypt.hash(password,10);
        }
        catch(err){
          return res.status(500).json({
              sucess:false,
              message:'Error in hashing password'
          })
        }
   
       //create entry for user
       const user = await User.create({
           userName,email,password:hashedPassword
       })
       
       const payload = {
           id:user._id
       }
   
       const token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn:"2d"
          }
       )
   
       user.token = token;
       user.password = undefined;

       //sending token in user cookie 
       const options = {
        expires :new Date(Date.now()+ 3*24*60*60*1000),
        httpOnly: true
       }

       return res.status(200).cookie("token",token,options).json({
           data:user,
           success:true,
           message:'User created successfully'
       })
        
    } catch (error) {
         console.log(error);
         res.status(500).json({
            success:false,
            message:"Internal Server error"
         })
    }

}

//api to authenticate customer
exports.userLogin = async(req,res)=>{
   try {
     const {email,password} =  req.body;

     if(!(email && password)){
        return res.status(400).json({
           success:false,
           message:"Fill all the fields"
        })
     }
     const user = await User.findOne({email});

     if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
     }

     if(user && (await bcrypt.compare(password , user.password))){
        const payload = {
            id:user._id
      }
        const token = jwt.sign(payload ,process.env.JWT_SECRET , {expiresIn:'2d'});

        user.token = token;
        user.password = undefined

        //sending token in user cookie 
         const options = {
            expires :new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly: true
         }

         res.status(200).cookie("token",token,options).json(
            {
                success:true,
                message:"logged in successfully",
                token
            }
         )

     }
     else{
       return res.status(402).json({
         success:false,
         message:"Unauthorized access!!"
       })
     }
    
   } catch (error) {
        console.log(error);
       return res.status(500).json({
        success:false,
        message:"Internal Server error"
        })
   }
}   

//api for editing customer's profile 
exports.editProfile = async (req, res) => {
   try {
       const { userName, email, password } = req.body;
       const userId = req.user.id; 
       
       // Check if the user exists
       const user = await User.findById(userId);
       if (!user) {
           return res.status(404).json({
               success: false,
               message: "User not found"
           });
       }

        //validating email through regex
        if (email && !validateEmail(email)) {
           return res.status(400).json({
                success:false,
                message:"Email is invalid!"
            })
         }    
         
         //validating password through regex
         if (password && !validatePassword(password)) {
           return res.status(400).json({
                success:false,
                message:"Enter a strong password of atleast 8 charachters long with an uppercase , lowercase , digit and a scpecial charachter"
            })
         }  

       if (userName) user.userName = userName;
       if (email) user.email = email;
       if (password) user.password = await bcrypt.hash(password, 10);

       await user.save();

       return res.status(200).json({                                
           success: true,
           message: "Profile updated successfully",
           data: user
            });

   } catch (error) {
       console.error(error);
       return res.status(500).json({
           success: false,
           message: "Internal Server error"
       });
   }
};