import mongoose ,{Schema,model}from "mongoose"
//import bcrypt from 'bcrypt'
import validator from 'validator'
const userSchema=new Schema({
    userName:{
        type: String,
        required: [true, 'Please tell us your name!'],
        trim:true,
      },
    
 
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: [true,'the email is exist already'],
        lowercase: true,
        trim:true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        
        trim:true,
      },
      passwordConfirm:{
        type: String,
        required: [true, 'Please confirm a password'],
        minlength: 8,
        trim:true,
        // validate:function(e){
        //   return e===this.password
        // },
        // Message:"passwordes are not the same"
      },
    // gender:{   
    //      type: String,
    //     enum: ['male', 'female'],
    
    //     required: [true, 'Please tell us your gender'],
    //     trim:true,}

    passwordChangedAt:{
        type:Date
    },
    role:{
        type:String,
        enum:['admin','student','teacher'],
        default:"student",
    },
    isConfirm:{
      type:Boolean,
      default:false
    },
    __v:{
      type:Number,
      select:false
    }

},{
  timestamps:true
,toJSON:{virtuals:true}
},)
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
    // Hash the password with cost of 8
    //this.password = await bcrypt.hash(this.password, 8);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });
  
  userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });
 
  userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
  });
  userSchema.methods.correctPassword = async function(
    passwordCurrent,
    userPassword
  ) {
    return await bcrypt.compare(passwordCurrent, userPassword);
  };
  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
  };
  //create password and reset token
  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    console.log({ resetToken } , this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
  
export const User=model("User",userSchema)
