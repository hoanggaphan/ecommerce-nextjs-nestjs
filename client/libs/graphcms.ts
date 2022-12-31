import { gql, GraphQLClient } from 'graphql-request';

const hygraph = new GraphQLClient(
  'https://ap-northeast-1.cdn.hygraph.com/content/clbdpgrni21rk01ta0140fp61/master',
  {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NzA0MjYxNDUsImF1ZCI6WyJodHRwczovL2FwaS1hcC1ub3J0aGVhc3QtMS5oeWdyYXBoLmNvbS92Mi9jbGJkcGdybmkyMXJrMDF0YTAxNDBmcDYxL21hc3RlciIsIm1hbmFnZW1lbnQtbmV4dC5ncmFwaGNtcy5jb20iXSwiaXNzIjoiaHR0cHM6Ly9tYW5hZ2VtZW50LmdyYXBoY21zLmNvbS8iLCJzdWIiOiJmMTc2Y2VjZi1jN2NiLTQ0ZDItYjRhNy01NDgyODkwMzk4N2IiLCJqdGkiOiJjbGJkc2xqM3UyNGxuMDF1ajFnZWtnenJ4In0.P3OvK62Ki-NCTicm9hijlXCeX_eCp4yTGYCjOmvvD9tPR6o-13X1soSHBNqFgscMAUsxKVFnbnYlBOveULMFAKHhZemqxDhaibs2zk2WsL77OHivoo0376VlC35zk9aOktQvCu3z5UNCsXOc3Yd0Yt11ZbUqYgzBxw0LIsMwWPn-cheTtCVo-o8UnvyKiIbsx1X2B4uAX2BKu2boRwm_KNdrtWbZ-qrHuCy5mADhxY7RuMDc3qCmGZ907-hoWM98b9zFWbY2u6cXoIw6kf5sJTdrAY00PoWX_wppMmRuXOH5vJsHfvKBX4Q6H6wsMN6kVRsV4FbMHN9hYFumja1ObFTnhN2Z_iTqUY0YtDXKLU5xNj7jV5AfCRlgGxiltXVap0Kw-YN_jHD3Kc_m0oHw2tykXxwR2SrEXm3Pc_n7RA5y9bViXX3kc86AdN5ke8-_5hW-RpN9qJs2NON2Wj5f4Y-SumZsTcFmWC6esfdnxcYQ2dKNfnN2JhSlbhYAr3oaI-olC3TOPtMhdgs-Rkfm7XYbiF3Iqq5q0mAkxKp5NxAC7iExMmG8PHMaunzNToOUKkSy2abEOTvDMrBeRk-RqP1EQyA95JmVSWXgXOutr_TpUEOtybnQDqAfO5g6XEI75-4qmOvXhEgW4J0UoscwQ0ANoRVCH5XSg8rBEMjftt0',
    },
  }
);

export const getAllArticlesForHome = async () => {
  const QUERY = gql`
    {
      articles(orderBy: publishedAt_DESC) {
        publishedAt
        slug
        title
        bannerImage {
          url
        }
      }
    }
  `;
  const { articles } = await hygraph.request(QUERY);

  return articles;
};

export const getArticleBySlug = async (slug: string) => {
  const QUERY = gql`
    query Articles($slug: String!) {
      article(where: { slug: $slug }) {
        publishedAt
        slug
        title
        content {
          json
        }
        bannerImage {
          url
        }
        createdBy {
          name
          picture
        }
      }
    }
  `;
  const { article } = await hygraph.request(QUERY, { slug });

  return article;
};
