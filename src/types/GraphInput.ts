import type { GraphLink } from "./GraphLink";

export type GraphInput = {
  identifier: string;
  links: GraphLink[];
  type: string;
  is_multi_input: boolean;
  value: any;
};