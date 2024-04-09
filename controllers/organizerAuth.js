const Organizer = require('../models/organizer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validateEmail ,validatePassword} = require('./utils/validate');

require('dotenv').config();

//registeration
exports.organizerRegister = async(req,res)=>{
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
           return res.status(400).json({
                success:false,
                message:"Email is invalid!"
            })
         }    
         
         //validating password through regex
         if (!validatePassword(password)) {
           return res.status(400).json({
                success:false,
                message:"Enter a strong password of atleast 8 charachters long with an uppercase , lowercase , digit and a scpecial charachter"
            })
         }   
   
         //checking if organizer already exists
        const existingOrg = await Organizer.findOne({email});
   
        if(existingOrg){
           return res.status(401).json({
               success:false,
               message:"organizer already exist with this email",
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
       const user = await Organizer.create({
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
           message:'Organizer registered successfully'
       })
        
    } catch (error) {
         console.log(error);
         res.status(500).json({
            success:false,
            message:"Internal Server error"
         })
    }

}

//authentication
exports.orgaanizerLogin = async(req,res)=>{
   try {
     const {email,password} =  req.body;

     if(!(email && password)){
        return res.status(400).json({
           success:false,
           message:"Fill all the fields"
        })
     }
     const org = await Organizer.findOne({email});

     if(!org){
        return res.status(404).json({
            success:false,
            message:"Organizer not found"
        })
     }

     if(org && (await bcrypt.compare(password , org.password))){
        const payload = {
            id:org._id
      }
        const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn:'2d'});

        org.token = token;
        org.password = undefined

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

// editProfile controller
exports.editProfile = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const orgId = req.organizer.id; 

        // Check if the user exists
        const organizer = await Organizer.findById(orgId);
        if (!organizer) {
            return res.status(404).json({
                success: false,
                message: "Organizer not found"
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

        if (userName) organizer.userName = userName;
        if (email) organizer.email = email;
        if (password) organizer.password = await bcrypt.hash(password, 10);

        await organizer.save();

        return res.status(200).json({                                
            success: true,
            message: "Profile updated successfully",
            data: organizer
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
};
