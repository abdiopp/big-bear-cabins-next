// lib/streamline.ts
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

export async function streamlineRequest(methodName: string, params: any, retries = 3) {
    let lastError: any;

    // Create the proxy agent if FIXIE_URL is present (provided by Fixie integration)
    const proxyUrl = process.env.FIXIE_URL;
    const httpsAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

    for (let i = 0; i <= retries; i++) {
        try {
            if (i > 0) {
                const delay = Math.pow(2, i - 1) * 1000;
                console.log(`Retry attempt ${i} for ${methodName} after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            const response = await axios.post('https://web.streamlinevrs.com/api/json', {
                methodName,
                params: {
                    token_key: process.env.STREAMLINE_KEY,
                    token_secret: process.env.STREAMLINE_SECRET,
                    ...params
                }
            }, {
                httpsAgent,
                proxy: false, // Tells axios to use the agent, not its internal proxy logic
                timeout: 10000 // 10 second timeout
            });

            return response.data;
        } catch (error: any) {
            lastError = error;
            console.error(`Attempt ${i + 1} failed for ${methodName}:`, error.message);

            // If it's a 4xx error (except maybe 429), it might not be worth retrying
            if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 429) {
                break;
            }

            if (i === retries) break;
        }
    }

    throw lastError;
}
