import { Container, Pagination, Row, Text } from '@nextui-org/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { ItemsList } from '.';
import UserLayout from '../components/common/UserLayout';
import useMediaQuery from '../libs/hooks/useMediaQuery';
import { useProducts } from '../libs/swr/useProducts';

export default function Search() {
  const [pageIndex, setPageIndex] = useState(1);

  return (
    <>
      {' '}
      <Head>
        <title>Kết quả tìm kiếm</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <UserLayout>
        <Container md>
          <div style={{ marginTop: 100 }}>
            <Page pageIndex={pageIndex} setPageIndex={setPageIndex} />
            <div style={{ display: 'none' }}>
              <Page pageIndex={pageIndex + 1} setPageIndex={setPageIndex} />
            </div>
          </div>
        </Container>
      </UserLayout>
    </>
  );
}

const Page = ({
  pageIndex,
  setPageIndex,
}: {
  pageIndex: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
}) => {
  const router = useRouter();
  const { key } = router.query;
  const query = `?name=${key}&page=${pageIndex}&limit=12`;
  const { data } = useProducts(query, !!key);
  const handleChange = (index: number) => setPageIndex(index);
  const isXs = useMediaQuery('(min-width: 650px)');

  return (
    <>
      {data && data.items.length > 0 ? (
        <ItemsList title={`KẾT QUẢ TÌM KIẾM: ${key}`} data={data?.items} />
      ) : (
        <>
          <Text
            h2
            size={isXs ? 50 : 30}
            css={{
              textAlign: 'center',
              textGradient: '45deg, $purple600 -20%, $pink600 100%',
            }}
            weight='bold'
          >
            {`KẾT QUẢ TÌM KIẾM: ${key}`}
          </Text>
          <Text blockquote>Không tìm thấy sản phẩm</Text>
        </>
      )}

      {data && data.items.length > 0 && (
        <Row justify='center' css={{ marginTop: 20, marginBottom: 20 }}>
          <Pagination
            size='xl'
            shadow
            color='secondary'
            total={data?.meta.totalPages}
            onChange={(page) => handleChange(page)}
            page={pageIndex}
          />
        </Row>
      )}
    </>
  );
};
