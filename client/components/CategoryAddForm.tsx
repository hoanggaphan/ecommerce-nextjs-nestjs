import {
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  Row,
  Spacer,
  Textarea,
  useInput,
} from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import slugify from 'react-slugify';
import Swal from 'sweetalert2';
import { useAdminCategory } from '../libs/swr/useAdminCategory';
import { validateName, validateSlug } from '../libs/validate';

export default function CategoryAddForm() {
  const { data: session } = useSession();
  const { mutate } = useAdminCategory(session?.accessToken);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const {
    value: desValue,
    reset: resetDes,
    bindings: desBindings,
  } = useInput('');
  const [checkbox, setCheckbox] = useState(false);

  const handleCreateCategory = async () => {
    if (!name || !slug) return;

    if (!validateName(name) || !validateSlug(slug)) return;

    try {
      const newItem = {
        name,
        slug,
        description: desValue,
        isActive: checkbox,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/category`,
        newItem,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      Swal.fire({
        title: 'Tạo thành công!',
        icon: 'success',
      });
      setName('');
      setSlug('');
      resetDes();
      mutate();
    } catch (error: any) {
      Swal.fire({
        title: 'Tạo danh mục thất bại!',
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  return (
    <Card>
      <Card.Body>
        <Spacer y={1} />
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSlug(slugify(e.target.value));
          }}
          labelPlaceholder='Tên'
          clearable
        />
        <Spacer y={2} />
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          labelPlaceholder='Slug'
          clearable
        />
        <Spacer y={2} />
        <Textarea {...desBindings} labelPlaceholder='Mô tả' rows={4} />
        <Spacer y={1} />
        <Row>
          <Col>
            <Checkbox
              size='sm'
              color='secondary'
              onChange={(isSelected) => {
                setCheckbox(isSelected);
              }}
            >
              Hiển thị
            </Checkbox>
          </Col>
        </Row>
        <Spacer y={1} />
        <Button onPress={handleCreateCategory} shadow color='secondary' auto>
          Tạo danh mục
        </Button>
      </Card.Body>
    </Card>
  );
}
