const store = [];



export function add(text, embedding){


    store.push({

        text,

        embedding

    });


}



export function getAll(){

    return store;

}




export function search(queryEmbedding, topK = 3){


    const results =
    store.map(item => {


        return {

            text:item.text,

            score:
            cosineSimilarity(
                queryEmbedding,
                item.embedding
            )

        };


    });



    return results
    .sort(
        (a,b)=>b.score-a.score
    )
    .slice(0,topK);


}




function cosineSimilarity(a,b){


    let dot = 0;

    let normA = 0;

    let normB = 0;



    for(let i=0;i<a.length;i++){


        dot += a[i] * b[i];


        normA += a[i] * a[i];


        normB += b[i] * b[i];


    }



    return dot /
    (
        Math.sqrt(normA)
        *
        Math.sqrt(normB)
    );


}