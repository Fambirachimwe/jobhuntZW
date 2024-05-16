import * as cheerio from 'cheerio';



function decodeEmail(encodedString) {
    var email = "", r = parseInt(encodedString.substr(0, 2), 16), n, i;
    for (n = 2; encodedString.length - n; n += 2) {
        i = parseInt(encodedString.substr(n, 2), 16) ^ r;
        email += String.fromCharCode(i);
    }
    return email;
}

export function scrapeEmailAddresses(html) {


    const $ = cheerio.load(html);

    let stringWithoutPTags = html.replace(/<p>/g, "").replace(/<\/p>/g, "");
    const regex = /<a.*?class="__cf_email__".*?data-cfemail="(.*?)">.*?<\/a>/g;

    let data
    return stringWithoutPTags.replace(regex, (match, encodedString) => {

        if (match) {

            const decodedEmail = decodeEmail(encodedString);
            return decodedEmail;
        } else {
            const aTag = $('a');
            console.log(aTag.text())
            return aTag.text()
        }

    });
}

// const html = '<p>Interested candidates should send their detailed applications to: <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="8de8e0ecfee5ece3e9f8f7e8cdbeffe9e8f4e8ecebffe4eeeca3eee2e0">[email&#160;protected]</a> <br>CC: <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="12787d706152216076776b777374607b71733c717d7f">[email&#160;protected]</a></p>';
// const emailAddresses = scrapeEmailAddresses(html);
// console.log("xxxxxxxxxxxxxxxxxxxxx", emailAddresses);
