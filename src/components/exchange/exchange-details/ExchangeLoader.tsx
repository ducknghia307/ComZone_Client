import { UserInfo } from "../../../common/base.interface";
import { Avatar } from "antd";
import { CircularProgress } from "@mui/material";

export default function ExchangeLoader({
  firstUser,
  secondUser,
}: {
  firstUser: UserInfo;
  secondUser: UserInfo;
}) {
  return (
    <div className="flex items-center justify-center gap-32 translate-y-[-10%]">
      <div className="flex flex-col items-center justify-center gap-2">
        <Avatar src={firstUser.avatar} size={64} />
        <p className="font-semibold">{firstUser.name}</p>
      </div>

      <CircularProgress size="3rem" color="inherit" />

      <div className="flex flex-col items-center justify-center gap-2">
        <Avatar src={secondUser.avatar} size={64} />
        <p className="font-semibold">{secondUser.name}</p>
      </div>
    </div>
  );
}
