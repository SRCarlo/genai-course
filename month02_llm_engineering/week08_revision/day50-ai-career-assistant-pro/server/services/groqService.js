import Groq from "groq-sdk";


const getGroqClient = () => {

    return new Groq({

        apiKey: process.env.GROQ_API_KEY

    });

};



export const generateAIResponse = async(
    systemPrompt,
    userPrompt
)=>{

    const groq = getGroqClient();


    const completion =
    await groq.chat.completions.create({

        model:"llama-3.1-8b-instant",

        messages:[

            {
                role:"system",
                content:systemPrompt
            },

            {
                role:"user",
                content:userPrompt
            }

        ],

        temperature:0.3,

        response_format:{
            type:"json_object"
        }

    });


    return JSON.parse(
        completion.choices[0]
        .message.content
    );

};