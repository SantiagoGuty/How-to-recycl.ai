export type RootStackParamList = {
  Home: undefined;
  Scanner: undefined;
  Chat: undefined;
  Profile: undefined;
  Preview: { imageUri: string };
  Result: {
    imageUri?: string;
    upc?: string;
    itemName?: string;
    coords?: { latitude: number; longitude: number };
  };
};