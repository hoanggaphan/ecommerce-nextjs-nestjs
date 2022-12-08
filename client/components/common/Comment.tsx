import { useEffect } from 'react';

export default function Comment({ url }: { url: string }) {
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse(document.getElementById('fb-comments'));
    }
  }, []);

  return (
    <div id='fb-comments'>
      <div
        className='fb-comments'
        data-href={url}
        data-width='100%'
        data-numposts='3'
      ></div>
    </div>
  );
}
