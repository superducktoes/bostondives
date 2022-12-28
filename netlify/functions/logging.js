const { createClient } = require("@astrajs/rest");

exports.handler = async (event, context) => {


    const queryString = event.queryStringParameters;
    const bar = queryString.bar || 'None';
    console.log("bar: ", bar);


    const astraClient = await createClient({
        astraDatabaseId: process.env.ASTRA_DB_ID,
        astraDatabaseRegion: process.env.ASTRA_DB_REGION,
        applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN,
    });

    const basePath = "/api/rest/v2/bostondives/app/collections/logs";
    try {
        /*const { data, status } = await astraClient.post(basePath, {
            closestBar: bar,
            ipAddress: "0.0.0.0",
        });*/
        const { data, status } = await astraClient.post(basePath, {
            closestBar: bar,
            ipAddress: "0.0.0.0",
        });
        return {
            statusCode: 200,
            body: JSON.stringify(message),
        };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            body: JSON.stringify(e),
        }
    }
};