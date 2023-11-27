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
import { useRouter } from 'next/router';
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
import AdminLayout from '../../../../components/common/AdminLayout';
import useAuth from '../../../../libs/hooks/useAuth';
import useRoles from '../../../../libs/hooks/useRoles';
import { useAdminAttribute } from '../../../../libs/swr/useAdminAttribute';
import { useAdminCategory } from '../../../../libs/swr/useAdminCategory';
import { useAdminProduct } from '../../../../libs/swr/useAdminProduct';
import { AttributeValueType, ImageType } from '../../../../types';
import { IconButton } from '../../category';

export type FormValues = {
  name: string;
  slug: string;
  description: string;
  category: any;
  variants: {
    id?: number;
    price: number;
    quantity: number;
    attributeValues: AttributeValueType[];
  }[];
  isNew: boolean;
  isActive: boolean;
  isPopular: boolean;

  price: number;
  quantity: number;

  image1: FileList | ImageType;
  image2: FileList | ImageType;
  image3: FileList | ImageType;
  image4: FileList | ImageType;
  image5: FileList | ImageType;
  image6: FileList | ImageType;
  image7: FileList | ImageType;
};

function instanceOfImageType(object: any): object is ImageType {
  return 'publicId' in object;
}

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

const deleteImg = async (imgId: string) => {
  return await axios
    .delete('/api/images/' + imgId)
    .then((res: any) => res.data);
};

