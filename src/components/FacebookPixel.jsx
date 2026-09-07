import { useEffect } from 'react'
import { useSite } from '../context/SiteContext'

function FacebookPixel() {
  const { siteContent } = useSite()
  const pixelId = siteContent?.facebook_pixel_id_togo

  useEffect(() => {
    if (!pixelId) {
      return
    }

    if (document.querySelector(`script[src*="connect.facebook.net/en_US/fbevents.js"]`)) {
      return
    }

    const script = document.createElement('script')
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
      window.__fbqInitialized = true;
    `
    document.head.appendChild(script)

    const noscript = document.createElement('noscript')
    noscript.innerHTML = `
      <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" alt="" />
    `
    document.head.appendChild(noscript)
  }, [pixelId])

  return null
}

export default FacebookPixel
