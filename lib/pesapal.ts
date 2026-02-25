// // const BASE_URL = process.env.PESAPAL_BASE_URL;

// // export async function getPesaPalAuthToken() {
// //   const response = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({
// //       consumer_key: process.env.PESAPAL_CONSUMER_KEY,
// //       consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
// //     }),
// //   });

// //   const data = await response.json();
// //   return data.token; // This token is valid for 5 minutes
// // }

// const BASE_URL = "https://cybqa.pesapal.com/pesapalv3"; // Sandbox URL for testing

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
//   console.log("data", data);
//   return data.token;
// }

// lib/pesapal.ts

const BASE_URL =
  process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3";

export async function getPesaPalAuthToken() {
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("Missing PesaPal API Keys in .env.local");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      }),
    });

    const data = await response.json();

    if (data.status !== "200" && data.status !== 200) {
      console.error("PesaPal Auth Error:", data);
      throw new Error(data.message || "Authentication failed");
    }

    return data.token;
  } catch (error) {
    console.error("PesaPal Auth Request Failed:", error);
    throw error;
  }
}

export async function registerIPN(token: string) {
  const ipnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/pesapal/ipn`;

  try {
    const response = await fetch(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: "GET",
      }),
    });

    const data = await response.json();

    if (data.status !== "200" && data.status !== 200) {
      console.error("IPN Registration Error:", data);
      throw new Error(data.message || "IPN Registration Failed");
    }

    return data.ipn_id;
  } catch (error) {
    console.error("IPN Registration Request Failed:", error);
    throw error;
  }
}

export async function getTransactionStatus(
  token: string,
  orderTrackingId: string,
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get Transaction Status Failed:", error);
    throw error;
  }
}
