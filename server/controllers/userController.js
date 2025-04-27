import JobApplication from "../models/jobApplication.js"; 
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import Job from "../models/Job.js"; 

// Sync user from Clerk
export const syncUser = async (req, res) => {
  try {
    const { _id, name, email, image } = req.body;
    
    if (!_id || !name || !email || !image) {
      return res.json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Try to find user by email first
    let user = await User.findOne({ email: email });
    
    if (!user) {
      // Create new user with clerk ID
      user = new User({
        _id,
        name,
        email,
        image
      });
    } else {
      // For existing users, keep their original _id but update other fields
      user.name = name;
      user.email = email;
      user.image = image;
    }

    // Save the user
    await user.save();
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error in syncUser:', error);
    res.json({ success: false, message: error.message });
  }
};


// Get user data
export const getUserData = async (req, res) => {
    try {
        console.log('Auth data:', req.auth);
        
        // Get all users to check what's in database
        const allUsers = await User.find({});
        console.log('All users:', allUsers);

        // Try to find by userId first
        let user = await User.findById(req.auth.userId);
        console.log('Found by ID:', user);

        // If not found and we have email in auth, try by email
        if (!user && req.auth.email) {
            user = await User.findOne({ email: req.auth.email });
            console.log('Found by email:', user);
        }

        // If still not found, try to find by any matching field
        if (!user) {
            user = await User.findOne({
                $or: [
                    { _id: req.auth.userId },
                    { email: req.auth.email },
                    { name: req.auth.name }
                ]
            });
            console.log('Found by any field:', user);
        }

        if (!user) {
            return res.json({
                success: false,
                message: 'User not Found',
                debug: {
                    authData: req.auth,
                    usersInDb: allUsers.length
                }
            });
        }

        res.json({success: true, user});
    } catch (error) {
        console.error('Error in getUserData:', error);
        res.json({success: false, message: error.message});
    }
}

// Apply for a job
export const applyForJob = async (req, res) => {

    const {jobId} = req.body
    const userId = req.auth.userId

    try {
        const isAlreadyApplied = await JobApplication.find({jobId,userId})

        if (isAlreadyApplied.length > 0) {
            return res.json({success:false,message:'Already Applied'})
        }

        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({success:false, message:'Job not Found'})
        }

        await JobApplication.create({
            companyId:jobData.companyId,
            userId,
            jobId,
            date:Date.now()
        })

        res.json({success:true,message:'Applied Successfully'})
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

// Get user applied applications
export const getUserJobApplications = async (req, res) => {

    try {
        const userId = req.auth.userId
        const applications = await JobApplication.find({userId})
        .populate('companyId','name email image')
        .populate('jobId','title description location category level salary')
        .exec()

        if (!applications) {
            return res.json({success:false, message:'No job Applications found for this user.'})
        }

        return res.json({success:true,applications})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}



//Update user profile

export const updateUserResume = async(req,res) => {

    try {
        const userId = req.auth.userId

        const resumeFile = req.file

        const userData = await User.findById(userId)

        if (resumeFile) {

            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        return res.json({success:true,message:'Resume Updated'})

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}