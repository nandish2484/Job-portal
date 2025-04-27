import express from 'express'
import { applyForJob, getUserData, getUserJobApplications, updateUserResume, syncUser } from '../controllers/userController.js'
import upload from '../config/multer.js'

const router = express.Router()

// Sync user from Clerk
router.post('/sync', syncUser)

// Get user Data
router.get('/user', getUserData)

// Apply for a job
router.post('/apply', applyForJob)

// Get applied jobs data
router.get('/applications',getUserJobApplications)

//Update user Profile
router.post('/update-resume',upload.single('resume'),updateUserResume)

export default router;