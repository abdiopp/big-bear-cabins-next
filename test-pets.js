const fs = require('fs');
(async () => {
    const res = await fetch('http://localhost:3001/api/properties', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ page: 1 }) // Get all properties
    });
    const data = await res.json();
    const props = data.data?.property || [];
    console.log(`Total properties: ${props.length}`);
    if (props.length > 0) {
        console.log("Sample property keys:", Object.keys(props[0]));
        console.log("Sample pets field:", props[0].pets);
        const petProps = props.filter(p => parseInt(p.pets) > 0 || String(p.pets).toLowerCase() === 'yes' || String(p.pets) === '1');
        console.log(`Properties matching pet condition: ${petProps.length}`);
    }
})();
