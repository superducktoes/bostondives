exports.handler = async (event, context) => {
  
    const queryString = event.queryStringParameters;
    const bar = queryString.bar || 'None';

    console.log("bar: ", bar);
    console.log("event ip: ", event.multiValueHeaders.X-Forwarded-For[0])
    console.log("query: ", event.multiValueQueryStringParameters)
    const data = {
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }
};