import { User } from "../../models/userModel.js"
import mongoose from "mongoose";
import express from 'express'
import jwt, { decode } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import sendEmail from "../../middlware/sendEmail.js";
import { catchAsync } from "../../handleErrors/catchAsync.js";
import AppError from "../../handleErrors/appError.js";


const signToken = (id,role) => {
  return jwt
      .sign({ id ,role},
      "school" ,
      {expiresIn:"100d"});
  };
  const createSendToken = (user, statusCode, res) => {
      const token = signToken(user._id,user.role);
      res.status(statusCode).json({
          status: 'success',
          token,
          data: {
            user
          }
      });
  }
// 7-get all user 






const signup=catchAsync(async(req, res) => {
   
  let user= await User.insertMany(req.body)
   // const user =  new User(req.body);
   // const addedUser= await User.save()
   let token = jwt.sign({ email: user[0].email }, "school");
   user[0].password=undefined
   user[0].passwordConfirm=undefined
   sendEmail(user[0].email)
    res.status(201).json({
         message: "User Registered Successfully",
         token,
       });
      
      
})
const signin=catchAsync(async(req, res,next) => {
    const {email,password}= req.body;
    let user=await User.findOne({email:req.body.email})
    // user[0].password=undefined
    // user[0].passwordConfirm=undefined

    if(!user&&!bcrypt.compareSync(req.body.password,user.password)){
       
       return next(new AppError("Incorrect email or password",422))
    }
    if(user.isConfirm==false){
  
      return next(new AppError("you should verify u account",401))

    }
    
        createSendToken(user,200,res)
      })
    //1)check if email and password exist
    // 2) Check if user exists && password is correct
    
      // 3) If everything ok, create and send token to client
  
  const verifyAccount=(req, res,next) => {
    jwt.verify(req.params.token,"school",async(err,decoded)=>{
      if(err) return next(new AppError("invalid token",400))
        //return res.status(400).json({msg:"invalid token"});
       
      await User.findOneAndUpdate({email:decoded},{isConfirm:true})
      res.json({msg:" verified email"})

   })
  }
  
  const forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }
    // 2) Generate the random reset token
    //const resetToken =jwt.sign({ email: user[0].email }, "school");
    const resetToken =user.createPasswordResetToken();
   
  
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    
    const message = `Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. `;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      console.log(err);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      ); }
  });
  const resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  });
  const restrictTo = (...roles) => {
    return (req, res, next) => {
    //role=['admin','client','worker']
    
    if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );}
      next();
    };
  };
export{
    
    signup,
    signin,
    verifyAccount,
    forgotPassword,
    resetPassword,
    restrictTo
  
  }
 


  
