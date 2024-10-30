import React, { useState } from "react";

interface DeliveryOption {
  id: number;
  name: string;
  maxWeight: string;
  maxDimensions: string;
  maxOrderValue: string;
  customerService: string;
  restrictions: string;
  isEnabled: boolean;
  isPriority: boolean;
}

const deliveryOptions: DeliveryOption[] = [
  {
    id: 1,
    name: "Giao Hàng Nhanh",
    maxWeight: "100kg",
    maxDimensions: "200cm",
    maxOrderValue: "20 triệu đồng",
    customerService: "1800 6328",
    restrictions: "Không vận chuyển đồ uống và thực phẩm tươi",
    isEnabled: true,
    isPriority: true,
  },
  {
    id: 2,
    name: "J&T Express",
    maxWeight: "10000g",
    maxDimensions: "100cm",
    maxOrderValue: "10 triệu đồng",
    customerService: "1900 1080",
    restrictions: "Không vận chuyển hàng dễ vỡ",
    isEnabled: true,
    isPriority: false,
  },
  {
    id: 3,
    name: "Ninja Van",
    maxWeight: "5000g",
    maxDimensions: "150cm",
    maxOrderValue: "15 triệu đồng",
    customerService: "1900 1108",
    restrictions: "Không vận chuyển hàng hóa độc hại",
    isEnabled: true,
    isPriority: false,
  },
  {
    id: 4,
    name: "VNPost Tiết Kiệm",
    maxWeight: "2000g",
    maxDimensions: "120cm",
    maxOrderValue: "5 triệu đồng",
    customerService: "1900 6668",
    restrictions: "Không vận chuyển hàng dễ cháy",
    isEnabled: false,
    isPriority: false,
  },
];

const DeliveryMethod: React.FC = () => {
  const [options, setOptions] = useState(deliveryOptions);

  const toggleEnable = (id: number) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, isEnabled: !option.isEnabled } : option
      )
    );
  };

  const setPriority = (id: number) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id
          ? { ...option, isPriority: true }
          : { ...option, isPriority: false }
      )
    );
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      {options.map((option) => (
        <div
          key={option.id}
          className="mb-4 p-4 bg-white border rounded-md shadow-sm"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{option.name}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="mr-2">Kích hoạt</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={option.isEnabled}
                    onChange={() => toggleEnable(option.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <span className="mr-2">Ưu tiên</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={option.isPriority}
                    onChange={() => setPriority(option.id)}
                    disabled={!option.isEnabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-green-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>Khối lượng tối đa: {option.maxWeight}</p>
            <p>Kích thước tối đa: {option.maxDimensions}</p>
            <p>Giá trị đơn hàng tối đa: {option.maxOrderValue}</p>
            <p>Hỗ trợ: {option.customerService}</p>
            <p>Hạn chế: {option.restrictions}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryMethod;
