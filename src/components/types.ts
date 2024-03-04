import { Theme } from "@mui/material";

export type Context = {
  theme: Theme;
  config: ContextConfig;
};

export type ContextConfig = {
  getMarketApiEndoint: string,
  getCommunityApiEndpoint : string,
  updateCHCommunityEndpoint: string
};
