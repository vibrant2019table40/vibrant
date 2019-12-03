// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'us-east-1' });

const planUrl = process.env.PlanUrl

const getEmailBodyHtml = (code) => `<p>To review your safety plan, please visit:</p>

<p><a href="${planUrl}${code}">${planUrl}${code}</a></p>`;

const getEmailBodyText = (code) => `To review your safety plan, please visit:

${planUrl}${code}`;

// Create sendEmail params
const getEmailParams = (email, code) => {
    return {
        Destination: { /* required */
            ToAddresses: [
                email,
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: getEmailBodyHtml(code)
                },
                Text: {
                    Charset: "UTF-8",
                    Data: getEmailBodyText(code)
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Your safety plan'
            }
        },
        Source: 'sai.karthik.nadella@pwc.com', /* required */
        // ReplyToAddresses: [
        //     'sai.karthik.nadella@pwc.com',
        //     /* more items */
        // ],
    };
}

exports.shareHandler = async (event, context) => {
    try {
        // console.log("event = " + JSON.stringify(event));
        // console.log("context = " + JSON.stringify(context));

        bodyText = event['body'] || "{}";
        body = JSON.parse(bodyText);
        email = body.email || "";
        code = body.code || "";


        // Create the promise and SES service object
        const params = getEmailParams(email, code);
        const sendPromise = await new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
        console.log(JSON.stringify(sendPromise));

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                email,
                code,
            },
            'headers': {
                "Access-Control-Allow-Origin": "*"
            }
            )
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
