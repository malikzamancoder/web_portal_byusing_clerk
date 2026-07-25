 import React, { useState } from 'react'
import axios from 'axios'


const Chatbot = () => {
    const [query, setQuery] = useState()
    const [response, setResponse] = useState("")

    const handleChange = (e) => {
        setQuery(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": `You are an expert AI Scientist only answer to AI Queries and refuse to answer any other query just say "I Don't have knowledge about that "`
                            },
                            {
                                "text": `User query : ${query}`
                            }
                        ]
                    }
                ]
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": "AIzaSyBd89v2DDyfus0k9uYsm_ctcyMAR9BO4PQ"
                }
            })

            setResponse(res.data.candidates[0].content.parts[0].text)
        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                {response}
            </div>
            <div>
                <label htmlFor="query">Query</label>
                <input type="text" name="query" id="query" onChange={handleChange} />
            </div>

            <div>
                <button type="submit">Send</button>
            </div>
        </form>
    )
}

export default Chatbot;