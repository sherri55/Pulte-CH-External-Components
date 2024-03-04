import ReactDOM from "react-dom";
import React, { useState, useEffect} from "react";
import axios from "axios";
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import { ContextProps } from "./types";

const OptionsContext = React.createContext<any>(null);

export default function createExternalRoot(container: HTMLElement) {
  function MarketCommunity({ context }: { context: ContextProps }) {
    interface Market {
      id: number;
      name: string;
      number: string;
    }

    interface SalesCommunity {
      id: number;
      name: string;
      number: string;
    }

    const [marketItems, setMarketItems] = useState<Market[]>([]);
    const [salesCommunityItems, setSalesCommunityItems] = useState<SalesCommunity[]>([]);
    const [selectedMarketId, setSelectedMarketId] = useState<string>(context.entity?.properties.CRMMarket.Invariant || "");
    const [selectedCommunityId, setSelectedCommunityId] = useState<string>(context.entity?.properties.CRMCommunity.Invariant || "");

    // Fetch market and community data
    useEffect(() => {
      const fetchData = async () => {
        try {
          const marketResponse = await axios.get(context.config.marketApiEndpoint);
          setMarketItems(marketResponse.data.value);
          const communityResponse = await axios.get(`${context.config.communityApiEndpoint}?marketId=${selectedMarketId}`);
          setSalesCommunityItems(communityResponse.data.value);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, [context.config.marketApiEndpoint, context.config.communityApiEndpoint, selectedMarketId]);

    // Handle market and community changes
    const handleMarketChange = (event: SelectChangeEvent) => {
      const newMarketId = event.target.value as string;
      setSelectedMarketId(newMarketId);
      // Update entity with new market
      updateEntity("Market", newMarketId);
    };

    const handleCommunityChange = (event: SelectChangeEvent) => {
      const newCommunityId = event.target.value as string;
      setSelectedCommunityId(newCommunityId);
      // Update entity with new community
      updateEntity("Community", newCommunityId);
    };

    const updateEntity = async (property: string, newValue: string): Promise<void> => {
      try {
        const id = context.entity.systemProperties.id;
        const jobEntity = await context.client.entities.getAsync(id);
        if (property === "Market") {
          jobEntity?.setPropertyValue("CRMMarket", newValue);
        } else if (property === "Community") {
          jobEntity?.setPropertyValue("CRMCommunity", newValue);
        }
        if (jobEntity) {
          await context.client.entities.saveAsync(jobEntity);
        }
      } catch (error) {
        console.error(`Error updating entity for ${property}:`, error);
      }
    };

    return (
      <Paper>
        <Stack sx={{ p: 3, maxWidth: 800 }}>
          <FormControl fullWidth sx={{ my: 4 }}>
            <InputLabel>Select CRM Market</InputLabel>
            <Select value={selectedMarketId} onChange={handleMarketChange} label="Select CRM Market">
              {marketItems.map((item) => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 4 }}>
            <InputLabel>Select CRM Community</InputLabel>
            <Select value={selectedCommunityId} onChange={handleCommunityChange} label="Select CRM Community">
              {salesCommunityItems.map((item) => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>
    );
  }

  return {
    render(context: ContextProps) {
      ReactDOM.render(
        <OptionsContext.Provider value={context.options}>
          <MarketCommunity context={context} />
        </OptionsContext.Provider>,
        container
      );
    },
    unmount() {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
}
