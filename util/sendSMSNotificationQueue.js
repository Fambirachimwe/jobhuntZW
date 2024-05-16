import twilio from 'twilio';
import { Job } from '../models/job.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import Queue from 'bull';

mongoose.connect("mongodb://127.0.0.1:27017/JobAllerts");
mongoose.connection.once('open', async () => {
    console.log('Connected to JobAlerts database');
}).on('error', (error) => {
    console.log('connection error ', error);
});


// Twilio credentials
const accountSid = 'AC60bfdba4dc6104490903d4574373d650';
const authToken = '86badc1a397323cae008946ab6cfbf20';
const twilioPhoneNumber = '+12018624457';

// Twilio client initialization
const client = twilio(accountSid, authToken);

// BullMQ queue initialization
const queue = new Queue('smsQueue', 'redis://default:redispw@localhost:32768');

// Function to process and send SMS notifications
const sendSMS = async (data) => {
    const { phoneNumber, smsContent } = data;

    try {
        // Send SMS using Twilio
        await client.messages.create({
            body: smsContent,
            from: twilioPhoneNumber,
            to: phoneNumber.replace(/^0/, "+263")
        });

        console.log(`SMS sent to ${phoneNumber}`);
    } catch (error) {
        console.error(`Error sending SMS to ${phoneNumber}: ${error.message}`);
    }
};

// Worker to process messages and send SMS notifications at 10:00 am
const worker = new Queue.Worker('smsQueue', async (job) => {
    const { phoneNumber, smsContent } = job.data;
    await sendSMS({ phoneNumber, smsContent });
});

worker.on('completed', (job) => {
    console.log(`SMS job ${job.id} has been processed successfully.`);
});

// Function to schedule SMS notifications for users
// export const scheduleSMSNotificationsQueue = async () => {
//     // Iterate over each user
//     const userList = await User.find();
//     for (let user of userList) {
//         // Check if the user is subscribed to any job categories and if the subType is not null
//         if (user.categoriesSubscribed && user.subscription && user.subscription.subType) {
//             // Filter jobs based on user's subscribed categories and not sent to the user
//             const userJobs = await Job.find({
//                 category: { $in: user.categoriesSubscribed },
//                 _id: { $nin: user.jobsSent }
//             });

//             if (userJobs.length > 0) {
//                 // Compose SMS content
//                 let smsContent = `Hello ${user.phoneNumber},\nHere are the latest job opportunities:\n`;

//                 // Divide userJobs into batches of 5
//                 for (let i = 0; i < userJobs.length; i += 5) {
//                     const batch = userJobs.slice(i, i + 5);

//                     // Append job details to SMS content
//                     for (let job of batch) {
//                         smsContent += `${job.title}\n ${job.company}.\nExpires on ${job.expires}.\nApply here: ${job.howToApply.link}\n\n`;

//                         // Update user's jobsSent array with the sent job
//                         user.jobsSent.push(job._id);
//                         await user.save();
//                     }

//                     // Enqueue SMS message
//                     await queue.add({
//                         phoneNumber: user.phoneNumber,
//                         smsContent
//                     });
//                 }
//             } else {
//                 console.log("No user Jobs to be sent")
//             }
//         }
//     }
// };

// Example usage:
// scheduleSMSNotifications();
