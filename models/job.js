import { Schema, model } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           description: The category of the job.
 *         title:
 *           type: string
 *           description: The title of the job.
 *         location:
 *           type: string
 *           description: The location of the job.
 *         expires:
 *           type: string
 *           description: The expiration date of the job listing.
 *         type:
 *           type: string
 *           description: The type of job (e.g., full-time, part-time).
 *         company:
 *           type: string
 *           description: The company offering the job.
 *         dateCreated:
 *           type: string
 *           description: The date when the job was created.
 *         howToApply:
 *           type: object
 *           properties:
 *             link:
 *               type: string
 *               description: The link for applying to the job.
 *             instructions:
 *               type: string
 *               description: Instructions for applying to the job.
 *           description: Information on how to apply for the job.
 *       required:
 *         - category
 *         - title
 *         - location
 *         - expires
 *         - type
 *         - company
 *         - dateCreated
 *         - howToApply
 *       example:
 *         category: "Software Development"
 *         title: "Full Stack Developer"
 *         location: "New York, NY"
 *         expires: "2024-06-30"
 *         type: "full-time"
 *         company: "Example Company"
 *         dateCreated: "2024-05-16"
 *         howToApply:
 *           link: "https://example.com/apply"
 *           instructions: "Please apply through the provided link."
 */


// Define a Mongoose schema for the jobs collection
const jobSchema = new Schema({
    category: String,
    title: String,
    location: String,
    expires: Date,
    type: String,
    company: String,
    dateCreated: Date,
    howToApply: {
        link: String,
        instructions: String
    }
});

// Create a Mongoose model for the jobs collection
export const Job = model('Job', jobSchema);