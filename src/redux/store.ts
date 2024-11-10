import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, Persistor } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import navigateReducer from "./features/navigate/navigateSlice";
import auctionReducer from "./features/auction/auctionSlice";

// Encryption transformer for the auth slice only
const rootPersistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2, // Optional: helps with merging persisted state
  keyPrefix: "redux-", // Optional prefix for storage key names
  transforms: [
    encryptTransform({
      secretKey: "my-super-secret-key",
      onError: function (error) {
        console.error("Encryption error:", error); // Handle encryption errors
      },
    }),
  ],
  whitelist: ["auth", "navigate", "auction"], // Persist only the 'auth' slice
};

const rootReducer = combineReducers({
  auth: authReducer,
  navigate: navigateReducer, // Add other reducers here as needed
  auction: auctionReducer,
});

// Typing for RootState and AppDispatch
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof makeStore>["store"]["dispatch"];

// Applying persistReducer with the correct typing
const persistedReducer = persistReducer<RootState>(
  rootPersistConfig,
  rootReducer
);

// Store setup
export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer, // Use persisted reducer
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable checks for non-serializable values
        immutableCheck: false, // Disable immutable state invariant check
      }),
  });

  const persistor = persistStore(store) as Persistor;
  return { store, persistor };
};
export type AppStore = ReturnType<typeof makeStore>["store"];
// Export types for persistor
export type { Persistor };
