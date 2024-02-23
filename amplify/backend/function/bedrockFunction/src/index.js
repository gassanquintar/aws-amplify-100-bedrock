const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

exports.handler = async (event) => {
    // Create a new Bedrock SDK Client
    const client = new BedrockRuntimeClient({ 
        region: "us-east-1", 
    });
  let prompt;
  if (event.prompt && event.prompt !== "") {
    prompt = event.prompt;
  } else if (event.body && event.body !== "") {
    var body = JSON.parse(event.body);
    if (body.prompt && body.prompt !== "") {
      prompt = body.prompt;
    }
  }
  const input = {
    "body": JSON.stringify({
      "inputText": prompt,
      "textGenerationConfig": {
        "maxTokenCount": 512,
        "stopSequences": [],
        "temperature": 0,
        "topP": 0.9,
      },
    }),
    "accept": 'application/json',
    "contentType": "application/json",
    "modelId": "amazon.titan-text-lite-v1",
  };

  try {
    // Send the request to the Bedrock model
    const response = await client.send(new InvokeModelCommand(input));

    // Process the output from the Bedrock model and return the generated data.
    // NOTE: The structure of the response also differs depending on the model used.
    const { results } = JSON.parse(new TextDecoder().decode(response.body));
    return {
      "statusCode": 200,
      "headers": {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      "body": JSON.stringify({ response: results[0].outputText }),
    };
  } catch (e) {
    return {
      "statusCode": 500,
      "body": e,
    };
  }
};


// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */
// exports.handler = async (event) => {
//     console.log(`EVENT: ${JSON.stringify(event)}`);
//     return {
//         statusCode: 200,
//     //  Uncomment below to enable CORS requests
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Headers": "*"
//         },
//         body: JSON.stringify('Hello from Lambda!'),
//     };
// };
