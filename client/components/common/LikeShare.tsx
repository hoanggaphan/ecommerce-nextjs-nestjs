import { useEffect } from 'react';

export default function LikeShare({ url }: { url: string }) {
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse(document.getElementById('fb-like'));
    }
  }, []);

  return (
    <div id='fb-like'>
      <div
        className='fb-like'
        data-href={url}
        data-width='1000'
        data-layout='button_count'
        data-action='like'
        data-size='small'
        data-share='true'
      ></div>
    </div>
  );
}
