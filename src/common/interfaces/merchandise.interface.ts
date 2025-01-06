import { BaseInterface } from "../base.interface";

export interface Merchandise extends BaseInterface {
  name: string;
  subName?: string;
  description: string;
  caution?: string;
}
