/*exports.handler = async (event, context) => {
  
    const queryString = event.queryStringParameters;
    const bar = queryString.bar || 'None';
    const barSaved = queryString.barSaved || 'None';
    const error = queryString.error || 'None';

    if(bar != "None"){
        console.log("closest_bar: ", bar);
        console.log("useragent: ", event["headers"]["user-agent"]);
        console.log("clientip: ", event["multiValueHeaders"]["X-Forwarded-For"][0].split(",")[0]);
    } else if(barSaved != "None"){
        console.log("saved_bar: ", barSaved);
        console.log("useragent: ", event["headers"]["user-agent"]);
        console.log("clientip: ", event["multiValueHeaders"]["X-Forwarded-For"][0].split(",")[0]);
    } else if(error != "None") {
        console.log("error_message:", error);
        console.log("useragent: ", event["headers"]["user-agent"]);
        console.log("clientip: ", event["multiValueHeaders"]["X-Forwarded-For"][0].split(",")[0]);
    } else {
        console.log("Not Sharing Location");
        console.log("useragent: ", event["headers"]["user-agent"]);
        console.log("clientip: ", event["multiValueHeaders"]["X-Forwarded-For"][0].split(",")[0]);
    }


    const data = {
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }
};*/

const faunadb = require('faunadb');

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
});

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {
    let statusCode, returnData, postData;

    let clientip = event["multiValueHeaders"]["X-Forwarded-For"][0].split(",")[0];
    let useragent = event["headers"]["user-agent"];

    const queryString = event.queryStringParameters;
    const bar = queryString.bar || 'None';
    const barSaved = queryString.barSaved || 'None';
    const error = queryString.error || 'None';

    if (bar != "None") {
        console.log("closest_bar: ", bar);
        console.log("useragent: ", useragent);
        console.log("clientip: ", clientip);

        postData = { "closest_bar": [{ "bar": bar }, { "clientip": clientip }, { "userAgent": useragent }] };

    } else if (barSaved != "None") {
        console.log("saved_bar: ", barSaved);
        console.log("useragent: ", useragent);
        console.log("clientip: ", clientip);

        postData = { "saved_bar": [{ "bar": barSaved }, { "ip": "ip" }, { "userAgent": useragent }] }

    } else if (error != "None") {
        console.log("error_message:", error);
        console.log("useragent: ", useragent);
        console.log("clientip: ", clientip);

        postData = { "error_message": [{ "error_message": error }, { "clientip": clientip }, { "userAgent": useragent }] }

    } else {
        console.log("Not Sharing Location");
        console.log("useragent: ", useragent);
        console.log("clientip: ", clientip);

        postData = { "not_sharing_location": [{ "clientip": clientip }, { "userAgent": useragent }] }

    }

    try {
        //const {title, description } = req.body;
        //let postData = { "saved_bar": [{ "bar": "test" }, { "ip": "ip" }, { "userAgent": "agent" }] }
        const { rdata } = await client.query(
            q.Create(q.Collection('logs'), { data: postData })
        );
        statusCode = 200
        console.log(rdata);
        returnData = rdata;
    }
    catch (error) {
        statusCode = 500
        returnData = error;
        console.log(error);
    }

    return {
        statusCode: statusCode,
        body: JSON.stringify(returnData),
    }
};