export default function Update() {
  useAuth(true);
  useRoles(['admin', 'manager'], '/admin/dashboard');
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { data: product, mutate } = useAdminProduct(id, session?.accessToken);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const [isVariants, setIsVariants] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [adding, setAdding] = useState(false);
  const [price, setPrice] = useState(0);

  const updateImages = async (data: FormValues) => {
    if (!product) return;
    return (
      await Promise.all(
        [...new Array(7)].map(async (item, index) => {
          if (
            product.images[index] &&
            getValues(`image${index + 1}` as keyof FormValues) instanceof
              FileList &&
            (getValues(`image${index + 1}` as keyof FormValues) as FileList)
              .length > 0
          ) {
            const img = (
              getValues(`image${index + 1}` as keyof FormValues) as FileList
            )[0];
            const resUploaded = await uploadImg(img); // upload new img to cloud
            await deleteImg(product?.images[index].publicId); // delete old img in cloud
            const newImg = {
              id: product.images[index].id,
              publicId: resUploaded.public_id,
              url: resUploaded.secure_url,
            };
            return newImg;
          } else if (
            !product.images[index] &&
            getValues(`image${index + 1}` as keyof FormValues) instanceof
              FileList &&
            (getValues(`image${index + 1}` as keyof FormValues) as FileList)
              .length > 0
          ) {
            const img = (
              getValues(`image${index + 1}` as keyof FormValues) as FileList
            )[0];
            const resUploaded = await uploadImg(img); // upload new img to cloud
            const newImg = {
              publicId: resUploaded.public_id,
              url: resUploaded.secure_url,
            };
            return newImg;
          } else if (
            getValues(`image${index + 1}` as keyof FormValues) &&
            instanceOfImageType(
              getValues(`image${index + 1}` as keyof FormValues)
            )
          ) {
            // images.push(getValues(`image${index + 1}` as keyof FormValues));
            return getValues(`image${index + 1}` as keyof FormValues);
          } else if (
            product.images[index] &&
            getValues(`image${index + 1}` as keyof FormValues) instanceof
              FileList &&
            (getValues(`image${index + 1}` as keyof FormValues) as FileList)
              .length == 0
          ) {
            await deleteImg(product?.images[index].publicId); // delete old img in cloud
            return undefined;
          }
        })
      )
    ).filter((i) => i !== undefined);
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

    const newCategory = { id: data.category.value };

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
      const images = await updateImages(data);

      const postData = { ...newData, variants, category: newCategory, images };
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/product/${product?.id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      await mutate();

      Swal.fire({
        title: 'Cập nhật thành công!',
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

  useEffect(() => {
    if (product) {
      setValue('name', product?.name);
      setValue('slug', product?.slug);
      setValue('category', {
        label: product?.category.name,
        value: product.category.id,
      });
      setValue('description', product?.description);
      setValue('image1', product?.images[0]);
      setValue('image2', product?.images[1]);
      setValue('image3', product?.images[2]);
      setValue('image4', product?.images[3]);
      setValue('image5', product?.images[4]);
      setValue('image6', product?.images[5]);
      setValue('image7', product?.images[6]);

      if (
        product.variants.length === 1 &&
        product.variants[0].attributeValues.length === 0
      ) {
        setIsVariants(false);
        setPrice(product.variants[0].price);
        setQuantity(product.variants[0].quantity);
        setValue('variants', [
          {
            price: 0,
            quantity: 0,
            attributeValues: [],
          },
        ]);
      } else {
        setIsVariants(true);
        const newVariants = product.variants.map((i) => {
          i.attributeValues = i.attributeValues.map((a) => ({
            ...a,
            label: a.value,
          }));
          return i;
        });
        setValue('variants', newVariants);
      }
    }
  }, [product]);

  return (
    <>
      {' '}
      <Head>
        <title>Cập nhật sản phẩm</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminLayout title='Cập nhật sản phẩm'>
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
                        defaultValue={getValues('image1.url')}
                      />
                    </Card>
                  </Row>
                  <Row wrap='wrap' justify='center' css={{ mt: 15 }}>
                    <Card
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
                        name={`image2`}
                        defaultValue={getValues('image2.url')}
                        small
                      />
                    </Card>
                    <Card
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
                        name={`image3`}
                        defaultValue={getValues('image3.url')}
                        small
                      />
                    </Card>
                    <Card
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
                        name={`image4`}
                        defaultValue={getValues('image4.url')}
                        small
                      />
                    </Card>
                    <Card
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
                        name={`image5`}
                        defaultValue={getValues('image5.url')}
                        small
                      />
                    </Card>
                    <Card
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
                        name={`image6`}
                        defaultValue={getValues('image6.url')}
                        small
                      />
                    </Card>
                    <Card
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
                        name={`image7`}
                        defaultValue={getValues('image7.url')}
                        small
                      />
                    </Card>
                  </Row>
                </Grid>
                <Grid xs={8}>
                  <div style={{ width: '100%' }}>
                    <Row css={{ columnGap: 15 }}>
                      <Controller
                        control={control}
                        name='name'
                        render={({ field: { value, onChange } }) => (
                          <Input
                            initialValue={value}
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
                        {product && (
                          <Controller
                            name={`isActive`}
                            control={control}
                            defaultValue={product?.isActive}
                            render={({ field: { onChange, value } }) => (
                              <Checkbox
                                size='sm'
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
                        )}
                      </Col>
                      <Col span={2}>
                        {product && (
                          <Controller
                            name={`isNew`}
                            control={control}
                            defaultValue={product.isNew}
                            render={({ field: { onChange, value } }) => (
                              <Checkbox
                                size='sm'
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
                        )}
                      </Col>
                      <Col span={2}>
                        {product && (
                          <Controller
                            name={`isPopular`}
                            control={control}
                            defaultValue={product.isPopular}
                            render={({ field: { onChange, value } }) => (
                              <Checkbox
                                size='sm'
                                color='secondary'
                                isSelected={value}
                                onChange={(isSelected) => {
                                  onChange(isSelected);
                                }}
                              >
                                Nổi bật
                              </Checkbox>
                            )}
                          />
                        )}
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
                          Cập nhật sản phẩm
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

const ImagePreview = ({ small, control, name, watch, defaultValue }: any) => {
  const file = watch(name);

  let url = '';
  if (file && file[0]) {
    url = URL.createObjectURL(file[0]);
  } else {
    url = defaultValue || '/vender-upload-preview.jpg';
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
          render={({ field: { onChange, value } }) => (
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
