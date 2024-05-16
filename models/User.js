import mongoose, { Schema } from "mongoose";


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *         categoriesSubscribed:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of categories to which the user is subscribed.
 *         subscription:
 *           type: object
 *           properties:
 *             subType:
 *               type: string
 *               enum: [daily, monthly, weekly]
 *               description: The type of subscription chosen by the user. Can be 'daily', 'monthly', or 'weekly'.
 *             startDate:
 *               type: string
 *               format: date-time
 *               default: current date and time
 *               description: The start date of the user's subscription.
 *             endDate:
 *               type: string
 *               format: date-time
 *               description: The end date of the user's subscription.
 *           description: Information about the user's subscription.
 *         dailyMessageLimit:
 *           type: number
 *           description: The limit of daily messages allowed for the user.
 *         jobsSent:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *             description: An array of job IDs sent to the user.
 *           description: List of jobs sent to the user.
 *       required:
 *         - phoneNumber
 *         - email
 *         - categoriesSubscribed
 *         - dailyMessageLimit
 *       example:
 *         phoneNumber: "+1234567890"
 *         email: "user@example.com"
 *         categoriesSubscribed:
 *           - "Technology"
 *           - "Health"
 *         subscription:
 *           subType: "monthly"
 *           startDate: "2024-05-01T00:00:00Z"
 *           endDate: "2024-06-01T00:00:00Z"
 *         dailyMessageLimit: 10
 *         jobsSent: []
 */


const userSchema = new Schema({
    phoneNumber: String,
    email: String,
    categoriesSubscribed: [String],
    subscription: {
        subType: { type: String, enum: ['daily', 'monthly', 'weekly'] },
        startDate: { type: Date, default: Date.now() },
        endDate: { type: Date }
    },

    dailyMessageLimit: Number,

    // list of jobs sent to  user
    jobsSent: [{ type: mongoose.Types.ObjectId, ref: 'Job' }]
});


const User = mongoose.model('User', userSchema);

export default User;