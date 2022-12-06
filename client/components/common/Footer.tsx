import { Text } from '@nextui-org/react';
import { AiFillMail, AiFillPhone } from 'react-icons/ai';
import { MdMeetingRoom } from 'react-icons/md';

const Footer = () => {
  return (
    <>
      <footer className='container'>
        <div className='container-top'>
          <div className='left'>
            <h3 className='title'>Giới thiệu</h3>
            <img
              width={170}
              height={100}
              src='/logo.png'
              alt='Logo image'
              style={{ objectFit: 'contain' }}
            />
            <Text
              b
              css={{
                textGradient: '45deg, $purple600 -20%, $pink600 100%',
              }}
            >
              TECH ETOET SAVE THE WORLD
            </Text>

            {/* <div className='socialContainer'>
            <MdFacebook size={40} color='7828C8' />
            <AiFillInstagram size={40} color='7828C8' />
            <AiOutlineTwitter size={40} color='7828C8' />
            <BsPinterest size={40} color='7828C8' />
          </div> */}
          </div>
          <div className='center'>
            <h3 className='title'>Liên kết</h3>
            <ul className='list'>
              <li className='listItem'>Tìm kiếm</li>
              <li className='listItem'>Giới thiệu</li>
              <li className='listItem'>Chính sách đổi trả</li>
              <li className='listItem'>Chính sách bảo mật</li>
              <li className='listItem'>Điều khoản dịch vụ</li>
            </ul>
          </div>
          <div className='right'>
            <h3 className='title'>Thông tin liên hệ</h3>
            <div className='contactItem'>
              <MdMeetingRoom color='7828C8' style={{ marginRight: '10px' }} />{' '}
              622 Dixie Path , South Tobinchester 98336
            </div>
            <div className='contactItem'>
              <AiFillPhone color='7828C8' style={{ marginRight: '10px' }} /> +1
              234 56 789
            </div>
            <div className='contactItem'>
              <AiFillMail color='7828C8' style={{ marginRight: '10px' }} />{' '}
              dev.phansihoang@gmail.com
            </div>
          </div>
          <div className='right'>
            <h3 className='title'>Fanpage</h3>

            <div className='contactItem'>
              <iframe
                src='https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100088664581444&tabs=timeline&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId'
                width='340'
                height='130'
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling='no'
                frameBorder='0'
                allowFullScreen={true}
                allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
              ></iframe>
            </div>
          </div>
        </div>
        <div className='copyright'>
          <Text size={14}>Copyright © {new Date().getUTCFullYear()} ETOET.</Text>
        </div>
      </footer>
      <style jsx>{`
        .copyright {
          display: flex;
          justify-content: center;
          align-item: center;
          padding: 20px 0;
        }
        .container {
          background-color: #fff;
        }

        .container-top {
          display: flex;
          border-bottom: 1px solid #e7e7e7;
          border-top: 1px solid #e7e7e7;
        }

        .left {
          flex: 2;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .logo {
          color: #7828c8;
        }

        .socialContainer {
          display: flex;
          gap: 5px;
        }

        .center {
          flex: 3;
          padding: 20px;
        }

        .title {
          color: #7828c8;
          margin-bottom: 30px;
        }

        .list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-wrap: wrap;
        }

        .listItem {
          width: 50%;
          margin-bottom: 10px;
        }

        .right {
          flex: 3;
          padding: 20px;
        }

        .contactItem {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  );
};

export default Footer;
