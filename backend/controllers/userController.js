import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from 'bcryptjs';



//Login Function
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email});

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credits" });
        }
        const token = createToken(user._id);
        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create JWT Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register Function
const registerUser = async (req,res) => {
    const {username , password , email} = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // VAlidation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if(password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        
        // if everything is fine
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //new user
        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPassword,
        })
        const user = await newUser.save();
        const token = createToken(user._id);
        res.status(201).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export { loginUser, registerUser };