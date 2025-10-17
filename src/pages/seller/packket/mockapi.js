// mockApi.js
// Giả lập API trả về danh sách gói dịch vụ

export const fetchPackages = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'member',
          name: 'FUO MEMBER',
          price: '48,000đ',
          duration: '1 tháng',
          features: [
            'Xem được các tài liệu của thành viên đăng',
            'Hiển thị nội dung giải đáp của các thành viên',
            'Comment và đặt câu hỏi trong diễn đàn',
            'Nhận các danh hiệu học tập',
            'Xem và tải các tài liệu code, giáo trình',
          ],
          isFeatured: false,
        },
        {
          id: 'vip',
          name: 'FUO VIP',
          price: '200,000đ',
          duration: '8 tháng',
          features: [
            'Toàn quyền của gói Member',
            'Sở hữu màu **username** đặc biệt',
            'Không cần chờ duyệt khi đăng bài',
            'Nhận **FUO Point** khi comment đáp án',
            'Được hỗ trợ ưu tiên giải đáp thắc mắc',
          ],
          isFeatured: true,
        },
      ]);
    }, 500);
  });
};
