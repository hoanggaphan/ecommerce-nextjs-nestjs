export type CategoryType = {
  id: number;
  name?: string;
  image?: string;
  slug?: string;
  description?: string;
};

type OptionValues = {
  id: number;
  value: string;
  options: {
    id: number;
    name: string;
  };
};
export type OptionType = {
  id: number;
  name: string;
  optionValues: OptionValues[];
};

export type OptionValueType = {
  id: number;
  value: string;
  option: {
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
  optionValues: OptionValueType[];
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
