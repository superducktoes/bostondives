exports.handler = async (event, context) => {
  
    const queryString = event.queryStringParameters;
    const bar = queryString.bar || 'None';

    console.log("closest_bar: ", bar);
    console.log("useragent: ", event["headers"]["user-agent"]);
    console.log("clientip: ", event["multiValueHeaders"]["X-Forwarded-For"][0].split(",")[0]);

    const data = {
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }
};