const User=require("../models/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


//General jwt Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },  // Include role
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};


//@desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser=async (req,res)=>{
    try{

        const {name,email,password,profileImageUrl,adminInviteToken}=req.body

        //check if user already exists
        const userExists=await User.findOne({email})
        if(userExists){
            return res.status(400).json({message:"user already exists"})
        }


        //Determine user role:adimn if correct token is provided ,otherwise Member
        let role="member"
        if(adminInviteToken&&adminInviteToken==process.env.ADMIN_INVITE_TOKEN){
            role="admin"
        }

        //Hash password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        //Create new user
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            profileImageUrl,
            role,
        })

        //Return user data with JWT 
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.name,
            role:user.role,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id),
        })

    }catch(error){
        res.status(500).json({message:"Server error",error:error.message})
    }
}

//@desc Login user
//@route POST /api/auth/login
//@access Public
const loginUser=async (req,res)=>{
    try{

        const {email,password}=(req.query)

        const user=await User.findOne({email})
        
        if (!user){
            return res.status(401).json({message:"invalid email or password"})
        }

        //Compare password
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({message:"invalid email or password"})
        }


        //Return user data with JWT
        res.json({
            _id:user.id_,
            name:user.name,
            email:user.email,
            role:user.role,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id)
        })
        
    }catch(error){
        res.status(500).json({message:"Server errorrr",error:error.message})
    }
}


//@desc get user profile
//@route POST /api/auth/profile
//@access Private(Require JWT)
const getUserProfile=async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password")
        if(!user){
            return res.status(404).json({message:"Server error",error:error.message})
        }
    }catch(error){
        res.status(500).json({message:"Server error",error:error.message})
    }
}


//@desc updte user profile
//@route POST /api/auth/login
//@access Private(Require JWT)
const updateUserProfile=async (req,res)=>{
    try{
        const user=await User.findById(req.res)

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        user.name=req.body.name||user.name
        user.email=req.body.email||user.email

        if(req.body.password){
            const salt=await bcrypt.genSalt(10)
            user.password=await bcrypt.hash(req.body.password,salt)
        }

        const updateUser=await user.save()

        res.json({
            _id:updateUser._id,
            name:updateUser.name,
            email:updateUser.email,
            role:updateUser.role,
            token:generateToken(updateUser._id)
        })
    }catch(error){
        res.status(500).json({message:"Server error",error:error.message})
    }
}

module.exports={registerUser,loginUser,getUserProfile,updateUserProfile}

