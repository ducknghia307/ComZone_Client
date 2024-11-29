import React from "react";
import ComicZoneMembership from "../membership/ComicZoneMembership";
import { UserInfo } from "../../common/base.interface";

export default function SubscriptionRegister({
  user,
  setIsRegisterSellerModal,
}: {
  user: UserInfo;
  setIsRegisterSellerModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      <ComicZoneMembership
        user={user}
        setIsRegisterSellerModal={setIsRegisterSellerModal}
      />
    </div>
  );
}
