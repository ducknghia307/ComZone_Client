import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, Persistor } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";

// Encryption transformer for the auth slice only
const authEncryptor = encryptTransform({
  secretKey: "my-super-secret-key",
  onError: function (error) {
    console.error("Encryption error:", error);
  },
});

const authPersistConfig = {
  key: "auth",
  storage,
  transforms: [authEncryptor],
};

// Persist config for conversation slice without encryption
const conversationPersistConfig = {
  key: "conversation",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  // conversation: persistReducer(conversationPersistConfig, conversationReducer),
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "conversation"],
};

// Apply persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store setup
export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
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
