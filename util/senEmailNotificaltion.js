import { createTransport } from 'nodemailer';
import User from "../models/User.js"
import { Job } from '../models/job.js';
import mongoose from 'mongoose';




// Function to send email notification to subscribed users
export const sendEmailNotification = async (jobsList, userList) => {
    // Iterate over each user
    for (let user of userList) {
        // Check if the user is subscribed to any job categories and if the subType is not null
        if (user.categoriesSubscribed && user.subscription && user.subscription.subType) {
            // Filter jobs based on user's subscribed categories and not sent to the user
            let userJobs = jobsList.filter(job =>
                user.categoriesSubscribed.includes(job.category)
                &&
                !user.jobsSent.includes(job._id)

            );
            // console.log(userJobs)  // these are the jobs to be sent to the user
            if (userJobs.length > 0) {
                // Compose email content
                let emailContent = `<h2>Jobs Notification</h2><p>Hello ${user.email},<br/>Here are the latest job opportunities:</p> <br/><br/><ul>`;

                // Append job details to email content
                for (let job of userJobs) {
                    emailContent += `<li><strong>${job.title}</strong> at ${job.company}.<br/> Expires on ${job.expires}.<br/> 
                    <a href="${job.howToApply.link}"> ${job.howToApply.link ? (job.howToApply.link) : ""} </a><br/>${job.howToApply.instructions}</li> <br/><br/>`;

                    const dbUser = await User.findById(user?._id)

                    dbUser.jobsSent.push(job._id);
                    await dbUser.save();
                }

                emailContent += `</ul>`;

                // Create nodemailer transporter
                let transporter = createTransport({
                    host: "mail.uipafrica.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "project.tracking@uipafrica.com",
                        pass: "@Test1234ps"
                    }
                });

                // Define email options
                let mailOptions = {
                    from: 'project.tracking@uipafrica.com',
                    to: user.email,
                    subject: 'New Job Opportunities',
                    html: emailContent
                };

                // Send email
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${user.email}`);

                // // Remove sent jobs from the jobs list
                // jobsList = jobsList.filter(job => !user.jobsSent.includes(job._id));

            } else {
                console.log("No user Jobs to be sent")
            }


        }
    }
}

// Example usage:
// const allJobs = await Job.find();



// const usersList = await User.find()
// sendEmailNotification(allJobs, usersList);



// send Custum email to user
export const sendCustomEmailNotification = async (userID, customMessage) => {
    try {
        // Find the user by userID
        const user = await User.findById(userID);
        if (!user) {
            console.log('User not found');
            return;
        }

        // Compose email content with custom message
        let emailContent = `<h2>Custom Notification</h2><p>Hello ${user?.email},</p><p>${customMessage}</p>`;

        // Create nodemailer transporter
        let transporter = createTransport({
            host: "mail.uipafrica.com",
            port: 465,
            secure: true,
            auth: {
                user: "project.tracking@uipafrica.com",
                pass: "@Test1234ps"
            }
        });

        // Define email options
        let mailOptions = {
            from: 'project.tracking@uipafrica.com',
            to: user?.email,
            subject: 'Custom Notification',
            html: emailContent
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`Custom email sent to ${user?.email}`);
    } catch (error) {
        console.error('Error sending custom email:', error.message);
    }
};