// api/contact.js
export default function handler(request, response) {
  if (request.method === 'POST') {
    const data = request.body;
    console.log("Form Data Received:", data);

    // This sends a success response back to your script.js
    return response.status(200).json({ message: "Success! Data received." });
  } else {
    // Blocks any non-POST requests
    return response.status(405).json({ message: "Method not allowed" });
  }
}