
(async () => {
    try {
        const res = await fetch('http://localhost:3001/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: 1 })
        });
        const data = await res.json();
        const props = data.data?.property || [];
        console.log(`Total properties: ${props.length}`);
        if (props.length > 0) {
            console.log("Sample property keys:", Object.keys(props[0]));
            console.log("Sample pets field:", props[0].pets);
            const petProps = props.filter(p => parseInt(p.pets) > 0 || String(p.pets).toLowerCase() === 'yes' || String(p.pets) === '1');
            console.log(`Properties matching pet condition: ${petProps.length}`);

            // Check amenities for pets
            const petAmenity = props[0].unit_amenities?.amenity?.find(a => a.amenity_id === 94376 || a.amenity_name?.toLowerCase().includes('pet'));
            console.log("Sample property pet amenity:", petAmenity);

            // How many have the pet amenity?
            const withPetAmenity = props.filter(p => {
                let amenities = p.unit_amenities?.amenity;
                if (!amenities) return false;
                if (!Array.isArray(amenities)) amenities = [amenities];
                return amenities.some(a => a.amenity_id === 94376 || a.amenity_name?.toLowerCase().includes('pet'));
            });
            console.log(`Properties with pet amenity: ${withPetAmenity.length}`);
        }
    } catch (e) {
        console.error(e);
    }
})();
