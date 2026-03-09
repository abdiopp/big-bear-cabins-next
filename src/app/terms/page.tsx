import { ImageWithFallback } from "@/components/ImageWithFallback";

export default function Page() {
    return (
        <main className="min-h-screen bg-white overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <ImageWithFallback
                    src="https://res.cloudinary.com/dtqdflngh/image/upload/v1770838073/lyn5ilsj28ma6zzouw2f.jpg"
                    alt="Terms and Conditions"
                    className="w-full h-full object-cover object-[center_25%]"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <h1 className="text-white text-4xl md:text-6xl font-bold">
                        Terms and Conditions
                    </h1>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <article className="text-gray-700 leading-relaxed">
                    **Check-in Information:<br />
                    Check-in address and access details will be shared with the Reservation Holder once the rental agreement has been signed, and the home is ready. Check-in time is 4pm on the day of your arrival.<br />
                    Big Bear Vacations office is open Monday to Saturday between 9am and 6pm, and Sundays between 8am and 5pm, for any in person assistance you may need.: 41693 Big Bear Blvd, Big Bear Lake CA 92315.<br />
                    <br />
                    **Big Bear Vacations Rental terms:<br />
                    **Standard Check-in is at 4pm and Check-out is 10am** - <strong>For reservations made on the same day as check-in, the earliest check-in time is 6:00 PM.</strong><br />
                    Availability of the property prior to this time cannot be guaranteed. -&nbsp;Minimum Age Requirement of 21+ For All Reservations. - No addresses are given in advance until check-in time. - The government-issued ID MUST be valid and match both the Credit Card and Reservation Holder name. -&nbsp;The reservation holder must be on site and present to accept responsibility for the duration of your reservation stay. -<br />
                    <br />
                    Big Bear Vacations utilizes fraud prevention software within your rental agreement. For reservations failing any security check and requiring an in-person Check-in, the Reservation Holder MUST be present to provide the physical Credit Card and valid ID. - Any arrival that requires an after-hours check in at our office will be subject to a $50 fee and are only permitted to check in until 1am.<br />
                    <br />
                    If a later check out is desired and approved, additional charges may be incurred ranging from $30-$90. -<br />
                    If a late check-out has not been approved and you remain on the property past 10 AM without authorization, a $90 trespassing fee will be applied, and immediate eviction will take place. -<br />
                    <br />
                    During the winter season, delays may occur due to traffic and weather conditions. These delays may impact housekeeping schedules and access to the property.<br />
                    <br />
                    **Cancellation Policies:&nbsp;<br />
                    -Third Party reservations are subject to Third Party Cancellation policies.&nbsp;<br />
                    -Long Term Stays (Over 14 Days) will fall under Long Term Cancellation Policies which allow a cancellation with refund up to 30 Days prior to arrival. Long Term Stays are non-refundable once within 30 Days of Arrival.&nbsp;<br />
                    -Group Reservations (16+ People/More Than One Home) will fall under Group Cancellation Policies which allow a cancellation with refund up to 30 Days prior to arrival. Group Reservations are non-refundable once within 30 Days of Arrival. -<br />
                    **HOLIDAY RESERVATIONS** are non-refundable once within 30 days from arrival.<br />
                    -All other reservations under our Standard Cancellation Policy are fully refundable up to 14 days prior to arrival.<br />
                    Once within 13 days of arrival and up to 8 days from arrival, 50% of the reservation value will be refunded.<br />
                    Once 7 days from arrival, the reservation is nonrefundable.<br />
                    **State law requires a full refund for reservations canceled within 24 hours of booking, regardless of cancellation policy.<br />
                    <strong>This does not apply to last-minute bookings (made within 72 hours of check-in).** </strong><br />
                    **Requests for date changes will be held to the standard cancellation policy. If alterations are approved once, a second amendment will not be authorized.<br />
                    Please note that the cancellation policy will still apply based on your original reservation dates, not the new modified dates.<br />
                    This means that any refunds or non-refundable amounts will be determined by the original stay dates** -<br />
                    <br />
                    The home will be equipped with linens, bathroom towels, basic pots/pans and dishware.<br />
                    Starter amenities provided include dish soap, toilet paper, paper towels, trash bags, shampoo, conditioner, and body wash. -<br />
                    <br />
                    No Smoking inside any property. *($250 Fine) * -<br />
                    All dishes must be washed by the tenants prior to check-out. *($25/Per Load For Violation) * -<br />
                    Trash must be removed from the home upon departure due to the threat it poses to mountain critters. *($25/Per Bag for Violation) * -<br />
                    No events or parties resulting in over occupancy or noise violation at any home. *($250 Fine for Violation) * -<br />
                    <br />
                    EV Chargers/Charging Facilities- EV Charging Cables are not Supplied. If the home offers an EV charger the guest is responsible for bringing their own charger for use. Big Bear offers many charging locations for your vehicles in town. Unless your property is specifically equipped with a separate and advertised home charger for your vehicle it is unauthorized to plug in and charge your vehicle at any property. Failure to comply will result in fines for violations as well as any damage caused to the home's electrical including contracted work to fix any issues caused as a result of your plugging into the home's outlets of any kind. -<br />
                    <br />
                    Tenants will receive one key to the property via the property lockbox, which must be returned to the lockbox upon final departure. *($250 Fine for Violation) * -<br />
                    <br />
                    Any excessive cleaning, moved furniture, damages, or missing items will result in additional charges. -<br />
                    <br />
                    Big Bear is a mountain community located in a forest.<br />
                    Yards may or may not be groomed or weeded and forest wildlife may be found.<br />
                    Big Bear Vacations inspects every home prior to your arrival but cannot guarantee the home will be free of uninvited wildlife. -<br />
                    <br />
                    Any neighborhood violation leading to a CODE dispatch will incur a $250 fine from Big Bear Vacations, irrespective of any city or county violations that may also be applicable. -<br />
                    <br />
                    Pet Policy: Pets are welcome in <strong>Pet Friendly homes ONLY</strong> Pet Fees = $40/Pet Nightly Fee + Tax -<br />
                    All dogs on the property must be registered and acknowledged with the front desk -<br />
                    Animals may not be left unattended in the home at any time -<br />
                    Pet owners are responsible for cleanup of pets or are subject to an added cleaning fee. *($250 Fine for Violation) * -<br />
                    Service Animals Are Welcome!<br />
                    California Penal Code: (a) Any person who knowingly and fraudulently represents himself or herself, through verbal or written notice, to be the owner or trainer of any canine licensed as, to be qualified as, or identified as, a guide, signal, or service dog, shall be guilty of a misdemeanor punishable by imprisonment in the county jail not exceeding six month, by a fine not exceeding one thousand dollars ($1,000), or by both that fine and imprisonment. -Emotional support animals, comfort animals, and therapy dogs are not service animals under Title II and Title III of the ADA. -<br />
                    <br />
                    Snow is a desired mountain seasonal climate occurrence during the winter months.<br />
                    During the winter month’s driveways, steps, porches, decks and other outdoor areas at your property may not be accessible due to snow and/or ice.<br />
                    In winter months be prepared to have tire chains equipped on your vehicle, proper footwear is recommended.<br />
                    If tenants choose to manage their own snow removal Tenants are responsible for time and cost of snow removal during cabin stay and no credits will be issued due to inconvenience or issues.<br />
                    <br />
                    **NO REFUNDS** will be made for issues related to weather, road conditions, acts of nature, mechanical or electrical failure, malfunction of spa, TV, or other equipment, or other factors beyond our control. Interruptions to stay due to these issues will not be compensated.<br />
                    <br />
                    Big Bear Vacations reserves the right to offer a comparable property or issue a full refund if circumstances arise that are beyond our control and your property is made unavailable for ANY reason<br />
                    <br />
                    **Lost &amp; Forgotten Items** Big Bear Vacations is not responsible for any lost or forgotten items left behind by guests. If an item is reported and subsequently located, guests may request its return. A retrieval and processing fee starting at $30 will be required for shipping and handling. Additional costs may apply depending on the size, weight, and shipping destination. Big Bear Vacations will make a reasonable effort to locate lost items but cannot guarantee their recovery.<br />
                    <br />
                    **Guest Code of Conduct. **<br />
                    You are a guest of Big Bear Lake and staying in a Residential Area. You are expected to respect the neighborhood and those near you. The first call for disturbing the peace or exceeding the occupancy or number of cars will result in a $250.00 charge to the card the reservation was made under. Any call after that will result in ejection from the premises with no refund.<br />
                    <br />
                    RESPECT NEIGHBORHOOD TRANQUILITY. Disturbing the peace of the Residential Neighborhood you are occupying is a city ordinance violation. Please keep noise to a minimum, including children playing loudly, parties, and any loud noises between 9:00 pm and 8:00 am. House parties are not permitted and will result in immediate ejection from the premises with no refund. No outdoor spa use after 10:00P.M.<br />
                    <br />
                    ABIDE BY OCCUPANCY LIMITS. Each property is licensed to accommodate a maximum amount of people, DAY AND NIGHT. Overcrowding is dangerous, disrespectful, and illegal. Please do not exceed the designated amount.<br />
                    <br />
                    DISPOSE OF TRASH PROPERLY. "Clean Bear Sites" are available nearby all residential areas. These sites are funded by homeowners through local property taxes. Please take all household trash items to these sites; not doing so is disrespectful and a violation of the code of conduct.<br />
                    <br />
                    PARK CARS APPROPRIATELY. The Big Bear Lake Ordinance limits the number of cars parked at each property, and this number is displayed on a sign on each house. Parking more cars is a city ordinance violation. Please do not block streets or corners and keep all cars parked on driveways. During snow conditions, avoid large fines by not parking anywhere on the street and blocking snowplows.<br />
                    <br />
                    NO STREET PARKING. San Bernardino County Ordinance provides: (c) Parking. All vehicles of STR occupants and their guests must be parked on the STR property. Parking spaces may include garage, carport, and driveway spaces, and may allow for tandem parking. On-site parking areas shall be kept free from any obstructions, including, but not limited to, excessive amounts of snow, which would prevent use for vehicle parking. Only the approved parking areas/spaces pursuant to the STR permit shall be used for vehicle parking. No vehicle related to the STR shall be parked on neighboring properties or on public or private roads, or in any manner that would create an obstruction.<br />
                    <br />
                    <strong>Any violation of parking, nuisance, trash or disruptive conduct will result in a $1,000 fine for the first violation, $2,000 for the second and $5,000 for the third. Amounts for which will be charged to the credit card on file.</strong><br />
                    <br />
                    DO NOT DISPOSE OF ASHES FROM BBQ’S AND FIREPLACES. It is against Big Bear Vacations’ policy for guests to remove or dispose of Fireplace or BBQ ashes. Our Housekeeping Department will properly and safely dispose of all ashes. If you need ash removal, please contact our office. Any improper disposal on ashes will result in charges equal to the amount of the security deposit for this cabin.<br />
                    <br />
                    YOU ARE RESPONSIBLE FOR YOUR GUESTS WHILE AT THE PROPERTY AND MUST INFORM YOUR GUEST OF THE COUNTY REQUIREMENTS RELATING TO PARKING, NOISE, TRASH AND NUISANCE. ANY VIOLATION OF THIS CODE OF CONDUCT BY ANYONE IN YOUR PARTY WILL RESULT IN IMMEDIATE CHARGE AND/OR EJECTION OF EVERYONE WITHOUT ANY REFUND AND COULD INCLUDE ADDITIONAL CITY OR COUNTY IMPOSED FINES OR OTHER SANCTIONS.<br />
                    You understand that you are responsible for your conduct and that of your guests while at the Property. Furthermore, you are responsible for the care of the property and respect for our neighbors. Failure to abide by the rules laid out herein, or with city or county laws, may result in termination of your rental agreement without refund. Furthermore, should you fail to leave when asked by Big Bear Vacations you will be considered a trespasser and law enforcement will be called to remove you from the property.<br />
                    &nbsp;



                </article>
            </section>
        </main>
    );
}