import {
  Button,
  Card,
  Checkbox,
  Col,
  FormElement,
  Grid,
  Image,
  Input,
  Loading,
  Row,
  Spacer,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsPencil } from 'react-icons/bs';
import { GrAddCircle } from 'react-icons/gr';
import Select, { components } from 'react-select';
import slugify from 'react-slugify';
import Swal from 'sweetalert2';
import AdminLayout from '../../../components/common/AdminLayout';
import useAuth from '../../../libs/hooks/useAuth';
import useRoles from '../../../libs/hooks/useRoles';
import { useAdminAttribute } from '../../../libs/swr/useAdminAttribute';
import { useAdminCategory } from '../../../libs/swr/useAdminCategory';
import { IconButton } from '../category';

export type FormValues = {
  name: string;
  slug: string;
  description: string;
  category: any;
  variants: {
    price: number;
    quantity: number;
    attributeValues: [];
  }[];
  isNew: boolean;
  isActive: boolean;
  isPopular: boolean;

  price: number;
  quantity: number;

  image1: FileList;
  image2: FileList;
  image3: FileList;
  image4: FileList;
  image5: FileList;
  image6: FileList;
  image7: FileList;
};

const fileToBase64 = (file: File) => {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
};

const uploadImg = async (img: File) => {
  if (!img) return;
  const b64 = await fileToBase64(img);
  return await axios
    .post('/api/images', {
      image: b64,
    })
    .then((res: any) => res.data);
};

