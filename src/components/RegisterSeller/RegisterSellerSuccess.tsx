const RegisterSellerSuccess = () => {
  return (
    <div className="w-full REM flex items-stretch ">
      <div className="flex flex-col justify-start items-start py-8 gap-4 relative max-h-96 overflow-y-auto overflow-x-hidden">
        <h2 className="font-bold text-xl">ĐIỀU KHOẢN SỬ DỤNG VÀ CAM KẾT</h2>

        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Giới thiệu</p>
          <p className="font-light text-xs">
            Chào mừng bạn đến với nền tảng ComZone – nơi giao lưu, mua bán và
            trao đổi truyện tranh đa dạng và chất lượng. Khi sử dụng dịch vụ của
            ComZone, bạn đồng ý tuân thủ các điều khoản và cam kết sau đây. Nếu
            không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng nền
            tảng.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">
            Quyền và Trách Nhiệm của Người Sử Dụng
          </p>
          <div className="flex flex-col gap-1">
            <p>Đăng ký tài khoản</p>
            <p className="font-light text-xs">
              Người dùng cần đăng ký tài khoản với thông tin chính xác và đảm
              bảo cập nhật thông tin kịp thời. ComZone không chịu trách nhiệm
              nếu có tranh chấp xảy ra do thông tin đăng ký không chính xác.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p>Quyền lợi</p>
            <p className="font-light text-xs">
              ComZone cam kết bảo vệ quyền lợi người dùng trong mọi giao dịch
              trên nền tảng. Người dùng có quyền khiếu nại về các vấn đề liên
              quan đến giao dịch, sản phẩm và dịch vụ được cung cấp. ComZone sẽ
              xử lý khiếu nại và hỗ trợ giải quyết trong thời gian sớm nhất.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">
            Hình Thức Giao Hàng và Thanh Toán
          </p>
          <div className="flex flex-col gap-1">
            <p>Giao hàng</p>
            <p className="font-light text-xs">
              Tất cả các sản phẩm được giao dịch trên nền tảng sẽ sử dụng dịch
              vụ giao hàng do ComZone cung cấp. Chúng tôi sẽ hỗ trợ kiểm tra,
              đảm bảo chất lượng và bảo vệ sản phẩm trong suốt quá trình vận
              chuyển để người dùng nhận được sản phẩm đúng thời hạn, nguyên vẹn
              và đúng như mô tả.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p>Thanh toán</p>
            <p className="font-light text-xs">
              ComZone hỗ trợ nhiều hình thức thanh toán, đảm bảo tiện lợi và an
              toàn cho người dùng. Mọi giao dịch cần được thực hiện qua các kênh
              thanh toán chính thức trên nền tảng để bảo vệ quyền lợi của cả hai
              bên.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">
            Cam Kết Về Chất Lượng Dịch Vụ và Quyền Lợi Người Dùng
          </p>
          <p className="font-light text-xs">
            ComZone cam kết rằng mọi giao dịch trên nền tảng luôn được giám sát
            và thực hiện theo quy trình an toàn, minh bạch. Chúng tôi bảo đảm:
          </p>
          <p className="font-light text-xs px-8">
            <span className="font-semibold">
              &#8226; &ensp;Bảo mật thông tin cá nhân:
            </span>
            &ensp;Mọi thông tin cá nhân của người dùng sẽ được bảo mật tuyệt đối
            và chỉ sử dụng cho mục đích phục vụ giao dịch.
          </p>
          <p className="font-light text-xs px-8">
            <span className="font-semibold">
              &#8226; &ensp;Chất lượng sản phẩm:
            </span>
            &ensp;ComZone cam kết sản phẩm đúng mô tả, chất lượng như thỏa thuận
            và có cơ chế đổi/trả rõ ràng.
          </p>
          <p className="font-light text-xs px-8">
            <span className="font-semibold">
              &#8226; &ensp;Bảo vệ quyền lợi khách hàng:
            </span>
            &ensp;ComZone sẽ đứng ra bảo vệ quyền lợi người dùng trong các
            trường hợp xảy ra tranh chấp.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">
            Quy định về Trách nhiệm và Quyền hạn của ComZone
          </p>
          <p className="font-light text-xs">
            ComZone có quyền tạm ngưng hoặc chấm dứt tài khoản nếu người dùng vi
            phạm các quy định của nền tảng. Chúng tôi cũng có quyền thay đổi
            điều khoản sử dụng và cam kết này, nhưng sẽ thông báo đến người dùng
            trước khi áp dụng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSellerSuccess;
