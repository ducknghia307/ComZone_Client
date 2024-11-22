import DeliveryAddress from "../../../checkout/DeliveryAddress";
import { Address } from "../../../../common/base.interface";
interface DeliveryAddressProps {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  addresses: Address[];
  setAddresses: (list: Address[]) => void;
  fetchUserAddress: () => void;
}
export default function SubmitDeliveryInfo({
  selectedAddress,
  setSelectedAddress,
  addresses,
  setAddresses,
  fetchUserAddress,
}: DeliveryAddressProps) {
  return (
    <div className="w-full flex">
      <DeliveryAddress
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        addresses={addresses}
        setAddresses={setAddresses}
        fetchUserAddress={fetchUserAddress}
      />
    </div>
  );
}
