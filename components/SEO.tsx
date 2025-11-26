import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Fetan is Ethiopia's leading digital platform connecting homeowners with trusted renovation and maintenance experts. Find plumbers, electricians, and more.",
  keywords = "Ethiopia, Home Improvement, Renovation, Plumber, Electrician, Addis Ababa, Skilled Labor, Marketplace",
  image = "https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=2070&auto=format&fit=crop",
  url
}) => {
  const siteTitle = "Fetan Digital Platform";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const currentUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default SEO;