import axios from "axios";

async function testAPI() {
  try {
    const response = await axios.post("http://localhost:3000/api/chat", {
      prompt: "Explain Node.js in simple terms.",
    });

    console.log("AI Response:");
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

testAPI();
