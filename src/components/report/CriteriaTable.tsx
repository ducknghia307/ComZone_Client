import React, { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";

const CriteriaTable = () => {
  const [criteriaList, setCriteriaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const response = await privateAxios.get("/auction-criteria");
        const data = response.data;

        const transformedCriteria = [
          {
            name: "Thông tin đầy đủ",
            description:
              "Người bán phải cung cấp đầy đủ thông tin chi tiết về truyện, bao gồm: tên truyện, tác giả, thể loại, mô tả nội dung truyện, loại bìa, và màu sắc của truyện. Những thông tin này không chỉ giúp người mua hiểu rõ hơn về sản phẩm mà còn là yếu tố quan trọng để xây dựng niềm tin và sự minh bạch trong giao dịch.",
          },
          {
            name: "Tình trạng truyện",
            description: (
              <>
                Tình trạng của truyện phải đạt mức{" "}
                <span style={{ color: "red" }}>
                  {data.conditionLevel.name.toLowerCase()}
                </span>{" "}
                trở lên, tương đương{" "}
                <span style={{ color: "red" }}>
                  {data.conditionLevel.value}
                </span>
                /10 theo thang điểm đánh giá chất lượng.
              </>
            ),
          },
          {
            name: "Phiên bản truyện",
            description:
              "Kiểm tra xem yếu tố thể hiện phiên bản truyện và các ảnh đính kèm có khớp với phiên bản truyện mà người bán đã chọn hay không. Các ảnh đính kèm rất quan trọng trong việc xét duyệt truyện đấu giá.",
          },
        ];

        setCriteriaList(transformedCriteria);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching criteria:", error);
        setLoading(false);
      }
    };

    fetchCriteria();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <p>Đang tải tiêu chí...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2
        className="text-3xl font-bold text-center mb-8"
        style={{ color: "#71002b" }}
      >
        Tiêu chí duyệt đấu giá
      </h2>

      <div className="space-y-4">
        {criteriaList.map((criteria, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform transform hover:scale-105 duration-300"
            style={{
              animation: `fadeIn 0.5s ease-in-out ${index * 0.2}s forwards`,
              opacity: 0,
            }}
          >
            <div className="border-l-4 border-rose-700 p-6 hover:bg-rose-50 transition-colors duration-300">
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
  );
};

export default CriteriaTable;
