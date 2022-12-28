exports.handler = async (event, context) => {
  
    const data = {
        hello: "hello world"
    }
    console.log("event", event);
    console.log("context", context);

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }
};