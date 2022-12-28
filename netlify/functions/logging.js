exports.handler = async (event, context) => {
  
    const queryString = event.queryStringParameters;
    const bar = queryString.bar || 'None';

    console.log("bar: ", bar);

    const data = {
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }
};