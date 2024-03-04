import { ContentHubClient } from "@sitecore/sc-contenthub-webclient-sdk/dist/clients/content-hub-client.js";

export interface ContextProps {
  config: {
    pictureParkUrl: string;
    FieldName: string
  };
  entity: {
    systemProperties: {
      id: number;
      identifier: string;
    };
    properties: {
      AssociatedImages:{
        Invariant: string;
      }
    };
  };
  client: ContentHubClient;
  options?: unknown;
}
