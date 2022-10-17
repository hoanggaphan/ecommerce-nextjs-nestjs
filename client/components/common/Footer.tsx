import {
  AiFillInstagram,
  AiFillMail,
  AiFillPhone,
  AiOutlineTwitter,
} from 'react-icons/ai';
import { BsPinterest } from 'react-icons/bs';
import { MdFacebook, MdMeetingRoom } from 'react-icons/md';

const Footer = () => {
  return (
    <>
      <div className='container'>
        <div className='left'>
          <h1 className='logo'>ETOET</h1>
          <p className='desc'>
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don’t look even slightly
            believable.
          </p>
          <div className='socialContainer'>
            <MdFacebook size={40} color='7828C8' />
            <AiFillInstagram size={40} color='7828C8' />
            <AiOutlineTwitter size={40} color='7828C8' />
            <BsPinterest size={40} color='7828C8' />
          </div>
        </div>
        <div className='center'>
          <h3 className='title'>Useful Links</h3>
          <ul className='list'>
            <li className='listItem'>Home</li>
            <li className='listItem'>Cart</li>
            <li className='listItem'>Man Fashion</li>
            <li className='listItem'>Woman Fashion</li>
            <li className='listItem'>Accessories</li>
            <li className='listItem'>My Account</li>
            <li className='listItem'>Order Tracking</li>
            <li className='listItem'>Wishlist</li>
            <li className='listItem'>Wishlist</li>
            <li className='listItem'>Terms</li>
          </ul>
        </div>
        <div className='right'>
          <h3 className='title'>Contact</h3>
          <div className='contactItem'>
            <MdMeetingRoom color='7828C8' style={{ marginRight: '10px' }} /> 622
            Dixie Path , South Tobinchester 98336
          </div>
          <div className='contactItem'>
            <AiFillPhone color='7828C8' style={{ marginRight: '10px' }} /> +1
            234 56 78
          </div>
          <div className='contactItem'>
            <AiFillMail color='7828C8' style={{ marginRight: '10px' }} />{' '}
            contact@github.com/hoanggaphan
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          background-color: #fff;
          box-shadow: 0 0px 20px 6px rgb(104 112 118 / 0.08);
        }

        .left {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .logo {
          color: #7828c8;
        }

        .desc {
          margin: 20px 0px;
        }

        .socialContainer {
          display: flex;
          gap: 5px;
        }

        .center {
          flex: 1;
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
          flex: 1;
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
