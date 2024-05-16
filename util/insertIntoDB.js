import { Job } from "../models/job.js";



// Function to insert job data into the MongoDB database
export const insertJobsIntoDatabase = async (jobsData, category) => {

    try {
        // Connect to MongoDB

        // Iterate through each job object and add the category
        for (const job of jobsData) {
            job.category = category;
        }

        // Array to store the bulk operations
        const bulkOps = jobsData.map(job => ({
            updateOne: {
                filter: {
                    title: job.title,
                    company: job.company,
                    dateCreated: new Date(job.dateCreated),
                    expires: new Date(job.expires)
                }, // Assuming 'title' is unique
                update: { $setOnInsert: job },
                upsert: true
            }
        }));

        // Perform the bulk write operation
        await Job.bulkWrite(bulkOps);

        console.log('Jobs inserted successfully into the database without duplicates.');
    } catch (error) {
        console.error('Error inserting jobs into the database:', error);
    } finally {
        // Disconnect from MongoDB
        // await disconnect();
    }
}

// Usage example:
// const jobsData = [/* Array of job objects */];
// insertJobsIntoDatabase(jobsData);
