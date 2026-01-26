
async function test() {
    try {
        console.log('Fetching Info for 89614...');
        const res = await fetch('https://web.streamlinevrs.com/api/json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                methodName: 'GetPropertyInfo',
                params: {
                    token_key: 'd5f834dbfb09d743b601e2ae534cc2a4',
                    token_secret: 'd9d72cddfc270e112f7cf208f142af982bcc7317', // Attempt using provided (might fail), if so fallback to system
                    unit_id: 89614
                }
            })
        });
        const data = await res.json();

        // If provided token fails, use system flow via local API which uses system token
        if (data.status?.code === 'E0015' || data.status?.code === 'E0012') {
            console.log('Token failed, trying via local API (GetPropertyInfo wrapper? No wrapper in route yet, checking gallery)');
            // We don't have a GetPropertyInfo route yet, so let's mock the internal call logic or use a system token directly if known?
            // Actually, I can use the debug script to call the logic directly if I import it... 
            // But simpler: just run the node script using the system token if I can find it. 
            // System token is in database. `streamline-token.ts` logic fetches it.
            // I'll assume for now I can't read DB directly easily without prisma setup in script.
            // I'll try to guess/use a working token or use the route.

            // Wait, I can modify `route.ts` or make a temporary route to get info?
            // Or better: Use `GetPropertyGalleryImages` which IS working and might return *some* property info in the `property` field?
            // Step 127 output showed: `89613 Gallery: {"data":{"image":[...]`
            // It didn't look like it had full property info.

            console.log('Access blocked. I need system token.');
        } else {
            console.log('Info 89614:', JSON.stringify(data, null, 2).substring(0, 2000));
        }

    } catch (e) {
        console.error(e);
    }
}
test();
