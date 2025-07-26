import Script from 'next/script'

export function GoogleAnalytics({ GA_TRACKING_ID }) {
  if (!GA_TRACKING_ID || GA_TRACKING_ID === '') {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
              page_title: document.title,
              // Enhanced measurement events
              enhanced_measurement: {
                scrolls: true,
                outbound_clicks: true,
                site_search: true,
                video_engagement: true,
                file_downloads: true
              },
              // Custom parameters untuk business tracking
              custom_parameter_business_type: 'Industrial Kitchen Services',
              custom_parameter_location: 'Indonesia',
              custom_parameter_service_area: 'National'
            });
            
            // Track initial page view
            gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href,
              content_group1: 'Industrial Kitchen',
              content_group2: 'Construction Services'
            });
            
            // Enhanced e-commerce tracking
            gtag('config', '${GA_TRACKING_ID}', {
              // Enhanced E-commerce
              send_page_view: true,
              transport_type: 'beacon',
              
              // Site Speed Sample Rate
              site_speed_sample_rate: 100,
              
              // Custom dimensions for business tracking
              custom_map: {
                'dimension1': 'service_type',
                'dimension2': 'equipment_category', 
                'dimension3': 'user_type',
                'dimension4': 'inquiry_source'
              }
            });
          `,
        }}
      />
    </>
  )
}

// Google Tag Manager (alternative/additional)
export function GoogleTagManager({ GTM_ID }) {
  if (!GTM_ID || GTM_ID === '') {
    return null
  }

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
              height="0"
              width="0"
              style="display:none;visibility:hidden"
            ></iframe>
          `,
        }}
      />
    </>
  )
}
