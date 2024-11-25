export interface BaseInterface {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

//userInfo
export interface UserInfo {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  avatar: string;
  refresh_token: string;
  role: string | null;
  updatedAt: string;
  balance: number;
  nonWithdrawableAmount: number;
  last_active?: Date | null;
  isActive: boolean;
  follower_count?: number;
  address: string;
}

//address
export interface Address {
  id: string;
  fullName: string;
  phone: string;
  province: Province;
  district: District;
  ward: Ward;
  detailedAddress: string;
  isDefault: boolean;
  user: UserInfo;
  fullAddress: string;
}

//VN address
export interface Province {
  name: string;
  id: number;
}
export interface ProvinceDrop {
  label: string;
  value: number;
}
export interface Ward {
  name: string;
  id: string;
}

export interface WardDrop {
  label: string;
  value: string;
}

export interface District {
  name: string;
  id: number;
}

export interface DistrictDrop {
  label: string;
  value: number;
}

export interface GetAddressCode {
  districtCode: number;
  provinceCode: number;
  wardCode: number;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Auction {
  id: string;
  shopName: string;
  productName: string;
  status: string;
  imgUrl: string;
  currentPrice?: number;
  userBid?: number;
  finalPrice?: number;
  isWin?: boolean;
  reservePrice: number;
  priceStep: number;
  startTime: string;
  endTime: string;
  comics: Comic;
  depositAmount: number;
  maxPrice: number;
  isPaid?: boolean;
  paymentDeadline?: string;
  winner?: {
    id: string;
    name: string;
  };
}

//comic
export interface Comic {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  condition: "SEALED" | "USED";
  edition: "REGULAR" | "SPECIAL" | "LIMITED";
  page: number | null;
  publishedDate: string;
  price: number;
  status: string;
  quantity: number;
  previewChapter: string[];
  selected?: boolean;
  genres?: Genre[];
  sellerId: UserInfo;
  onSaleSince?: Date;
  type: "TRADITIONAL" | "AUCTION";
  comics: {
    title: string;
    genres: Genre[];
    author: string;
    condition: "SEALED" | "USED";
    coverImage: string;
  };
}

export interface OrderDetailData {
  id: string;
  createdAt: string;
  updatedAt: string;
  deliveryTrackingCode: string | null;
  totalPrice: number;
  paymentMethod: string;
  fromName: string;
  fromPhone: string;
  fromAddress: string;
  fromProvinceName: string;
  fromDistrictName: string;
  fromWardName: string;
  toName: string;
  toPhone: string;
  toAddress: string;
  deliveryFee: number;
  isPaid: boolean;
  status: string;
  note: string;
  user?: UserInfo;
  cancelReason: string;
  deliveryStatus: string;
  items: Array<{
    comics: {
      coverImage: string;
      title: string;
      author: string;
      price: number;
      volumeType: string;
    };
  }>;
  delivery: Delivery;
}

export interface Delivery {
  createdAt: string;
  deletedAt: string | null;
  deliveryFee: number | null;
  deliveryTrackingCode: string | null;
  estimatedDeliveryTime: string | null;
  status: string;
  from: {
    id: string;
    createdAt: string;
    note: string | null;
    status: string | null;
    name: string;
    phone: string;
    address: string;
  };
  to: {
    id: string;
    createdAt: string;
    note: string | null;
    status: string | null;
    name: string;
    phone: string;
    address: string;
  };
}

export interface SellerDetails extends BaseInterface {
  user: UserInfo;
  verifiedPhone: string;
  soldCount: number;
  followerCount: number;
  province: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  ward: {
    id: string;
    name: string;
  };
  detailedAddress: string;
  fullAddress: string;
}
