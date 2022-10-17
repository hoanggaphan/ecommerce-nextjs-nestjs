import {
  AiFillInstagram,
  AiFillMail,
  AiFillPhone,
  AiOutlineTwitter,
} from 'react-icons/ai';
import { BsPinterest } from 'react-icons/bs';
import { MdFacebook, MdMeetingRoom } from 'react-icons/md';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  background-color: #fff;
  box-shadow: 0 0px 20px 6px rgb(104 112 118 / 0.08);
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Logo = styled.h1``;

const Desc = styled.p`
  margin: 20px 0px;
`;

const SocialContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const Center = styled.div`
  flex: 1;
  padding: 20px;
`;

const Title = styled.h3`
  margin-bottom: 30px;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
`;

const ListItem = styled.li`
  width: 50%;
  margin-bottom: 10px;
`;

const Right = styled.div`
  flex: 1;
  padding: 20px;
`;

const ContactItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const Payment = styled.img`
  width: 50%;
`;

const Footer = () => {
  return (
    <Container>
      <Left>
        <Logo>ETOET</Logo>
        <Desc>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected
          humour, or randomised words which don’t look even slightly believable.
        </Desc>
        <SocialContainer>
          <MdFacebook size={40} color='7828C8' />
          <AiFillInstagram size={40} color='7828C8' />
          <AiOutlineTwitter size={40} color='7828C8' />
          <BsPinterest size={40} color='7828C8' />
        </SocialContainer>
      </Left>
      <Center>
        <Title>Useful Links</Title>
        <List>
          <ListItem>Home</ListItem>
          <ListItem>Cart</ListItem>
          <ListItem>Man Fashion</ListItem>
          <ListItem>Woman Fashion</ListItem>
          <ListItem>Accessories</ListItem>
          <ListItem>My Account</ListItem>
          <ListItem>Order Tracking</ListItem>
          <ListItem>Wishlist</ListItem>
          <ListItem>Wishlist</ListItem>
          <ListItem>Terms</ListItem>
        </List>
      </Center>
      <Right>
        <Title>Contact</Title>
        <ContactItem>
          <MdMeetingRoom style={{ marginRight: '10px' }} /> 622 Dixie Path ,
          South Tobinchester 98336
        </ContactItem>
        <ContactItem>
          <AiFillPhone style={{ marginRight: '10px' }} /> +1 234 56 78
        </ContactItem>
        <ContactItem>
          <AiFillMail style={{ marginRight: '10px' }} />{' '}
          contact@github.com/hoanggaphan
        </ContactItem>
      </Right>
    </Container>
  );
};

export default Footer;
