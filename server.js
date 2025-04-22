const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));  // Add bodyParser to handle large images

app.post("/analyze", async (req, res) => {
    const imageBase64 = req.body.image;  // Get the base64 image from the request body

    if (!imageBase64) {
        return res.status(400).send("No image provided");
    }

    try {
        // Make the POST request to Hugging Face's API with the image file
        const response = await fetch("https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification", {
            method: "POST",
            headers: {
                "Authorization": `Bearer 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`,  // Replace with your actual API key
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: imageBase64 })  // Send the base64 image in the request body
        });

        // Check for a successful response
        if (!response.ok) {
            console.error("Error:", response.status, response.statusText);
            return res.status(response.status).send(response.statusText);
        }

        // Parse the JSON response
        const result = await response.json();
        console.log(result);  // Log the result for inspection

        res.json(result);  // Send the result back to the client
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
