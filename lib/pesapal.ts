// const BASE_URL = process.env.PESAPAL_BASE_URL;

// export async function getPesaPalAuthToken() {
//   const response = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       consumer_key: process.env.PESAPAL_CONSUMER_KEY,
//       consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
//     }),
//   });

//   const data = await response.json();
//   return data.token; // This token is valid for 5 minutes
// }

const BASE_URL = "https://cybqa.pesapal.com/pesapalv3"; // Sandbox URL for testing

export async function getPesaPalAuthToken() {
  const response = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }),
  });

  const data = await response.json();
  return data.token; 
}