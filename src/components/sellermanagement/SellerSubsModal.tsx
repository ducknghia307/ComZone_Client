import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import ComicZoneMembership from "../membership/ComicZoneMembership";
import { UserInfo } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import { SellerSubscription } from "../../common/interfaces/seller-subscription.interface";

export default function SellerSubsModal({
  isOpen,
  setIsOpen,
  callback,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callback?: () => void;
}) {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [userSubs, setUserSubs] = useState<SellerSubscription | null>();

  const fetchUserSubs = async () => {
    await privateAxios
      .get(`users/profile`)
      .then((res) => setUserInfo(res.data))
      .catch((err) => console.log(err));

    await privateAxios
      .get(`seller-subscriptions/user`)
      .then((res) => setUserSubs(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUserSubs();
  }, []);

  return (
    <Modal
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setIsOpen(false);
      }}
      footer={null}
      centered
      width="auto"
      styles={{ content: { padding: "0", borderRadius: "10%" } }}
    >
      <ComicZoneMembership
        user={userInfo}
        callback={callback}
        setIsOpen={setIsOpen}
        userSubs={userSubs}
      />
    </Modal>
  );
}
