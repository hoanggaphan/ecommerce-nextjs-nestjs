import { RichText } from '@graphcms/rich-text-react-renderer';
import { Container, Image, Text } from '@nextui-org/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Comment from '../../components/common/Comment';
import UserLayout from '../../components/common/UserLayout';
import { dayPublish } from '../../libs/dayjs';
import { getArticleBySlug } from '../../libs/graphcms';
import { ArticleType } from '../../types';

export default function Slug() {
  const router = useRouter();
  const { slug } = router.query;
  const {
    data: article,
    error,
    mutate,
    isValidating,
  } = useSWR<ArticleType>(
    slug ? [`/article`, slug] : null,
    (url, slugPara: string) => getArticleBySlug(slugPara)
  );

  if (!article) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>{slug}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <UserLayout>
        <Container sm css={{ mt: 50, mb: 20 }}>
          <Image
            height={504}
            autoResize
            src={article?.bannerImage.url || ''}
            alt='Default Image'
            objectFit='cover'
          />
        </Container>
        <Container xs>
          <Text h2>{article?.title}</Text>

          <div style={{ display: 'flex', marginBottom: '25px', columnGap: 5 }}>
            <div style={{ borderRadius: '50%', overflow: 'hidden' }}>
              <Image
                width={24}
                height={24}
                src={article?.createdBy.picture || ''}
                alt=''
                objectFit='cover'
              />
            </div>

            <Text
              as='time'
              css={{ fontStyle: 'italic', display: 'inline-block' }}
              color='$accents7'
            >
              {article?.createdBy.name} -{' '}
              {dayPublish(article?.publishedAt || '')}
            </Text>
          </div>

          <RichText content={article?.content.json.children} />

          <div style={{ marginTop: 50 }}>
            <Comment
              url={
                process.env.NODE_ENV === 'development'
                  ? 'https://developers.facebook.com/docs/plugins/comments#configurator'
                  : window.location.href
              }
            />
          </div>
        </Container>
      </UserLayout>
    </>
  );
}
