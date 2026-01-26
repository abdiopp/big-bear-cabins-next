
async function test() {
    try {
        console.log('Fetching GetPropertyInfo for 89613 (known valid)...');
        // We use 89613 because we know it works with system token, to see structure
        const res = await fetch('http://localhost:3000/api/debug', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: 'GetPropertyInfo',
                unit_id: 89613
            })
        });
        const data = await res.json();
        console.log('Structure 89613:', JSON.stringify(data, null, 2).substring(0, 500));

        console.log('Fetching GetPropertyInfo for 89614...');
        const res2 = await fetch('http://localhost:3000/api/debug', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: 'GetPropertyInfo',
                unit_id: 89614
            })
        });
        const data2 = await res2.json();
        console.log('Structure 89614:', JSON.stringify(data2, null, 2).substring(0, 500));

    } catch (e) {
        console.error(e);
    }
}
test();
