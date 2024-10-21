import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, Persistor } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

// Encryption transformer for the auth slice only
const rootPersistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2, // This is optional, but can help with merging state
  keyPrefix: "redux-", // Optional prefix for storage key names
  transforms: [
    encryptTransform({
      secretKey: "my-super-secret-key",
      onError: function (error) {
        console.error("Encryption error:", error); // Ensure error handling is robust
      },
    }),
  ],
  whitelist: ["auth"], // Whitelist reducers to be persisted
  // blacklist: ['conversation'], // Optionally use blacklist to exclude specific reducers
};

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here if needed
});

// Store setup
export const makeStore = () => {
  const store = configureStore({
    reducer:  persistReducer(rootPersistConfig, rootReducer),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable serializable check for non-serializable values
        immutableCheck: false, // Disable immutable state invariant for better performance
      }),
  });

  const persistor = persistStore(store) as Persistor;
  return { store, persistor };
};

// Export types for store, dispatch, and state
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["store"]["dispatch"];
export type RootState = ReturnType<AppStore["store"]["getState"]>;
export type { Persistor };
