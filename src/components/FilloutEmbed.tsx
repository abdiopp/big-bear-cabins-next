"use client";
import Script from "next/script";

export default function FilloutEmbed() {
    return (
        <>
            <div style={{ width: "100%", height: "500px" }} data-fillout-id="mkqnBq4Smvus" data-fillout-embed-type="standard" data-fillout-inherit-parameters data-fillout-dynamic-resize />

            <Script src="https://server.fillout.com/embed/v1/" strategy="afterInteractive" />
        </>
    );
}