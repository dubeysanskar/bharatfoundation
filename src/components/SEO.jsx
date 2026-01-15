import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
    title,
    description,
    keywords,
    name,
    type,
    noindex,
    canonical,
    image = 'https://www.bharatfoundationprayagraj.com/logo.jpeg'
}) {
    const fullTitle = title?.includes('Bharat Foundation') ? title : `${title} | Bharat Foundation`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name='title' content={fullTitle} />
            <meta name='description' content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {canonical && <link rel="canonical" href={canonical} />}
            <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
            <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />

            {/* Author & Publisher */}
            <meta name="author" content="Bharat Foundation" />
            <meta name="publisher" content="Bharat Foundation Prayagraj" />

            {/* Geo Tags for Local SEO */}
            <meta name="geo.region" content="IN-UP" />
            <meta name="geo.placename" content="Prayagraj, Uttar Pradesh, India" />
            <meta name="geo.position" content="25.4358;81.8463" />
            <meta name="ICBM" content="25.4358, 81.8463" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type || 'website'} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {canonical && <meta property="og:url" content={canonical} />}
            <meta property="og:site_name" content="Bharat Foundation" />
            <meta property="og:image" content={image} />
            <meta property="og:image:alt" content="Bharat Foundation - Best NGO in Prayagraj" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@BharatFoundation" />
            <meta name="twitter:creator" content={name || '@BharatFoundation'} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}
