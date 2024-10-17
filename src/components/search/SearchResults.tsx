import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('query');

  // Gửi yêu cầu tìm kiếm comic dựa trên query này
  // Ví dụ: fetch comics có tên chứa `query`

  return (
    <div>
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>
      {/* Hiển thị kết quả tìm kiếm */}
    </div>
  );
};

export default SearchResults;
