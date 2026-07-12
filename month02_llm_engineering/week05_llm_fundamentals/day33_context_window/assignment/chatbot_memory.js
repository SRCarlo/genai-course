import express from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import fs from "fs";


dotenv.config({
    path:"../.env"
});


const app = express();

app.use(express.json());


const groq = new Groq({

    apiKey: process.env.GROQ_API_KEY

});


// Load old memory if file exists

let messages = [

    {
        role: "system",
        content: "You are an AI mentor."
    }

];


if (fs.existsSync("chat-history.json")) {

    messages = JSON.parse(
        fs.readFileSync(
            "chat-history.json",
            "utf-8"
        )
    );

}


// Save memory function

function saveMemory() {

    fs.writeFileSync(
        "chat-history.json",
        JSON.stringify(messages, null, 2)
    );

}


// Sliding Window

function limitMemory() {

    if (messages.length > 11) {

        messages.splice(1, 2);

    }

}


// Chat Endpoint

app.post("/chat", async (req, res) => {


    try {


        const { message } = req.body;


        if (!message) {

            return res.status(400).json({

                error: "Message is required"

            });

        }


        // Add user message

        messages.push({

            role: "user",

            content: message

        });



        const response =
            await groq.chat.completions.create({

                model: "llama-3.3-70b-versatile",

                messages

            });



        const reply =
            response.choices[0].message.content;



        // Add AI response

        messages.push({

            role: "assistant",

            content: reply

        });



        // Keep only recent messages

        limitMemory();



        // Save conversation

        saveMemory();



        res.json({

            reply,

            totalMessages: messages.length

        });



    } catch (error) {


        res.status(500).json({

            error: error.message

        });


    }


});



// Reset Endpoint

app.post("/reset", (req, res) => {


    messages = [

        {
            role: "system",
            content: "You are an AI mentor."
        }

    ];


    saveMemory();


    res.json({

        message: "Conversation reset successfully"

    });


});



// Start server

app.listen(3001, () => {


    console.log(
        "Assignment chatbot running on port 3001"
    );


});