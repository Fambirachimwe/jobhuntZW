
import twilio from 'twilio';
import { Job } from '../models/job.js';
import User from '../models/User.js';
import mongoose from 'mongoose';






// Function to send SMS notification to subscribed users using Twilio
// Function to send SMS notification to subscribed users using Twilio
export const sendSMSNotification = async (jobsList, userList) => {
    // Twilio credentials
    const accountSid = 'AC60bfdba4dc6104490903d4574373d650';
    const authToken = '86badc1a397323cae008946ab6cfbf20';
    const twilioPhoneNumber = '+12018624457';

    // Twilio client initialization
    const client = twilio(accountSid, authToken);

    // Iterate over each user
    for (let user of userList) {
        // Check if the user is subscribed to any job categories and if the subType is not null
        if (user.categoriesSubscribed && user.subscription && user.subscription.subType) {
            // Filter jobs based on user's subscribed categories and not sent to the user
            let userJobs = jobsList.filter(job =>
                user.categoriesSubscribed.includes(job.category) &&
                !user.jobsSent.includes(job._id)
            );

            // console.log(userJobs)  // these are the jobs to be sent to the user

            if (userJobs.length > 0) {
                // Compose SMS content
                let smsContent = `Hello ${user.phoneNumber},\nHere are the latest job opportunities:\n\n`;

                // Divide userJobs into batches of 5
                for (let i = 0; i < userJobs.length; i += 5) {
                    let batch = userJobs.slice(i, i + 5);

                    // Append job details to SMS content
                    for (let job of batch) {
                        smsContent += `${job.title}\n ${job.company}.\nExpires on ${job.expires}.\nApply here: ${job.howToApply.link === "N/A" ? (job.howToApply.instructions) : job.howToApply.link}\n\n`;

                        // Update user's jobsSent array with the sent job 
                        const dbUser = await User.findById(user?._id)
                        dbUser.jobsSent.push(job._id);
                        await dbUser.save();
                    }

                    // console.log(smsContent);

                    // Send SMS using Twilio
                    await client.messages.create({
                        body: smsContent,
                        from: twilioPhoneNumber,
                        to: user.phoneNumber.replace(/^0/, "+263")
                    });

                    console.log(`SMS sent to ${user.phoneNumber}`);

                    smsContent = ''; // Reset SMS content for the next batch
                }
            } else {
                console.log("No user Jobs to be sent")
            }
        }
    }
}

export const sendCustomSMSNotification = async (userId, customMessage) => {
    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return;
        }

        // Twilio credentials
        const accountSid = 'AC60bfdba4dc6104490903d4574373d650';
        const authToken = '86badc1a397323cae008946ab6cfbf20';
        const twilioPhoneNumber = '+12018624457';

        // Twilio client initialization
        const client = twilio(accountSid, authToken);

        // Compose SMS content with custom message
        let smsContent = `${customMessage}`;

        // Send SMS using Twilio
        await client.messages.create({
            body: smsContent,
            from: twilioPhoneNumber,
            to: user.phoneNumber.replace(/^0/, "+263")
        });

        console.log(`Custom SMS sent to ${user.phoneNumber}`);
    } catch (error) {
        console.error('Error sending custom SMS:', error.message);
    }
};


// Example usage:
// const allJobs = await Job.find();

// const usersList = await User.find()
// sendSMSNotification(allJobs, usersList);