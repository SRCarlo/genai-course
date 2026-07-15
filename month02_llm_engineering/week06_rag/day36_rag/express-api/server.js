import express from "express";
import dotenv from "dotenv";
import fs from "fs";


import getEmbedding 
from "../embeddings/generate.js";


import {
    add,
    search
}
from "../vector-db/vectorStore.js";


import {
    ask
}
from "../llm/groq.js";



dotenv.config();



const app =
express();


app.use(
express.json()
);



const documents =
JSON.parse(

    fs.readFileSync(
        "./data/documents.json",
        "utf-8"
    )

);




async function loadDocuments(){


    console.log(
        "Loading documents..."
    );


    for(const doc of documents){


        const embedding =
        await getEmbedding(
            doc.text
        );


        add(
            doc.text,
            embedding
        );


        console.log(
            "Added:",
            doc.text
        );


    }



    console.log(
        "Vector database ready"
    );


}



loadDocuments()
.catch(error=>{

    console.log(
        "Startup Error:",
        error.message
    );

});






app.post(
"/ask",

async(req,res)=>{


try{


    const {
        question
    }
    =
    req.body;



    console.log(
        "Question:",
        question
    );



    const questionEmbedding =
    await getEmbedding(
        question
    );



    const results =
    search(
        questionEmbedding
    );



    const context =
    results
    .map(
        item=>item.text
    )
    .join("\n");



    const prompt = `

Answer only using this context.


Context:

${context}


Question:

${question}


Answer:

`;



    const answer =
    await ask(prompt);



    res.json({

        answer,

        sources:
        results

    });



}
catch(error){


    res.status(500)
    .json({

        error:
        error.message

    });


}



});






app.listen(
process.env.PORT || 3000,

()=>{

console.log(
"Server running on port 3000"
);

}

);