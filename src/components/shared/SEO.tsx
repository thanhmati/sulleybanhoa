import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
}

export const SEO = ({
  title,
  description,
  name = 'Sulleybanhoa',
  type = 'website',
  image,
  url,
}: SEOProps) => {
  const siteTitle = `${title} | Sulleybanhoa - Tiệm hoa trên mây`;
  const defaultDescription =
    'Tiệm hoa trên mây - Cung cấp hoa tươi, quà tặng và thiết kế hoa nghệ thuật.';
  const metaDescription = description || defaultDescription;

  // Use a default OG image if none provided (could be added to assets later)
  const metaImage = image || '/src/assets/hero-bg.png';
  const metaUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={name} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};
