import 'dotenv/config.js';
import express from "express";
import jobRoutes from "./routes/jobs.js";
import userRoutes from "./routes/user.js"
import mongoose from 'mongoose'
import { removeExpiredJobs, runCronJob, runCronJobEmailNotifications, runCronJobSMSNotifications } from "./util/cronJobs.js";
import swaggerDocs from "./util/swagger.js";

// connection to the mongoose database 

mongoose.connect(`${process.env.MONGODB_URL}`);
mongoose.connection.once('open', async () => {
    console.log('Connected to JobAlerts database');
}).on('error', (error) => {
    console.log('connection error ', error);
});


// running the cron task daily  scraping for jobs
const categories = ['ict', 'business']; // Specify the list of categories
runCronJob(categories);

// remove expired jobs 
removeExpiredJobs()

// cron job for seding email notifications to  users 
runCronJobEmailNotifications();

// run cronjob to send sms notifications everyday at 10.00am

// runCronJobSMSNotifications();



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors("*"));



// routes 
app.use('/jobs', jobRoutes)
app.use('/users', userRoutes)


app.listen(PORT, () => {
    console.log('server started at port 5000')
    swaggerDocs(app, PORT)
})
