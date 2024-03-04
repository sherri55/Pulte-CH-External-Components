import { ContentHubClient } from "@sitecore/sc-contenthub-webclient-sdk/dist/clients/content-hub-client.js";

export interface ContextProps {
  config: {
    marketApiEndpoint: string;
    communityApiEndpoint: string;
    updateCHCommunityEndpoint: string;
  };
  entity: {    
    systemProperties: {
      id: number;
      identifier: string;
    };
    properties: {
      CRMCommunity: {
        Invariant: string;
      }
      CRMMarket: {
        Invariant: string;
      }
    };
  };
  client: ContentHubClient;
  options?: unknown;
}
