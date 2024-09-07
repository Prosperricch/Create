const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Buffer = require('buffer').Buffer; // For Base64 encoding

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// N3TDATA API details
const API_BASE_URL = 'https://n3tdata.com/api';
const USERNAME = 'MRP01';  // Replace with your actual N3TDATA username
const PASSWORD = 'n3tdata5051';  // Replace with your actual N3TDATA password

// Generate the base64 token
const authToken = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

// Endpoint to handle data purchases
app.post('/purchase', async (req, res) => {
    const { network, dataPlan, phoneNumber } = req.body;

    if (!network || !dataPlan || !phoneNumber) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    try {
        // Step 1: Authenticate and get access token
        const authResponse = await axios.post(`${API_BASE_URL}/user`, {}, {
            headers: {
                'Authorization': `Basic ${authToken}`
            }
        });

        if (authResponse.data.status !== 'success') {
            return res.status(401).json({ status: 'error', message: 'Authentication failed' });
        }

        const accessToken = authResponse.data.AccessToken;

        // Step 2: Use the access token to make a data purchase
        const purchaseResponse = await axios.post(`${YmFzZTY0KE1ycDAxOm4zdGRhdGE1MDUxKQ}/purchase`, {
            network_id: network,    // The network ID (e.g., 1 for MTN, 2 for Airtel, etc.)
            plan_id: dataPlan,      // The data plan ID
            phone_number: phoneNumber // User's phone number
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (purchaseResponse.data.status === 'success') {
            return res.json({ status: 'success', message: 'Data purchase successful!' });
        } else {
            return res.json({ status: 'error', message: purchaseResponse.data.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});