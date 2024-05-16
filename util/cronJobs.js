import cron from 'node-cron';
import { scrapeJobs } from './util.js';
import { insertJobsIntoDatabase } from './insertIntoDB.js';
import { Job } from '../models/job.js';
import User from '../models/User.js';
import { sendSMSNotification } from './sendSMSNotification.js';

// import { scheduleSMSNotificationsQueue } from './sendSMSNotificationQueue.js';


// daily
// '0 0 * * *    


// 5 seconds
// '*/5 * * * * *'

// cron for scrapping for jobs 
export const runCronJob = (categories) => {
    // Schedule the cron job to run daily at a specific time (e.g., midnight)
    cron.schedule('0 0 * * *', async () => {
        try {
            // Iterate over each category in the list
            for (const category of categories) {
                console.log(`Scraping jobs for category: ${category}`);
                // Scrape jobs for the current category
                const jobsData = await scrapeJobs(category);
                // Insert the scraped jobs into the database
                await insertJobsIntoDatabase(jobsData, category);
                console.log(`Jobs scraped and inserted successfully for category: ${category}`);
            }
        } catch (error) {
            console.error('Error scraping and inserting jobs:', error);
        }
    });
};

// const categories = ['ict', 'business']; // Specify the list of categories
// runCronJob(categories);


// cron job for sending sms notifications

// Schedule the function to run at 10:00 am every day
// cron.schedule('0 10 * * *', async () => {
//     console.log('Running scheduled task to send SMS notifications...');
//     await scheduleSMSNotificationsQueue();
// }, {
//     scheduled: true,
//     timezone: 'Africa/Harare' // Set your timezone
// });


export const runCronJobEmailNotifications = () => {
    // Schedule the cron job to run daily at a specific time (e.g., 10am everyday)
    cron.schedule('0 10 * * *', async () => {
        try {
            // Iterate over each category in the list
            const allJobs = await Job.find();

            const usersList = await User.find()
            sendEmailNotification(allJobs, usersList);
        } catch (error) {
            console.error('Error sending email notifications to users', error);
        }
    });
};




// send SMS Notifications
export const runCronJobSMSNotifications = () => {
    // Schedule the cron job to run daily at a specific time (e.g., 10am everyday)
    cron.schedule('0 10 * * *', async () => {
        try {
            // Iterate over each category in the list
            const allJobs = await Job.find();

            const usersList = await User.find()
            sendSMSNotification(allJobs, usersList);
        } catch (error) {
            console.error('Error sending email notifications to users', error);
        }
    });
};


// '0 1 * * *'
export const removeExpiredJobs = () => {
    // Schedule the cron job to run daily 

    console.log("removing expired Jobs")
    cron.schedule('0 1 * * *', async () => {
        try {
            // Get the current date
            const currentDate = new Date();

            // Find all jobs with expiration dates before the current date
            const expiredJobs = await Job.find({ expires: { $lt: currentDate } });
            console.log(currentDate)

            // console.log(expiredJobs.length)

            // Remove the expired jobs from the database
            await Job.deleteMany({ expires: { $lt: currentDate } });

            // Log the number of expired jobs removed
            console.log(`${expiredJobs.length} expired jobs removed from the database.`);
        } catch (error) {
            console.error('Error removing expired jobs:', error);
        }
    });
};