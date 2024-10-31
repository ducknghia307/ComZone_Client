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
  is_verified: boolean;
  name: string;
  phone: string | null;
  avatar: string | null;
  refresh_token: string;
  role: string | null;
  updatedAt: string;
  balance: number;
  nonWithdrawableAmount: number;
}

//address
export interface Address {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailedAddress: string;
  isDefault: boolean;
  user: UserInfo;
}

//VN address
export interface Province {
  province: string;
  code: number;
}
export interface ProvinceDrop {
  label: string;
  value: number;
}
export interface Ward {
  ward: string;
  code: number;
}

export interface WardDrop {
  label: string;
  value: number;
}

export interface District {
  district: string;
  code: number;
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
  name: string;
}

export interface Auction {
  id: string;
  shopName: string;
  productName: string;
  status: "ongoing" | "completed" | "canceled";
  imgUrl: string;
  currentPrice?: string;
  userBid?: string;
  finalPrice?: string;
  isWin?: boolean;
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
  coverImage: string[];
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
}

//role
export interface Role {
  id: number;
  role_name: string;
}
