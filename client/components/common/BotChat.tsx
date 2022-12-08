import { useEffect } from 'react';

export function BotChat() {
  return (
    <div id='fb-customerchat'>
      <div className='fb-customerchat' page_id='106479618973931'></div>
    </div>
  );
}

export function useBotChat(isTrue: boolean) {
  useEffect(() => {
    if (window.FB) {
      isTrue
        ? window.FB.CustomerChat.show(false)
        : window.FB.CustomerChat.hide();
    }
  }, []);

  return null;
}