export default function Add() {
  useAuth(true);
  useRoles(['admin', 'manager', '/admin/dashboard']);
  const { data: session } = useSession();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      variants: [
        {
          price: 0,
          quantity: 0,
          attributeValues: [],
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });
  const [isVariants, setIsVariants] = useState(false);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [adding, setAdding] = useState(false);

  const resetForm = () => {
    reset();
    setPrice(0);
    setQuantity(0);
  };

  const uploadImgsToCloud = async () => {
    const images: File[] = [];
    getValues('image1') && images.push(getValues('image1')[0]);
    getValues('image2') && images.push(getValues('image2')[0]);
    getValues('image3') && images.push(getValues('image3')[0]);
    getValues('image4') && images.push(getValues('image4')[0]);
    getValues('image5') && images.push(getValues('image5')[0]);
    getValues('image6') && images.push(getValues('image6')[0]);
    getValues('image7') && images.push(getValues('image7')[0]);

    return await Promise.all(images.map((img: File) => uploadImg(img)));
  };

  const checkImgsEmpty = () => {
    if (
      !getValues('image1') &&
      !getValues('image2') &&
      !getValues('image3') &&
      !getValues('image4') &&
      !getValues('image5') &&
      !getValues('image6') &&
      !getValues('image7')
    ) {
      return true;
    }
    return false;
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.category) {
      Swal.fire({
        title: 'Sản phẩm phải có danh mục',
        icon: 'error',
      });
      return;
    }
    if (!data.variants.length) return;

    const category = { id: data.category.value };

    // Check if product have multi variant
    let variants: any = [{ price, quantity, attributeValues: [] }];
    let noAttributes = false;
    if (isVariants) {
      variants = data.variants.map((i) => {
        // Check if attributes is empty
        if (i.attributeValues.length === 0) {
          noAttributes = true;
        }

        const newAtt = i.attributeValues.map((a: any) => ({ id: a.id }));
        return {
          ...i,
          attributeValues: newAtt,
        };
      });

      if (noAttributes) {
        Swal.fire({
          title: 'Phiên bản phải có ít nhất 1 thuộc tính',
          icon: 'error',
        });
        return;
      }
    }

    if (checkImgsEmpty()) {
      Swal.fire({
        title: 'Sản phẩm phải có ít nhất 1 hình ảnh',
        icon: 'error',
      });
      return;
    }

    try {
      setAdding(true);

      const resUploaded = await uploadImgsToCloud();
      const postImg = resUploaded.map((d: any) => ({
        publicId: d.public_id,
        url: d.secure_url,
      }));

      // Remove unnecessary attributes
      const {
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
        ...newData
      } = data;
      const postData = { ...newData, category, variants, images: postImg };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/product`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      resetForm();

      Swal.fire({
        title: 'Tạo thành công!',
        icon: 'success',
      });
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Swal.fire({
          title: error.response.data.message,
          icon: 'error',
        });
        return;
      }
      Swal.fire({
        title: 'Cập nhật thất bại',
        icon: 'error',
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      {' '}
      <Head>
        <title>Tạo sản phẩm</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminLayout title='Tạo sản phẩm'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card variant='bordered'>
            <Card.Body>
              <Grid.Container css={{ columnGap: 25 }} wrap='nowrap'>
                <Grid xs={4} css={{ display: 'block!important' }}>
                  <Row>
                    <Card variant='bordered' css={{ p: 15, w: 390, h: 390 }}>
                      <ImagePreview
                        getValues={getValues}
                        watch={watch}
                        control={control}
                        name='image1'
                      />
                    </Card>
                  </Row>
                  <Row wrap='wrap' justify='center' css={{ mt: 15 }}>
                    {[...Array(6)].map((i, index) => (
                      <Card
                        key={index + 2}
                        variant='bordered'
                        css={{
                          p: 3,
                          w: 80,
                          h: 80,
                          m: '2px 10px 10px 10px',
                        }}
                      >
                        <ImagePreview
                          getValues={getValues}
                          watch={watch}
                          control={control}
                          name={`image${index + 2}`}
                          small
                        />
                      </Card>
                    ))}
                  </Row>
                </Grid>
                <Grid xs={8}>
                  <div style={{ width: '100%' }}>
                    <Row css={{ columnGap: 15 }}>
                      <Controller
                        control={control}
                        name='name'
                        render={({ field: { onChange } }) => (
                          <Input
                            defaultValue=''
                            onChange={(e: React.ChangeEvent<FormElement>) => {
                              onChange(e);
                              setValue('slug', slugify(e.target.value));
                            }}
                            fullWidth
                            label='Tên'
                            required
                          />
                        )}
                      />

                      <Controller
                        name='category'
                        control={control}
                        render={({ field }) => (
                          <CategorySelect
                            label='Danh mục'
                            placeholder='Chọn danh mục'
                            value={field.value}
                            onChange={field.onChange}
                            innerRef={field.ref}
                          />
                        )}
                      />
                    </Row>
                    <Spacer y={1} />
                    <Row>
                      <Input
                        fullWidth
                        label='Slug'
                        {...register('slug')}
                        required
                      />
                    </Row>
                    <Spacer y={1} />
                    <Row>
                      <Textarea
                        fullWidth
                        label='Mô tả'
                        {...register('description')}
                      />
                    </Row>
                    <Spacer y={1} />
                    <Checkbox
                      size='sm'
                      color='secondary'
                      onChange={setIsVariants}
                      isSelected={isVariants}
                    >
                      Có nhiều phiên bản
                    </Checkbox>

                    {isVariants ? (
                      <>
                        <Spacer y={1} />
                        <Row align='center'>
                          <span style={{ fontSize: '14px' }}>
                            Các phiên bản: &nbsp;
                          </span>
                          <Tooltip
                            content='Thêm'
                            onClick={() =>
                              append({
                                price: 0,
                                quantity: 0,
                                attributeValues: [],
                              })
                            }
                          >
                            <IconButton type='button'>
                              <GrAddCircle size={20} />
                            </IconButton>
                          </Tooltip>
                        </Row>
                        <ul style={{ marginLeft: 0, marginRight: 0 }}>
                          {fields.map((item, index) => (
                            <li
                              key={item.id}
                              style={{
                                display: 'flex',
                                columnGap: '15px',
                                position: 'relative',
                                marginRight: 30,
                              }}
                            >
                              <div style={{ flex: 3 }}>
                                <Controller
                                  name={`variants.${index}.attributeValues`}
                                  control={control}
                                  render={({ field }) => (
                                    <AttributeSelect
                                      label='Thuộc tính'
                                      placeholder='Chọn thuộc tính'
                                      value={field.value}
                                      onChange={field.onChange}
                                      innerRef={field.ref}
                                    />
                                  )}
                                />
                              </div>

                              <div style={{ flex: 1 }}>
                                <Input
                                  fullWidth
                                  label='Đơn giá (VNĐ)'
                                  type='number'
                                  {...register(`variants.${index}.price`, {
                                    required: true,
                                    valueAsNumber: true,
                                  })}
                                  min='0'
                                />
                              </div>

                              <div style={{ flex: 1 }}>
                                <Input
                                  fullWidth
                                  label='Số lượng'
                                  type='number'
                                  {...register(`variants.${index}.quantity`, {
                                    required: true,
                                    valueAsNumber: true,
                                  })}
                                  min='0'
                                />
                              </div>

                              {fields.length > 1 && (
                                <Tooltip
                                  content='Xóa'
                                  color='error'
                                  onClick={() => remove(index)}
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '-10px',
                                    marginTop: 12,
                                    transform: 'translate(100%, -50%)',
                                  }}
                                >
                                  <IconButton type='button'>
                                    <AiOutlineDelete size={20} fill='#FF0080' />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <>
                        <Spacer y={1} />
                        <div
                          style={{
                            display: 'flex',
                            columnGap: '15px',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <Input
                              fullWidth
                              initialValue='0'
                              label='Đơn giá (VNĐ)'
                              type='number'
                              min='0'
                              value={price}
                              onChange={(e) => setPrice(+e.target.value)}
                            />
                          </div>

                          <div style={{ flex: 1 }}>
                            <Input
                              fullWidth
                              initialValue='0'
                              label='Số lượng'
                              type='number'
                              min='0'
                              value={quantity}
                              onChange={(e) => setQuantity(+e.target.value)}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <Spacer y={1} />
                    <Row>
                      <Col span={2}>
                        <Controller
                          name={`isActive`}
                          control={control}
                          defaultValue={false}
                          render={({ field: { onChange, value } }) => (
                            <Checkbox
                              size='sm'
                              defaultSelected={false}
                              isSelected={value}
                              color='secondary'
                              onChange={(isSelected) => {
                                onChange(isSelected);
                              }}
                            >
                              Hiển thị
                            </Checkbox>
                          )}
                        />
                      </Col>
                      <Col span={2}>
                        <Controller
                          name={`isNew`}
                          control={control}
                          defaultValue={false}
                          render={({ field: { onChange, value } }) => (
                            <Checkbox
                              size='sm'
                              defaultSelected={false}
                              isSelected={value}
                              color='secondary'
                              onChange={(isSelected) => {
                                onChange(isSelected);
                              }}
                            >
                              Mới
                            </Checkbox>
                          )}
                        />
                      </Col>
                      <Col span={2}>
                        <Controller
                          name={`isPopular`}
                          control={control}
                          defaultValue={false}
                          render={({ field: { onChange, value } }) => (
                            <Checkbox
                              size='sm'
                              color='secondary'
                              defaultSelected={false}
                              isSelected={value}
                              onChange={(isSelected) => {
                                onChange(isSelected);
                              }}
                            >
                              Nổi bật
                            </Checkbox>
                          )}
                        />
                      </Col>
                    </Row>
                    <Spacer y={1} />

                    <Row>
                      {adding ? (
                        <Button
                          disabled
                          auto
                          bordered
                          color='warning'
                          css={{ px: '$13', minWidth: 129 }}
                        >
                          <Loading type='points-opacity' color='currentColor' />
                        </Button>
                      ) : (
                        <Button type='submit' shadow auto color='secondary'>
                          Tạo sản phẩm
                        </Button>
                      )}
                    </Row>
                  </div>
                </Grid>
              </Grid.Container>
            </Card.Body>
          </Card>
        </form>
        <style jsx>{`
          .variant-top {
            display: flex;
            align-items: center;
            column-gap: 15px;
            margin-bottom: 5px;
          }
          .variant-input-text {
            display: flex;
            align-items: center;
          }
          .variant-item {
            padding-top: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid;
            margin-bottom: 0;
          }
          .variant-title {
            display: flex;
            align-items: center;
            column-gap: 10px;
            margin-bottom: 10px;
          }
          .variant-title h5 {
            margin-bottom: 0;
          }
        `}</style>
      </AdminLayout>
    </>
  );
}

const ImagePreview = ({ small, control, name, watch }: any) => {
  const file = watch(name);
  let url = '';
  if (file && file[0]) {
    url = URL.createObjectURL(file[0]);
  } else {
    url = '/vender-upload-preview.jpg';
  }

  return (
    <>
      <div
        style={{
          boxShadow: '0px 0px 8px 0px rgb(0 0 0 / 15%)',
          borderRadius: 10,
          width: small ? 30 : 40,
          height: small ? 30 : 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          right: small ? 5 : 25,
          top: small ? 5 : 25,
          zIndex: 1,
          backgroundColor: 'white',
        }}
      >
        <Controller
          control={control}
          name={name}
          render={({ field: { value, onChange } }) => (
            <input
              type='file'
              accept='image/*'
              style={{
                width: small ? 30 : 40,
                height: small ? 30 : 40,
                position: 'absolute',
                zIndex: 1,
                opacity: 0,
              }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const fileSize = e.target.files[0].size;
                  const size = fileSize / 1024 / 1024; // in MiB
                  if (size > 1) {
                    Swal.fire({
                      title: 'Hình ảnh vượt quá 1MB',
                      icon: 'error',
                    });
                    return false;
                  }
                }
                onChange(e.target.files);
              }}
            />
          )}
        />

        <BsPencil fill='currentColor' size={small ? 15 : 20} />
      </div>

      <div
        style={{
          overflow: 'hidden',
          borderRadius: 10,
          width: '100%',
          height: '100%',
        }}
      >
        {' '}
        <Image
          src={url}
          objectFit='cover'
          width='100%'
          height='100%'
          alt='Card image background'
        />
      </div>
    </>
  );
};

const CategorySelect = (props: any) => {
  const { data: session } = useSession();
  const { data } = useAdminCategory(session?.accessToken);
  const category = data?.map((i) => ({ label: i.name, value: i.id }));

  return (
    <Select
      {...props}
      value={props.value ? props.value : null}
      options={category}
      // menuPortalTarget={document.querySelector('body')}
      menuPortalTarget={document.body}
      menuPosition={'fixed'}
      components={{
        Control: (base) => (
          <>
            <label style={{ fontSize: 14, marginBottom: 6, display: 'block' }}>
              {props.label}
            </label>
            <components.Control {...base} />
          </>
        ),
      }}
      styles={{
        container: (base) => ({
          ...base,
          width: '100%',
        }),
        control: (base) => ({
          ...base,
          background: '#F1F3F5',
          border: 'none',
          borderColor: 'none',
          borderRadius: 12,
          minHeight: 40,
          boxShadow: 'none',
        }),
        menu: (base) => ({
          ...base,
          background: '#fff',
          fontSize: 14,
          borderRadius: 12,
          overflow: 'hidden',
          minWidth: 360,
        }),
        menuList: (base) => ({
          ...base,
        }),
        valueContainer: (base) => ({
          ...base,
          fontSize: 14,
        }),
        option: (styles: any, { isSelected }: any) => ({
          ...styles,
          backgroundColor: isSelected ? '#7828C8' : null,
          color: isSelected ? 'white' : null,
          ':hover': {
            backgroundColor: isSelected ? null : '#EADCF8',
            color: isSelected ? null : '#7828C8',
          },
          ':active': {
            backgroundColor: null,
            color: null,
          },
        }),
      }}
    />
  );
};

type AttributeOption = {
  label: string;
  options: {
    label: string;
    id: number;
    value: string;
    attributes: {
      id: number;
      name: string;
    };
  }[];
}[];
const AttributeSelect = (props: any) => {
  const { data: session } = useSession();
  let { data: attributes } = useAdminAttribute(session?.accessToken);
  const [originalOptions, setOriginalOptions] = useState<AttributeOption>([]);
  const [options, setOptions] = useState<AttributeOption>([]);

  useEffect(() => {
    if (attributes) {
      const newAttributes = attributes?.map((i) => {
        const attributeValues = i.attributeValues.map((a) => ({
          ...a,
          label: a.value,
        }));

        return {
          label: i.name,
          options: attributeValues,
        };
      });
      setOriginalOptions(newAttributes);
      setOptions(newAttributes);
    }
  }, [attributes]);

  const handleChange = (selectedOption: any) => {
    props.onChange(selectedOption);

    // if selection of a group is selected then remove that group
    let newGroupedOptions = [];
    newGroupedOptions = originalOptions?.filter((e: any) => {
      const found = e.options.find((k: any) => {
        const res = selectedOption.find((i: any) => i.value === k.value);
        return res ? true : false;
      });

      return found ? false : true;
    });

    setOptions(newGroupedOptions);
  };

  return (
    <div style={{ width: '100%' }}>
      <label style={{ fontSize: 14, marginBottom: 6, display: 'block' }}>
        Chọn thuộc tính
      </label>

      <Select
        {...props}
        // menuPortalTarget={document.querySelector('body')}
        menuPortalTarget={document.body}
        menuPosition={'fixed'}
        options={options}
        onChange={handleChange}
        isMulti
        closeMenuOnSelect={false}
        styles={{
          container: (base) => ({
            ...base,
            width: '100%',
          }),
          control: (base) => ({
            ...base,
            background: '#F1F3F5',
            border: 'none',
            borderColor: 'none',
            borderRadius: 12,
            minHeight: 40,
            boxShadow: 'none',
          }),
          menu: (base) => ({
            ...base,
            background: '#fff',
            fontSize: 14,
            borderRadius: 12,
            overflow: 'hidden',
            minWidth: 360,
          }),
          menuList: (base) => ({
            ...base,
          }),
          valueContainer: (base) => ({
            ...base,
            fontSize: 14,
          }),
          option: (styles: any, { isSelected }: any) => ({
            ...styles,
            backgroundColor: isSelected ? '#7828C8' : null,
            color: isSelected ? 'white' : null,
            ':hover': {
              backgroundColor: isSelected ? null : '#EADCF8',
              color: isSelected ? null : '#7828C8',
            },
            ':active': {
              backgroundColor: null,
              color: null,
            },
          }),
        }}
      />
    </div>
  );
};
