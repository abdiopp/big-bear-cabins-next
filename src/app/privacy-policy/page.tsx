import { ImageWithFallback } from "@/components/ImageWithFallback";
import heroImage from "../../assets/privacy-policy-hero.png";
export default function Page() {
    return (
        <main className="min-h-screen bg-white overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <ImageWithFallback
                    src={heroImage.src} alt="Privacy Policy"
                    className="w-full h-full object-cover object-center"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <h1 className="text-white text-4xl md:text-6xl font-bold">
                        Big Bear Resorts Inc DBA Big Bear Vacations Privacy Policy

                    </h1>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="space-y-3 text-gray-700 leading-relaxed">
                    <p>This Privacy Policy applies to the website accessible at https://bigbearcabins.com, (“Website”) the services and the mobile applications offered by Big Bear Resorts Inc, DBA Big Bear Vacations, a register California Corporation (the “Company”). The Company may also be referred in this Privacy Policy as “we”, “us”, or “our”. This Privacy Policy describes how the Company collects and uses personal information collected through the Website or through your correspondence with us by phone, email or otherwise. By accessing or using the Website or our services, you agree to this Privacy Policy. IF YOU DO NOT AGREE TO THIS PRIVACY POLICY, DO NOT ACCESS OUR WEBSITE OR USE OUR SERVICES.</p>
                    <p>For purposes of the General Data Protection Regulation 2018 (“GDPR”), the data controller is Big Bear Resorts Inc, DBA Big Bear Vacations, 41693 Big Bear Blvd, Big Bear Lake, CA 92315.</p>
                    <div className="">
                        <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Information We Collect About You</h2>
                        <p className="mb-3">We adhere to ethical standards in gathering, using and safeguarding any information you provide. We collect personal information from you. Such information is collected when voluntarily submitted to us by you through access to the Website or filling out a form on the Website. The types of information that may be collected include your name, mailing address, email address, phone number, usage information, including the materials that you access on the Website and messages that you send through our online contact form.</p>
                        <p>We may automatically collect information from you each time you visit the Website. This includes technical information, information about your visit, and information about your activity on our Website such pages viewed, page response times, download errors, length of visit to certain pages, page interaction information (such as scrolling, clicks and mouseovers), methods to browse to and away from a page, and methods used to contact our support team. Technical information may also include the internet protocol address used to connect your computer to the Internet, browser type and version, time zone setting, browser plug-in types and versions, operating systems and device platform.</p>
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Information We Receive From Other Sources</h2>
                        <p>This is information we receive about you from third parties that we work closely with to provide, promote and improve our services. These third parties include business and integration partners, vendors who assist in technical and payment services, analytics providers and search information providers.</p>
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">How We Collect Information</h2>
                        <p>We collect information from you when you submit inquiries through our online contact form. We also use technology to collect information from you.</p>
                        <p className="my-2!">We collect information from you when you speak to us by telephone. We may record telephone conversations for quality assurance purposes. This Privacy Policy also governs those recordings.</p>
                        <p>Cookies are small files that a site or its service provider transfers to your computer’s hard drive through your Web browser that enables the sites or service providers’ systems to recognize your browser and capture and remember certain information. We do not link the information we store in cookies to any personal information you submit while on our site. We use both session ID cookies and persistent cookies. A session ID cookie expires when you close your browser. A persistent cookie remains on your hard drive for an extended period of time.</p>
                        <p>We use the following types of cookies: <strong>&nbsp;</strong></p>
                    </div>
                    <div>
                        <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Strictly Necessary Cookies.</h4>
                        <p>These are cookies that are required for the operation of the Website and under our terms with you. They include, for example, cookies that enable you to log into secure areas of the Website, use a shopping cart or make use of e-billing services. <strong>&nbsp;</strong></p>
                    </div>
                    <div>
                        <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Analytical/Performance Cookies.</h4>
                        <p>They allow us to recognize and count the number of visitors and to see how visitors move around the Website. This helps us improve the way the Website works. <strong>&nbsp;</strong></p>
                    </div>
                    <div>
                        <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Functionality Cookies.</h4>
                        <p>These are used to recognize you when you return to the Website. This enables us, subject to your choices and preferences, to personalize our content and remember your preferences. <strong>&nbsp;</strong></p>
                    </div>
                    <div>
                        <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Targeting Cookies.</h4>
                        <p>These cookies record your visit to the Website, the pages you have visited and the links you have followed. We use this information to make the Website more relevant to your interests.</p>
                    </div>
                    <p>This Website also includes certain components transmitted by Google Analytics, a web traffic analysis service provided by Google, Inc. (“Google”). Also in this case, they are third party cookies collected and managed anonymously to monitor and improve the performance of the Website. Google Analytics uses the cookies to collect and analyze anonymously the information on the behavior of use of the website. This information is collected by Google Analytics, which processes in order to prepare reports for the Company regarding activities on the Website. This Website doesn’t use the analysis tool of Google to track or collect personal information.</p>
                    <p>We use the following web beacon technology:</p>
                    <p>Web beacons (a.k.a. clear gifs) are tiny graphics with a unique identifier, similar in function to cookies, which are used on our website to track online movements of web users and compile aggregated statistics to analyze how our site is used and may be used, in our services, or in our emails. Our use of Web beacons also includes to count visits and to tell if an email has been opened and acted upon. We do not link the information gathered from web beacons to any personal information.</p>
                    <p>As is true of most web sites, we gather certain information and store it in log files. This information includes internet protocol (IP) addresses, browser type, internet service provider (ISP), referring/exist pages, operating system, date/time stamp, and clickstream data. We use this information to analyze trends, to administer the site, to track users’ movements around the site and to gather demographic information about our user base as a whole. We do not link this data to personal information.</p>
                    <p>You have a variety of tools to control cookies, web beacons and similar technologies, including browser controls to block and delete cookies and controls from some third-party analytics service providers to opt out of data collection through web beacons and similar technologies.</p>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Children</h2>
                        <p>We do not knowingly collect information from anyone under the age of 16.</p>
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Social Media Widgets</h2>
                        <p>Our Website includes Social Media Features (“Features”), such as the Facebook Like button and Widgets, such as the Twitter button, Share This button, or other interactive mini-programs that run on our site. These Features may collect your IP address, which page you are visiting on our site, and may set a cookie to enable the Feature to function properly. Features and Widgets are either hosted by a third party or hosted directly on our site. Your interactions with these Features are governed by the privacy policy of the company providing it.</p>
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Use of Information</h2>
                        <p>Company uses information, including personal information, to carry out the following purposes: <strong>&nbsp;</strong></p>
                    </div>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Meeting our Obligations to You.</h4>
                    <p>We may use your personal information to contact you at your request to provide further information about our products and services. We may also contact you to carry out our obligations of delivering or supporting contracted services or products to you. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Improving and Maintaining the Website.</h4>
                    <p>Company may collect and use personal information to investigate any customer service issues that you or other users notify us about. We may use your IP address and other information collected from you to help diagnose problems with our server(s), create new functionality and to improve and administer the Website. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Improving and Developing Products and Services.</h4>
                    <p>We may use your personal information to improve and develop products or services offered. We may also use aggregated and anonymized information to assist us in providing the best service possible to our customers. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Communicating with You.</h4>
                    <p>We may collect and use personal information to inform you about new features of our software and advise you of offers that you may be interested in. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Marketing the Website and Our Services.</h4>
                    <p>Additionally, we may use aggregated and anonymized information for marketing purposes such as generating or selling advertisements.</p>
                    <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Disclosure of Your Information to Third-Parties</h2>
                    <p>We will not sell your personal information to third parties for the purpose of such third parties’ sending unsolicited offers or advertisements. However, we may disclose your personal information as follows: <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Law Enforcement.</h4>
                    <p>We may need to share your information with law enforcement or government agencies in response to a subpoena, state and/or federal audit or as otherwise required by law. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Agents and Consultants.</h4>
                    <p>We sometimes hire other companies to perform certain business-related functions, such as sending email on our behalf, payment processing or conducting market research.</p>
                    <p>We also share your email address with third parties, such as Facebook, LinkedIn and Twitter in order to provide custom marketing materials for you on their platforms. These companies are not permitted to use any personal information that we share with them for any other purpose aside from providing services to us. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Business Transfers.</h4>
                    <p>In the event that we sell all or part of our membership interests or assets or enter into a merger, we reserve the right to include personal information and non-personal information among assets transferred to the acquiring or surviving company. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">General Marketing Purposes.</h4>
                    <p>We may provide non-personal information about our customers’ sales, Website traffic patterns and related Website information to third party advertisers.</p>
                    <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Your Rights</h2>
                    <p>In accordance with applicable privacy law, you have the following rights in respect of your personal information that we hold: <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Right of Access and Portability.</h4>
                    <p>The right to obtain access to your personal information along with certain information, and to receive that personal information in a commonly used format and to have it ported to another data controller. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Right to Rectification.</h4>
                    <p>The right to obtain rectification of your personal information without undue delay where that personal information is inaccurate or incomplete. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Right to Erasure.</h4>
                    <p>The right to obtain the erasure of your personal information without undue delay in certain circumstances, such as where the personal information is no longer necessary in relation to the purposes for which it was collected or processed. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Right to Restriction.</h4>
                    <p>The right to obtain the restriction of the processing undertaken by us on your personal information in certain circumstances, such as where the accuracy of the personal information is contested by you, for a period enabling us to verify the accuracy of that personal information. <strong>&nbsp;</strong></p>
                    <h4 className="text-xl sm:text-[20px] font-medium mb-2 text-black">Right to Object.</h4>
                    <p>The right to object, on grounds relating to your particular situation, to the processing of your personal information, and to object to processing of your personal information for direct marketing purposes, to the extent it is related to such direct marketing.</p>
                    <p>You have the right to request that we do not process your personal information for marketing purposes. You can exercise your right to prevent such processing by using the “Unsubscribe” link found in our emails or by contacting us at 877-417-6504 or reservations@bigbearvacations.com. Please note that we may not include the opt-out information in e-mails that are transactional in nature and are not marketing communications.</p>
                    <p>If you are a California resident, California law permits you to request certain information regarding the disclosure of your personal information by us and our subsidiaries to third parties for the third parties’ direct marketing purposes. To make such a request, please use the contact information above.</p>
                    <p>You may exercise your rights via telephone or email. Please call 877-417-6504 to review, change or correct information or email a request to review, change or correct information to: reservations@bigbearvacations.com.</p>
                    <p>You can delete your account and erase all personal information associated with you at any time contacting us at 877-417-6504 or reservations@bigbearvacations.com.</p>
                    <p>For any request that you make, you should receive an email response from us. Please contact us if you do not receive confirmation within 30 days of your request.</p>
                    <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Third Party Websites</h2>
                    <p>The Company is not responsible for the privacy practices or policies of any third-party websites that are linked to the Website. We encourage you to read their respective privacy policies prior to providing any personal information at or to such sites.</p>
                    <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Data Storage and Security</h2>
                    <p>The information that we collect is stored in our database, which is secured through password authentication. Your information may be stored on our servers and also on servers of companies that we hire to provide services. In each case, information may be stored in the United States and in other countries where we operate, and in countries where our respective service providers operate. If you are in the European Union, Switzerland, or other regions with laws governing data collection and use, you acknowledge that we may transfer, process and store your personal information in the United States and other countries, the privacy laws of which may be considered less strict than those of your region.</p>
                    <p>We understand that security of your personal and financial information is important to you, so we have taken steps to enhance the safety and confidentiality of personal and financial information sent to or from us. Company uses commercially reasonable efforts to maintain the security of the Website and your information.</p>
                    <p>If you choose to license our software, you will need to establish and account. Access by you to your account is available through a password and/or unique user name selected by you. This password is encrypted. You should not divulge your password to anyone. You should change your password often using a combination of letters and numbers, and you should ensure you use a secure web browser. We cannot be responsible for activity that results from your own neglect to safeguard the secrecy of your password and user name. If you share a computer with anyone, you should always log out of your account after you are finished, in order to prevent unauthorized access.</p>
                    <p>Please notify us as soon as possible if your user name or password is compromised.</p>
                    <p>Unfortunately, no data transmission over the Internet or any wireless network can be guaranteed to be 100% secure. As a result, while we strive to protect your personal information, you acknowledge that: (a) there are security and privacy limitations of the Internet that our beyond our control; (b) the security, integrity and privacy of any and all information and data exchanged between you and us through this Website cannot be guaranteed and we shall have no liability to you or any third party for loss, misuse, disclosure or alteration of such information; and (c) any such information and data may be viewed or tampered with in transit by a third party.</p>
                    <p>If we become aware of a data breach that is likely to result in a risk for the rights and freedoms of individuals, we will notify you within 72 hours of first having become aware of the breach.</p>
                    <p>Notwithstanding the foregoing, Company provides the Website “as is” without any express or implied warranty of any kind, including warranties of merchantability, reliability, or fitness for a particular purpose.</p>
                    <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Changes in Privacy Policy</h2>
                    <p>This Privacy Policy may change from time to time to accommodate changes in the Website, changes in technology or legal developments. We will post any changes to the Privacy Policy on the Website.</p>
                    <h2 className="text-2xl sm:text-3xl font-medium mb-2 text-black">Contact Us</h2>
                    <p>To report any known or suspected privacy or security breaches or to submit privacy related questions or complaints please contact us at reservations@bigbearvacations.com. Revised: May 2018</p>
                </div>
            </section>
        </main>
    );
}