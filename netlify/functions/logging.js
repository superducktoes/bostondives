exports.handler = async (event, context) => {
  
    const queryString = event.queryStringParameters;
    const bar = queryString.bar || 'None';
    const barSaved = queryString.barSaved || 'None';
    const error = queryString.error || 'None';

    if(bar){
        console.log("closest_bar: ", bar);
        console.log("useragent: ", event["headers"]["user-agent"]);
        console.log("clientip: ", event["multiValueHeaders"]["X-Forwarded-For"][0].split(",")[0]);
    } else if(barSaved){
        console.log("saved_bar: ", barSaved);
        console.log("useragent: ", event["headers"]["user-agent"]);
        console.log("clientip: ", event["multiValueHeaders"]["X-Forwarded-For"][0].split(",")[0]);
    } else if(error) {
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
};