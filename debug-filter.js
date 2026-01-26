
async function test() {
    try {
        console.log('--- Test 1: id: 89614 (Expect failure/random result if ignored) ---');
        const res1 = await fetch('http://localhost:3000/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 89614 })
        });
        const data1 = await res1.json();
        console.log('Result 1 Property ID:', data1.data?.property?.[0]?.id);

        console.log('\n--- Test 2: unit_id: 89614 (Expect match if supported) ---');
        const res2 = await fetch('http://localhost:3000/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ unit_id: 89614 }) // Try unit_id param
        });
        const data2 = await res2.json();
        console.log('Result 2 Property ID:', data2.data?.property?.[0]?.id);

        console.log('\n--- Test 3: unit_ids: [89614] (Expect match if supported) ---');
        const res3 = await fetch('http://localhost:3000/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ unit_ids: [89614] }) // Try unit_ids param
        });
        const data3 = await res3.json();
        console.log('Result 3 Property ID:', data3.data?.property?.[0]?.id);

        console.log('\n--- Test 4: Full User Payload with id 89614 ---');
        // This is what failed for the user (returned empty)
        const payload = {
            id: 89614,
            show_rooms: 1,
            location_variables: { "variable": { "value": "4x2 14", "name": "Air Filters" } },
            variables: { "variable": { "value": 1, "name": "Towels" } },
            additional_field: { "value": "Grey", "name": "Tiles" },
            owning_type_id: 1,
            status_id: 1,
            return_owning_startdate: 1,
            return_owner_id: 1
        };
        const res4 = await fetch('http://localhost:3000/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data4 = await res4.json();
        console.log('Result 4 Length:', data4.data?.property?.length || 0);
        if (data4.data?.property?.length > 0) {
            console.log('Result 4 ID:', data4.data.property[0].id);
        }

    } catch (e) {
        console.error(e);
    }
}
test();
