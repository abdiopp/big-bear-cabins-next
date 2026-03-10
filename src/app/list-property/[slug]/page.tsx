import { notFound } from "next/navigation";
import ContentShow from "@/components/ContentShow";
import { ReactNode } from "react";
import Link from "next/link";
import heroImage1 from "../../../assets/management-hero1.jpg";
import heroImage2 from "../../../assets/management-hero2.jpg";
import heroImage3 from "../../../assets/management-hero3.jpg";

type Area = {
    title: string;
    description: ReactNode;
    heroImage: string;
};

const areas: Record<string, Area> = {
    "choosing-your-property": {
        heroImage: heroImage1.src,
        title: "How to Choose Your Property Management Company",
        description: (
            <div className="space-y-5 text-gray-700 leading-relaxed">
                <p>
                    Choosing a property management company to take care of your hard-earned vacation cabin can be difficult if you do not know where to look. Avoid the hassle of taking care of your property on your own and employee a property management company that values your home and can give you peace of mind. Here is how you should choose your property management <strong>Big Bear Lake California</strong> company:
                </p>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Find a Company That is Qualified</h2>
                    <p>You can easily find horror stories online of property management companies that come in and make your home a wreck. They often employ unqualified and untrained staff members who have no idea what they are doing. This is not a personalized experience, and you can avoid this happening to you by choosing a property management company that provides a team of trained and highly qualified individuals who have experience with providing the top level of service to your home.</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Extensive Cleaning and Repair</h2>
                    <p>Second, you want to make sure you find a property management company that provides year-round extensive cleaning and repair of your home. No one will want to rent out your rental cabin if it is in poor condition. Your rental property will be in immaculate condition with a highly qualified property management company that will have the renters keep on coming back, earning you additional revenue.</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Choosing Local Property Management Companies in Big Bear
                    </h2>
                    <p>Finally, finding a local <strong>property management Big Bear Lake California</strong> company makes it so easy for property to be maintained. Someone can quickly get to your home if there are ever any reported concerns. When choosing the bigger-named companies, you may have to wait for hours or even days for your property to be checked on; that does not sound like great customer service to us.</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Big Bear Property Management Services</h2>
                    <p>If highly qualified and trained staff, extensive cleaning and repair services, and having a local property management sound great to you, look no further than our <strong> property management big bear lake California</strong> services. We have been providing property management services for years in the Big Bear Lake area with tremendous customer satisfaction. We also have insider knowledge of the area that can showcase the benefits of your property that will keep on encouraging guests to return. Our <Link href="/contact-us" className="text-cyan-600 hover:underline">communication</Link>  is top notch, so you are never the dark about any potential services that have been done or are recommended. See what Big Bear Cabins can do for you!</p>
                </div>
            </div>
        ),
    },

    "5-things-to-look": {
        heroImage: heroImage2.src,
        title: "5 Things You Should Look for in Your Property Management Company",
        description: (
            <div className="space-y-5 text-gray-700 leading-relaxed">
                <p>
                    Not every property management company is the same. Not all property management companies treat their clients with respect and dignity. When looking for a property management company, there are a few things you need to consider. Here are five things you need to look for when choosing a <strong>Big Bear Lake property management</strong> company:
                </p>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Qualified and Experienced</h2>
                    <p>First, you need to find a property management company that is highly qualified and experienced. Choosing a company that is not puts you at risk for potential setbacks that can reduce the amount of traffic your property gets, in turn reducing your income.
                    </p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Extensive Services</h2>
                    <p>When choosing a <strong>property management in Big Bear Lake California</strong> company, make sure you choose one that provides an extensive list of services to your property. If only the bare minimum is done, your property may not be ready for the heavy traffic times of high peak seasons. In order to ensure guests will return, your property needs to be in tip-top shape.</p>                    </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Guarantee of Returning Guests
                    </h2>
                    <p>As mentioned, making sure your property is thoroughly looked after can help increase guest returns for future seasons. Pick a property management company that has history of providing increased traffic to its serviced clients. By choosing one of these companies, you can be in safe hands knowing you have a more likely chance for future revenue.</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Find Local</h2>
                    <p>Making sure your property management company is local will be a lifesaver in case anything happens to your property. If a concern is reported, local companies can quickly get to your home. Big name companies and non-local companies are unable to provide that kind of service and may take hours or days to reach your property. Do not risk that happening to you.</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Insider Knowledge</h2>
                    <p>When choosing local, you are choosing a company that has insider knowledge of the area around your property. They are able to provide local tips to guests about all the exciting attractions and activities in the area. Having that kind of insider information will help your guests have the best vacation and encourage them to return for future adventures. If your <strong> Big Bear Lake property management</strong> company does not offer this, then what are they really offering you?</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Choosing Property Management in Big Bear Lake California Services</h2>
                    <p>Our property management services provide all five of these key details in property management. We know the <Link href="/contact-us" className="text-cyan-600 hover:underline">Big Bear</Link> region like the back of our hand and have provided top level services for years. Give us a call today to see how we can maintain your property and drive up guest visits.

                    </p>
                </div>
            </div>
        ),
    },

    "the-best-property-management": {
        heroImage: heroImage3.src,
        title: "What Makes Big Bear Cabins the Best Property Management Company",
        description: (
            <div className="space-y-5 text-gray-700 leading-relaxed">
                <p>It can be a long, drawn out search if you do not know where to look for a decent property management company. Avoid the bottomless online search and see what Big Bear Cabins property management services can offer you! Our property management services are second to none and have been provided to residents of the Big Bear community for years. Each year we receive tons of positive feedback and are always looking to add additional clients to our fold. Here is what makes Big Bear Cabins the best option for <strong> property management in Big Bear</strong>:</p>

                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Highly Qualified and Trained Property Management in Big Bear
                    </h2>
                    <p>You will not find a more highly qualified and trained property management staff than the employees we have here at Big Bear Cabins. Our team is experienced in providing personalized treatment to your property based on what it needs. You will not find a one-size-fits-all approach with our staff; we treat your property like our very own homes.</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Personalized Services</h2>
                    <p>No two properties are the same, and many will need specialized services. As mentioned, our highly-trained staff can provide an individual cleaning and repair service to make sure your property is in the best of shape. Our maintenance services also make sure nothing happens to your property while you are gone and that it receives annual maintenance services that all homes need to stay in top condition. You will not find a more thorough approach to maintenance services than with Big Bear Cabins’ property management.</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">We’re Local</h2>
                    <p>Big Bear Cabins is located right in the heart of Big Bear, so if anything happens to your property, we will be there in a moment’s notice. You cannot find that kind of service from big name companies or property management services outside of town. Keep things local and let us do the heavy lifting in your property management in Big Bear, CA by looking after your property while you are away.</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-medium text-black">Insider Knowledge</h2>
                    <p>Big Bear Cabins is a local company, and being permanent residents of Big Bear, we have insider knowledge that many of the annual visitors will not have when they arrive. By providing this insider knowledge, we are promoting the perfect vacation for your guests and encouraging them to return for future adventures. We do not just hand out pamphlets, but personally tell our guests through blogs how and where they can find things off the beaten path. You will not find a better Big Bear Lake <Link href="/list-property" className="text-cyan-600 hover:underline">property management</Link> company than Big Bear Cabins!</p>
                </div>
            </div>
        ),
    },
};

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const area = areas[slug];

    if (!area) return notFound();

    return (
        <ContentShow
            title={area.title}
            description={area.description}
            image={area.heroImage}
        />
    );
}