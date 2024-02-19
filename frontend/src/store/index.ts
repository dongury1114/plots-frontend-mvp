// src/store/index.js

import { create } from 'zustand';

type State = {
    lastLocation: {
        latitude: number | null;
        longitude: number | null;
    };
    setLastLocation: (latitude: number, longitude: number) => void;
};

const useStore = create<State>(set => ({
    lastLocation: { latitude: null, longitude: null },
    setLastLocation: (latitude, longitude) =>
        set({ lastLocation: { latitude, longitude } }),
}));

export default useStore;
