exports.handler = async (event, context) => {
  
    const data = {
        hello: "hello world"
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    }
};