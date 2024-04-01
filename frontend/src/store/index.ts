import { create } from "zustand";

interface Destination {
    label: string;
    name: string;
}

type State = {
    lastLocation: {
        latitude: number | null;
        longitude: number | null;
    };
    travelDestinations: Destination[];
    transportation: string | null;
    setLastLocation: (latitude: number, longitude: number) => void;
    setTravelDestinations: (destinations: Destination[]) => void;
    setTransportation: (transportation: string) => void;
};

const useStore = create<State>((set) => ({
    lastLocation: { latitude: null, longitude: null },
    travelDestinations: [],
    transportation: null,
    setLastLocation: (latitude, longitude) =>
        set({ lastLocation: { latitude, longitude } }),
    setTravelDestinations: (destinations) =>
        set({ travelDestinations: destinations }),
    setTransportation: (transportation) => set({ transportation }),
}));

export default useStore;
