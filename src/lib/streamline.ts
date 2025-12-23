// lib/streamline.ts
export async function streamlineRequest(methodName: string, params: any, retries = 3) {
    let lastError: any;

    for (let i = 0; i <= retries; i++) {
        try {
            if (i > 0) {
                const delay = Math.pow(2, i - 1) * 1000;
                console.log(`Retry attempt ${i} for ${methodName} after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            const res = await fetch('https://web.streamlinevrs.com/api/json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    methodName,
                    params: {
                        token_key: process.env.STREAMLINE_KEY,
                        token_secret: process.env.STREAMLINE_SECRET,
                        ...params
                    }
                })
            });

            if (!res.ok) {
                throw new Error(`Streamline API responded with status ${res.status}`);
            }

            return await res.json();
        } catch (error: any) {
            lastError = error;
            console.error(`Attempt ${i + 1} failed for ${methodName}:`, error.message);

            // Don't retry if it's not a timeout or network error (optional, but ETIMEDOUT should be retried)
            if (i === retries) break;
        }
    }

    throw lastError;
}
