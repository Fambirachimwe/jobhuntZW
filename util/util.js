import * as cheerio from 'cheerio';
import axios from "axios";
import { scrapeEmailAddresses } from './scrapeEmailAddresses.js';



export const scrapeJobs = (category) => {
    return new Promise((resolve, reject) => {
        const html = axios.get(`https://ihararejobs.com/categories/${category}/`);

        html.then(async data => {
            const $ = cheerio.load(data?.data);
            const pages = $('.pagination-box-row p');
            let start, end;
            if (!pages.text()) {
                start = 1;
                end = 1;
            } else {
                start = parseInt(pages.text().split(" ")[1]);
                end = parseInt(pages.text().split(" ")[3]);
            }

            let promises = [];
            let objectsArray = [];

            for (let index = start; index < end + 1; index++) {
                let promise = axios.get(`https://ihararejobs.com/categories/${category}/?page=${index}`).then(async data => {
                    const $ = cheerio.load(data?.data);
                    const _company = $(".company-list-details  ", data.data);

                    const url = _company.find('a').attr("href");

                    // url: `https://ihararejobs.com${url}`

                    // retriew how to apply instructions

                    const request = await axios.get(`https://ihararejobs.com${url}`);
                    const _$ = cheerio.load(request?.data)
                    const applyParagraph = _$('div.single-candidate-widget h3')
                        .filter((index, element) => $(element).text().trim() === 'How to Apply')
                        .nextAll('p');

                    let instructions;

                    // console.log(applyParagraph.html())
                    instructions = scrapeEmailAddresses(applyParagraph.html())
                    // console.log(scrapeEmailAddresses(applyParagraph.html()))

                    // console.log(instructions.text())
                    const applyLink = applyParagraph.find('a').attr('href');

                    // console.log(applyLink);


                    const _j = _company.text().split("\n").filter(item => item.trim() !== "");

                    // console.log(_j)

                    for (let i = 0; i < _j.length; i += 6) {
                        let job = {
                            title: _j[i]?.trim(),
                            location: _j[i + 1]?.trim(),
                            expires: _j[i + 2]?.trim().split('Expires ')[1],
                            type: _j[i + 3]?.trim(),
                            company: _j[i + 4]?.trim(),
                            dateCreated: _j[i + 5]?.trim().split('Created ')[1],
                            // url: `https://ihararejobs.com${url}`,
                            howToApply: {
                                "link": applyLink === '/cdn-cgi/l/email-protection' ? "N/A" : applyLink,
                                instructions: applyLink === '/cdn-cgi/l/email-protection' ? (instructions) : applyParagraph.text()
                            }
                        };

                        objectsArray.push(job);
                    }
                });

                promises.push(promise);
            }

            Promise.all(promises).then(() => {
                resolve(objectsArray);


            }).catch(err => reject(err));
        }).catch(err => reject(err));
    });
};


// scrapeJobs("ict").then(data => {
//     // console.log(data);
//     insertJobsIntoDatabase(data, 'ict')
// }).catch(err => {
//     console.error(err);
// });