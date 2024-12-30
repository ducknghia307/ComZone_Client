export interface ConditionGradingScale {
  conditionName: string;
  symbol: string;
  value: number;
  conditionState: string;
  usageLevel: string;
  description: string;
}

export const conditionGradingScales: ConditionGradingScale[] = [
  {
    conditionName: "Mint",
    symbol: "M",
    value: 100,
    conditionState: "Hoàn hảo",
    usageLevel: "Không sử dụng",
    description:
      "Tình trạng hoàn hảo, không có khuyết điểm. Bìa sáng bóng, không xước, mép và góc sắc nét. Giấy trắng hoặc hơi ngà, không ố vàng.",
  },
  {
    conditionName: "Near Mint/Mint",
    symbol: "NM/M",
    value: 98,
    conditionState: "Gần hoàn hảo",
    usageLevel: "Gần như không sử dụng",
    description:
      "Gần như hoàn hảo, có thể có một lỗi rất nhỏ, khó phát hiện. Mép bìa hoặc gáy có thể hơi mờ nhẹ.",
  },
  {
    conditionName: "Near Mint",
    symbol: "NM",
    value: 94,
    conditionState: "Rất đẹp",
    usageLevel: "Rất ít sử dụng",
    description:
      "Rất đẹp, chỉ có vài dấu hiệu nhỏ, như mép giấy hơi mòn. Gáy không có nếp gấp rõ rệt.",
  },
  {
    conditionName: "Very Fine/Near Mint",
    symbol: "VF/NM",
    value: 90,
    conditionState: "Gần như hoàn hảo",
    usageLevel: "Ít sử dụng",
    description:
      "Gần như hoàn hảo, nhưng có một số dấu hiệu sử dụng. Mép giấy hoặc góc có thể hơi quăn nhẹ.",
  },
  {
    conditionName: "Very Fine",
    symbol: "VF",
    value: 80,
    conditionState: "Rất tốt",
    usageLevel: "Sử dụng nhẹ",
    description:
      "Tình trạng rất tốt, nhưng có thể có vài lỗi nhỏ: mép bìa hơi mòn, giấy hơi ngả màu. Không ảnh hưởng đến thẩm mỹ tổng thể.",
  },
  {
    conditionName: "Fine",
    symbol: "FN",
    value: 60,
    conditionState: "Tốt",
    usageLevel: "Sử dụng vừa phải",
    description:
      "Tình trạng tốt, nhưng có dấu hiệu sử dụng rõ ràng. Có thể có vết gấp nhẹ trên bìa hoặc góc, giấy ngả màu nhiều hơn.",
  },
  {
    conditionName: "Very Good/Fine",
    symbol: "VG/FN",
    value: 50,
    conditionState: "Trung bình khá",
    usageLevel: "Sử dụng đáng kể",
    description:
      "Tình trạng trung bình, có dấu hiệu sử dụng đáng kể: mép mòn, vết nhăn, hoặc giấy hơi dính. Nội dung vẫn nguyên vẹn và rõ ràng.",
  },
  {
    conditionName: "Very Good",
    symbol: "VG",
    value: 40,
    conditionState: "Trung bình",
    usageLevel: "Sử dụng nhiều",
    description:
      "Nhiều dấu hiệu sử dụng: rách nhỏ, nếp gấp rõ, giấy ố vàng hoặc bìa mất độ sáng. Nội dung còn đầy đủ, nhưng thẩm mỹ bị ảnh hưởng.",
  },
  {
    conditionName: "Good",
    symbol: "GD",
    value: 20,
    conditionState: "Kém",
    usageLevel: "Sử dụng rất nhiều",
    description:
      "Hư hỏng rõ rệt: bìa bị rách, gáy lỏng lẻo, hoặc vài trang bị nhăn hoặc mất góc. Có thể có vết bút hoặc vẽ trên bìa/trang.",
  },
  {
    conditionName: "Fair",
    symbol: "FR",
    value: 10,
    conditionState: "Rất kém",
    usageLevel: "Hư hỏng nặng",
    description:
      "Hư hỏng nghiêm trọng, có thể thiếu trang hoặc bìa bị tách rời. Nội dung vẫn đọc được nhưng tổng thể rất kém.",
  },
  {
    conditionName: "Poor",
    symbol: "PR",
    value: 0,
    conditionState: "Tệ",
    usageLevel: "Hư hỏng hoàn toàn",
    description:
      "Rất tệ: bìa và trang có thể mất một phần lớn, giấy rách nát hoặc mòn. Giá trị chỉ còn ở mức lưu giữ kỷ niệm hoặc tham khảo.",
  },
];
