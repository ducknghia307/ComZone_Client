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
  isActive?: boolean;
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
  description?: string;
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
  duration?: number;
  depositAmount: number;
  maxPrice: number;
  isPaid?: boolean;
  paymentDeadline?: string;
  winner?: {
    id: string;
    name: string;
    createdAt: string;
  };
  currentCondition?: string;
  createdAt: Date;
  updatedAt?: Date;
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
  publishedDate: string | null;
  price: number;
  status: "AVAILABLE" | "PRE_ORDER" | "UNAVAILABLE" | "SOLD";
  quantity: number;
  episodesList: string[];
  previewChapter: string[];
  selected?: boolean;
  genres?: Genre[];
  sellerId: UserInfo;
  onSaleSince?: Date;
  type: "NONE" | "AUCTION" | "SELL";
  comics: {
    title: string;
    genres: Genre[];
    author: string;
    condition: "SEALED" | "USED";
    coverImage: string;
  };
  endTime: Date;
}

export interface OrderDetailData {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
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
  packageImages?: string[];
}

export interface Delivery {
  createdAt: string;
  deletedAt: string | null;
  deliveryFee: number | null;
  deliveryTrackingCode: string | null;
  estimatedDeliveryTime: string | null;
  status: string;
  from: {
    user: UserInfo;
    id: string;
    createdAt: string;
    note: string | null;
    status: string | null;
    name: string;
    phone: string;
    address: string;
    fullAddress?: string;
  };
  to: {
    user: UserInfo;
    id: string;
    createdAt: string;
    note: string | null;
    status: string | null;
    name: string;
    phone: string;
    address: string;
    fullAddress?: string;
  };
  packagingImages?: string[];
  expiredAt: string[];
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

export interface ExchangeData extends BaseInterface {
  compensationAmount: number | null;
  depositAmount: number | null;
  status:
    | "PENDING"
    | "DEALING"
    | "DELIVERING"
    | "SUCCESSFUL"
    | "FAILED"
    | "REJECTED";
  post: Post;
  requestUser: UserInfo;
  compensateUser: UserInfo | null;
  images: string[];
}

export interface Post extends BaseInterface {
  postContent: string;
  images: string[];
  status: "AVAILABLE" | "UNAVAILABLE";
  user: UserInfo;
}
