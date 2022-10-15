export type CategoryType = {
  id: number;
  name?: string;
  image?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
};

type AttributeValues = {
  id: number;
  value: string;
  attributes: {
    id: number;
    name: string;
  };
};
export type AttributeType = {
  id: number;
  name: string;
  attributeValues: AttributeValues[];
};

export type AttributeValueType = {
  id: number;
  value: string;
  attribute: {
    id: number;
    name: string;
  };
};
export type ProductType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  slug: string;
  description: string;
  isActive: boolean;
  isNew: boolean;
  isPopular: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
  images: {
    id: number;
    url: string;
  }[];
  attributeValues: AttributeValueType[];
};

export type ProductPaginateType = {
  items: ProductType[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
};
