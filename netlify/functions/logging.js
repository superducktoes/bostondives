exports.handler = async (event, context) => {
  
    const data = {
        hello: "hello world"
    }
    console.log("event", event);
    console.log("context", context);

    const queryString = event.queryStringParameters;
    const bar = queryString.bar || 'None';
    const currentLocation = queryString.location || 'None';

    console.log("bar: ", bar);
    console.log("currentLocation: ", currentLocation);

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }
};