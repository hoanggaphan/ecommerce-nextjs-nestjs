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
          className='logo'
        />
      </Link>
      <style jsx>{`
        .logo {
          cursor: pointer;
          object-fit: contain;
        }
      `}</style>
    </>
  );
}
