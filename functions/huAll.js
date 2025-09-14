export async function onRequest(context) {
  const { request } = context;

  // Only handle POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Get the request body
    const requestBody = await request.json();

    // Extract the target URL and custom headers from the request
    const { data } = requestBody;
    console.log("Data received in huAll function:", data);
    const jsonData = JSON.stringify(data);
    console.log("JSON data to be sent:", jsonData);

    const url = "https://api.hotutils.com/Production/account/data/all";

    // Make the proxied request with custom headers
    const response = await fetch(url, {
      method: 'POST',
      headers:{
        "authority": "api.hotutils.com",
        "accept": "*/*",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "apiuserid": "898a36a3-948a-4a8a-9798-7a1552b042a8",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "dnt": "1",
        "origin": "https://hotutils.com",
        "pragma": "no-cache",
        "referer": "https://hotutils.com/",
        "sec-ch-ua": "^\^Not.A/Brand^^;v=^\^8^^, ^\^Chromium^^;v=^\^114^^, ^\^Google",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "^\^Android^^",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
      },
      body: JSON.stringify(data),
    });

    // Get response data
    const responseData = await response.text();

    // Try to parse as JSON, fall back to text
    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    // Return the response with CORS headers
    return new Response(JSON.stringify(parsedData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}