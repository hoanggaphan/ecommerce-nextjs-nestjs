import Link from 'next/link';

export default function Logo({ url }: { url: string }) {
  return (
    <>
      {' '}
      <Link href={url}>
        <img
          width={120}
          height={70}
          src='/logo.png'
          alt='Logo image'
          style={{ objectFit: 'contain' }}
        />
        {/* <a className='logo'>ETOET</a> */}
      </Link>
      <style jsx>{`
        .logo {
          transition: color 0.3s;
          font-weight: 500;
          cursor: pointer;
          color: #7828c8;
        }
      `}</style>
    </>
  );
}
