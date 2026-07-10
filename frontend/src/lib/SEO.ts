type SchemaType =
  | "WebSite"
  | "WebApplication"
  | "Organization"
  | "SoftwareApplication"
  | "BreadcrumbList"
  | "FAQPage"
  | "Article"
  | string;

type SeoParams = {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string[];
  schemaTypes?: SchemaType[];
  breadcrumbs?: { name: string; url: string }[];
  faqs?: { question: string; answer: string }[];
  appDetails?: {
    operatingSystem: string;
    applicationCategory: string;
    offers?: {
      price: string;
      priceCurrency: string;
    };
  };
};

export const generateSeoMetadata = ({
  title,
  description,
  url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  image = process.env.NEXT_PUBLIC_OG_IMAGE || "/images/og-image.png",

  keywords = [
    "Appify Social",
    "Social Media",
    "Next.js",
    "React",
    "TypeScript",
    "MongoDB",
    "Node.js",
    "JWT Authentication",
    "Social Feed",
    "Posts",
    "Comments",
    "Likes",
    "Replies",
    "Appifylab",
    "Full Stack Engineer",
  ],

  schemaTypes = ["WebSite", "WebApplication", "SoftwareApplication"],

  breadcrumbs,
  faqs,

  appDetails,
}: SeoParams) => {
  const buildSchema = (schemaType: SchemaType) => {
    switch (schemaType) {
      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Appify Social",
          url,
          description,
          inLanguage: "en",
        };

      case "WebApplication":
        return {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Appify Social",
          url,
          image,
          description,
          applicationCategory: "SocialNetworkingApplication",
          operatingSystem: "Web",
        };

      case "SoftwareApplication":
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Appify Social",
          url,
          image,
          description,
          operatingSystem: appDetails?.operatingSystem ?? "Web",
          applicationCategory:
            appDetails?.applicationCategory ?? "SocialNetworkingApplication",

          offers: appDetails?.offers ?? {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        };

      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement:
            breadcrumbs?.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: item.url,
            })) ?? [],
        };

      case "FAQPage":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity:
            faqs?.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })) ?? [],
        };

      default:
        return {};
    }
  };

  return {
    title,
    description,

    keywords,

    authors: [
      {
        name: "Md Rubel Ahmed Rana",
      },
    ],

    creator: "Md Rubel Ahmed Rana",

    publisher: "Appify Social",

    metadataBase: new URL(url),

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Appify Social",
      type: "website",
      locale: "en_US",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@mdrubelahmedrana",
      images: [image],
    },

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },

    schemas: schemaTypes.map(buildSchema),
  };
};
