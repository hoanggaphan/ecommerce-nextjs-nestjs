import { useRouter } from 'next/router';
import { useProduct } from '../libs/swr/useProduct';

export default function Product() {
  const router = useRouter();
  const { id } = router.query;
  const { data: product } = useProduct({ id });
  console.log(product);

  return <div></div>;
}
