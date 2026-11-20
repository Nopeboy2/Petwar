// Hướng dẫn lần đầu: Sảnh → Chinh phục → Đảo Thiết Nham → boss 1 (Ferrox) → Đội hình → trận thật dẫn từng nước → tự chơi đến hết. Điều khiển ở ui/tutorial.js.
// sel = CSS selector vùng được làm sáng (nhiều phần tử → khung bao chung). Không có sel = bong bóng giữa màn.

// FLOW: chuỗi bước đi theo đường bấm thật. scr = màn hiện bước đó · force = chỉ vùng sáng bấm được, bấm thật sẽ sang màn kế.
export const FLOW = [
  { scr: 'home', sel: '.home .h-plv', text: 'Cấp người chơi. Thắng boss để nhận XP, mỗi cấp giúp cả đội mạnh thêm.' },
  { scr: 'home', sel: '.home .h-chip', text: 'Vàng và Kim cương. Vàng dùng để nâng cấp pet và mua đá ở Cửa hàng.' },
  { scr: 'home', sel: '.home .h-pet', text: 'Đây là 3 pet trong đội ra trận của bạn.' },
  { scr: 'home', sel: '.home .h-btn[data-act="pets"]', text: 'Pet: xem chỉ số, kỹ năng và nâng cấp pet.' },
  { scr: 'home', sel: '.home .h-btn[data-act="formation"]', text: 'Đội hình: chọn 3 pet và sắp thứ tự ra trận.' },
  { scr: 'home', sel: '.home .h-btn[data-act="bag"]', text: 'Túi đồ: đá nâng cấp, rương và chìa khoá nhận được sau trận.' },
  { scr: 'home', sel: '.home .h-btn[data-act="shop"]', text: 'Cửa hàng: mua đá nâng cấp bằng vàng, hàng làm mới mỗi ngày.' },
  { scr: 'home', sel: '.home .h-icon', text: 'Cài đặt: âm thanh, rung và xem lại hướng dẫn.' },
  { scr: 'home', sel: '.home .h-camp', text: 'Bấm Chinh phục để đi đánh boss!', force: true },
  { scr: 'islands', sel: '.il-map', text: 'Mỗi đảo mang một hệ Ngũ hành và có boss riêng. Hạ boss để mở đảo tiếp theo.' },
  { scr: 'islands', sel: '.il[data-i="0"]', text: 'Chọn Đảo Thiết Nham.', force: true },
  { scr: 'boss', sel: '.bs-l .bsc.on', text: 'Boss của đảo. Hạ boss trước mới mở được boss sau.' },
  { scr: 'boss', sel: '.bsd', text: 'Thông tin boss: máu, sức đánh, các đòn và hệ. Pet khắc hệ boss gây thêm sát thương.' },
  { scr: 'boss', sel: '.bsd-cap', text: 'Thắng 3⭐ để thu phục boss thành pet của bạn!' },
  { scr: 'boss', sel: '.bs-go', text: 'Bấm Chọn đội.', force: true },
  { scr: 'team', sel: '.tm-left', text: 'Đội ra trận gồm 3 ô, từ trên xuống. Chạm một ô rồi chạm ô khác để đổi chỗ.' },
  { scr: 'team', sel: '.tp-row', text: 'Kho pet: chạm pet để đưa vào đội. ▲ là pet khắc chế boss, ▼ là pet bị boss khắc.' },
  { scr: 'team', sel: '.pf-bar', text: 'Lọc pet theo hệ và vai trò.' },
  { scr: 'team', sel: '.tm-auto', text: 'Bấm Gợi ý đội để tự xếp đội mạnh nhất với boss này.', force: true },
  { scr: 'team', sel: '.tm-left', text: '"Khắc chế boss": pet gây ×1.5 sát thương và nhận ít đòn hơn. Pet đứng cạnh pet sinh ra hệ mình được thêm ATK.' },
  { scr: 'team', sel: '.tm-fight', text: 'Sẵn sàng! Bấm ĐÁNH!', force: true },
];

// Trận hướng dẫn = trận THẬT với boss 1 bằng đội hiện tại: chỉ số, thưởng, chiến lợi phẩm, mở khoá như bình thường.

// Mỗi nước dẫn: bàn cờ dựng sẵn (36 số, hàng trên xuống; 0 Kiếm · 1 Tim · 2 Xoắn · 3 Khiên · 4 Lửa),
// nước bắt buộc là đổi ô 20 ↔ 21 (hàng 4, cột 3–4) → ăn đúng 3 viên loại đó.
// Bàn sinh bằng engine (newBoard + kiểm matches/legalMoves/evalMove), seed 7.
const MOVE = [20, 21];
export const BATTLE_TOUR = [
  // pre = giải thích TRƯỚC khi cho vuốt/chạm · notes = điều vừa xảy ra SAU nước đó
  { board: '440221102330014234004002340223243102',
    pre: [{ sel: '.bossp .bh', text: '⚔ Kiếm gây sát thương lên boss. Hạ hết máu boss là thắng!' }],
    move: MOVE, text: 'Vuốt để đổi 2 viên cạnh nhau. Ghép 3 viên ⚔ Kiếm thành hàng!',
    notes: [
      { sel: '#b-next', text: 'Sau mỗi nước, boss đánh trả. Ô này báo trước đòn kế tiếp: đánh đơn, đánh lan hay cả đội.' },
      { sel: '.pet .ag', text: 'Con số % là khả năng mỗi pet bị boss nhắm. Tanker có % cao để đỡ đòn cho đồng đội.' },
    ] },
  { board: '014021423232320034112123031240314133',
    pre: [{ sel: '.pet .hp', text: '💗 Tim hồi máu cho pet đang yếu nhất.' }],
    move: MOVE, text: 'Ghép 3 viên 💗 Tim.' },
  { board: '240200303304024141332314312230231432',
    pre: [{ sel: '.pet .sh', text: '🛡 Khiên cho cả đội: chặn sát thương trước khi trừ vào máu.' }],
    move: MOVE, text: 'Ghép 3 viên 🛡 Khiên.' },
  { board: '210402002204421340440423144204313044', rage: 85,
    pre: [{ sel: '.pet .rg', text: '🔥 Lửa nạp nộ cho cả đội.' }],
    move: MOVE, text: 'Ghép 3 viên 🔥 Lửa.',
    notes: [{ sel: '.pet .rg', text: 'Nộ đầy thì pet phát sáng, sẵn sàng tung ULT!' }] },
  { ult: true, text: 'Chạm vào {pet} để tung ULT!', // {pet} = pet Sát thương đầu tiên còn sống (không có thì pet đầu)
    pre: [{ sel: '.pet', text: 'ULT: pet Sát thương gây đòn cực mạnh, pet Hỗ trợ hồi máu, Tanker tạo khiên cho cả đội.' }] },
  { board: '110023024324002104223231300241401004', stun: true, // thanh choáng đặt sẵn còn thiếu 3 vạch → nước này làm đầy
    pre: [{ sel: '.bossp .stun', text: '🌀 Xoắn nạp thanh choáng của boss.' }],
    move: MOVE, text: 'Ghép 3 viên 🌀 Xoắn.',
    notes: [{ sel: '.bossp .stun', text: 'Thanh choáng đầy: boss mất lượt, và nước kế tiếp của bạn gây thêm 50% sát thương.' }] },
  { notes: [{ text: 'Giờ tự chơi nhé! Hạ boss để nhận thưởng và mở boss tiếp theo.' }] },
];
