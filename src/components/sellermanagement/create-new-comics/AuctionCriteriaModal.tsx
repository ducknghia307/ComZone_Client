import { Modal } from "antd";
import React from "react";

export default function AuctionCriteriaModal({
  open,
  setOpen,
  criteriaList,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  criteriaList: { name: string; description: React.ReactNode }[];
}) {
  return (
    <Modal
      open={open}
      onCancel={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
      footer={null}
      width={1000}
    >
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-semibold uppercase text-center mb-8">
          Tiêu chí duyệt đấu giá
        </h2>

        <div className="space-y-4">
          {criteriaList.map((criteria, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform transform hover:scale-105 duration-300 cursor-default"
              style={{
                animation: `fadeIn 0.5s ease-in-out ${index * 0.2}s forwards`,
                opacity: 0,
              }}
            >
              <div className="border-l-4 border-sky-700 p-6 hover:bg-gray-50 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {criteria.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {criteria.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <style>
          {`
          @keyframes fadeIn {
            from {
              transform: translateY(10px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
        </style>
      </div>
    </Modal>
  );
}
