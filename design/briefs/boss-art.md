# Prompt — Hình 5 boss (dạng Boss + dạng Pet sau khi thu phục)

Gửi cho AI vẽ hình: file này và **1 ảnh pet có sẵn làm mẫu phong cách**, ví dụ `design/source/pet_rockmane_idle.png`. Ảnh mẫu giúp boss cùng nét vẽ với 5 pet hiện có.
Dán nguyên văn các lệnh (tiếng Anh). Phần trong `{ }` đổi theo từng boss ở mục 3.

---

## 1. Ý tưởng

Mỗi boss là **một sinh vật**, xuất hiện ở 2 dạng **cùng một thiết kế**:

| | Dạng Boss (trong trận) | Dạng Pet (sau khi thu phục) |
|---|---|---|
| Ở đâu | Cột phải màn trận, chọn boss, bản đồ đảo | Mọi chỗ pet đang xuất hiện: sảnh, đội hình, trận (cột trái), chi tiết pet |
| Cỡ hiển thị | **230 × 230** trong trận, gấp khoảng **2,3 lần pet** (pet 100) | **Đúng cỡ pet** (100 trong trận, 280 ở chi tiết) |
| Hướng | Quay mặt sang **trái** | Quay mặt sang **phải** |
| Thần thái | Uy nghi, dữ, có hào quang hệ | Giữ nguyên thiết kế, mặt thân thiện hơn, hào quang nhỏ lại |

Vì vậy sinh vật phải **đọc được ở cả 2 cỡ**: dáng rõ, màu theo hệ, ít chi tiết vụn.
Boss **không trùng loài** với 5 pet hiện có (sư tử Thổ, linh thủy, cáo lá, hổ lửa, sói thép).

**Hai cách làm dạng Pet (chọn một):**
- **A. Dùng lại hình boss (khuyên dùng, rẻ nhất):** lật ngang hình boss và thu về khung pet. Chỉ cần vẽ thêm tư thế Ăn mừng và Chân dung. Muốn vậy, thiết kế boss phải **đối xứng được**: không chữ, không ký hiệu một chiều.
- **B. Vẽ bản "đã thuần":** cùng sinh vật nhưng nhỏ gọn, mắt to và hiền hơn, bỏ xích hoặc hào quang. Đẹp hơn nhưng phải vẽ đủ 6 tư thế.

---

## 2. Các khối dùng chung

**[MẪU]** (đặt đầu lệnh, kèm ảnh pet mẫu):
```
Use the attached image ONLY as an art-style reference (line weight, shading, color saturation, level of detail).
Do NOT copy the character in it. Draw a completely new creature described below.
```

**[STYLE]**:
```
2D mobile game character art, cute but powerful chibi fantasy creature, thick clean dark-brown outlines,
soft cel shading, vibrant saturated colors, crisp edges, high detail, bold readable silhouette
that is still recognizable when shrunk to 100 pixels
```

**[KHUNG BOSS]**:
```
Square 1:1 canvas, single character, full body fully visible including tail, horns and effects,
3/4 view facing LEFT, character fills about 90% of the canvas height, centered horizontally,
feet on a ground line at 92% of the height, plain pure white background,
no shadow under the feet, no ground, no text, no logo, no frame. --ar 1:1
```

**[KHUNG PET]** (dạng thu phục, cách B):
```
Square 1:1 canvas, single character, full body fully visible, 3/4 view facing RIGHT,
character fills about {TỈ LỆ VAI} of the canvas height, centered horizontally,
feet on a ground line at 92% of the height, plain pure white background,
no shadow, no ground, no text, no frame. --ar 1:1
```
Tỉ lệ theo vai (khớp 5 pet hiện có): Tanker 80–85%, Hỗ trợ 65–70%, Sát thương 72–78%.

---

## 3. Năm boss

| # | Đảo / Hệ | Tên (đề xuất) | Lối đánh hiện tại | Vai khi thành pet |
|---|---|---|---|---|
| 1 | Thiết Nham · Kim | **Gearhorn** | Dễ: đơn, đơn, lan | Tanker |
| 2 | Rừng Ngàn · Mộc | **Elderoot** | Vừa: đơn, lan, toàn đội | Hỗ trợ |
| 3 | Thủy Cung · Thủy | **Pearlwyrm** | Khó: toàn đội nhiều | Hỗ trợ |
| 4 | Hỏa Sơn · Hỏa | **Magmaw** | Rất khó: "Bùng nổ", ATK cao, dễ choáng | Sát thương |
| 5 | Hoàng Thổ · Thổ | **Duneshell** | Cực khó: "Pháo đài", máu trâu, khó choáng | Tanker |

**{NHÂN VẬT}** cho từng boss (dán vào lệnh ở mục 4):

**1. Gearhorn (Kim)**
```
The creature: a stout mechanical rhinoceros-beetle made of polished silver steel and brass,
one big golden drill-horn on its nose, small gears turning on its shoulders,
glowing yellow crystal shards growing from its back, riveted armor plates, short thick legs,
glowing amber eyes, small puffs of steam from vents on its sides. Color palette: silver, brass gold, amber yellow.
```

**2. Elderoot (Mộc)**
```
The creature: an ancient forest stag spirit with a body of mossy bark and soft green fur,
huge branching antlers covered with leaves, glowing pink mushrooms and tiny flowers,
hanging vines like a beard, a glowing green leaf-shaped gem on its chest, hooves of polished wood,
gentle but powerful glowing jade eyes, floating leaves and fireflies around it. Color palette: moss green, bark brown, soft pink accents.
```

**3. Pearlwyrm (Thủy)**
```
The creature: a graceful sea serpent-dragon with shimmering aqua and pearl-white scales,
a crown of seashells and coral on its head with a big glowing pearl in the center, flowing translucent fins
like silk, curled coiled tail, small whiskers, deep blue glowing eyes, water bubbles and droplets swirling around it.
Color palette: aqua blue, pearl white, coral pink.
```

**4. Magmaw (Hỏa)**
```
The creature: a stocky lava salamander-dragon with cracked black obsidian armor plates,
glowing molten orange lava visible through the cracks, a wide jaw with a fiery glow inside,
small volcano-shaped spikes on its back puffing smoke and embers, short powerful legs with stone claws,
burning yellow eyes, sparks and ash floating around. Color palette: obsidian black, lava orange, fire yellow.
```

**5. Duneshell (Thổ)**
```
The creature: a giant desert tortoise with a sandstone shell shaped like an ancient temple ruin,
small carved pillars and a stone arch on top of the shell, tiny cacti and dry grass growing on it,
thick rocky legs, a calm wise face with golden eyes, golden ancient bracelets on its front legs,
sand trickling from the shell edges. Color palette: sandstone yellow, terracotta red, desert gold.
```

---

## 4. Lệnh vẽ

### 4.1 Dạng Boss: hình chính (làm trước, mỗi boss 1 lệnh)
**[MẪU] + {NHÂN VẬT} + dòng dưới + [STYLE] + [KHUNG BOSS]**
```
Boss version: standing tall in a confident, intimidating stance, chest out, glowing {MÀU HỆ} elemental aura
around the body, a few floating {HIỆU ỨNG HỆ} particles, menacing but cute expression.
```
| Boss | {MÀU HỆ} | {HIỆU ỨNG HỆ} |
|---|---|---|
| Gearhorn | golden-silver | small gears and sparks |
| Elderoot | emerald green | leaves and fireflies |
| Pearlwyrm | aqua blue | bubbles and water droplets |
| Magmaw | orange-red | embers and ash |
| Duneshell | sandy gold | sand grains and small pebbles |

Gửi ảnh cho mình. Mình tách nền, căn chân vào vạch 92% và xuất `boss_<id>.webp` 512 px.

### 4.2 Dạng Boss: bộ tư thế (đính kèm **hình chính 4.1** làm tham chiếu)
```
Use the attached image as the exact character reference. Keep the same creature design:
same species, colors, armor, markings, proportions and art style. Do not redesign anything.

{NHÂN VẬT}

Character pose sheet: the SAME creature drawn five times in a single row, evenly spaced, same size,
all facing LEFT, full body, nothing overlapping:
1) idle: standing, breathing calmly, aura glowing softly;
2) attack: lunging forward to the left, mouth open, aura flaring;
3) hurt: recoiling backward to the right, eyes squeezed shut, small impact stars;
4) stunned: wobbling with dizzy swirl eyes, small stars circling its head, aura faded;
5) defeated: lying down on its belly, tired closed eyes, aura gone, still cute (not gory).

[STYLE]
Plain pure white background, no shadows, no ground, no text, no numbers, no grid lines. --ar 5:1
```
Cần ảnh rộng ≥ 2500 px. Tư thế 5 (gục) dùng ngay trước màn **thu phục**.

### 4.3 Dạng Pet (sau khi thu phục)

**Cách A (dùng lại hình boss):** chỉ vẽ thêm 2 ảnh, đính kèm hình chính 4.1:
```
Use the attached image as the exact character reference. Keep the same creature design. Do not redesign anything.
{NHÂN VẬT}
Two images of the SAME creature side by side, both facing RIGHT, full body:
1) happy: jumping joyfully with a big friendly smile, closed happy eyes, small sparkles;
2) head-and-shoulders portrait, friendly confident smile, eyes at about 40% from the top, simple bold shapes.
[STYLE]
Plain pure white background, no shadows, no text. --ar 2:1
```
Mình sẽ lật ngang các tư thế 4.2 (idle, attack, hurt, defeated) để làm pet quay phải. Tư thế ULT của pet dùng idle cộng hiệu ứng hào quang bằng code.

**Cách B (bản đã thuần, vẽ đủ):** đính kèm hình chính 4.1:
```
Use the attached image as the character reference: the SAME creature after being befriended and tamed.
Keep species, colors, armor pieces and markings, but make it a friendly companion:
slightly smaller and rounder chibi proportions, bigger gentle eyes, calm happy expression,
aura reduced to a few small particles, no chains or menacing details.

{NHÂN VẬT}

Character pose sheet: the SAME tamed creature drawn six times in a single row, evenly spaced, same size,
all facing RIGHT, full body: 1) idle standing; 2) attack lunging to the right; 3) hurt recoiling to the left;
4) ultimate move with a bright {MÀU HỆ} aura; 5) knocked out lying on its side with dizzy swirl eyes;
6) jumping happily celebrating.

[STYLE]
Plain pure white background, no shadows, no ground, no text, no grid lines. --ar 6:1
```
Kèm thêm 1 lệnh chân dung như cách A, ảnh 2.

---

## 5. Kích thước và tên file

| Ảnh | Vẽ gốc | Xuất cho game | Tên file |
|---|---|---|---|
| Boss: hình chính, 5 tư thế | 1024 × 1024 | 512 px | `assets/bosses/boss_<id>_<idle·attack·hurt·stun·down>.webp` |
| Pet (thu phục): tư thế | 1024 × 1024 | 256 px và bản `_L` 560 px | `assets/pets/pet_<id>_<tư thế>[_L].webp` (giống 5 pet hiện có) |
| Pet: chân dung | 512 × 512 | 144 px | `assets/pets/pet_<id>_portrait.webp` |

`<id>`: `gearhorn`, `elderoot`, `pearlwyrm`, `magmaw`, `duneshell`.

---

## 6. Cơ chế thu phục

**Đã làm (bản đơn giản):** lần đầu thắng boss **3⭐** → nhận boss đó làm pet (Lv 1). Ảnh pet = ảnh boss lật ngang (cách A, `node design/tools/pet.mjs --all <id>`). Chỉ số ở `data/pets.js` (`cap` = chỉ số boss). Chưa thu phục thì màn Pet hiện thẻ bóng đen "🔒 3⭐ Boss N". Các ý dưới đây là đề xuất mở rộng, chưa làm.

- **Mảnh hồn:** mỗi lần thắng boss nhận mảnh hồn boss đó. Lần đầu đạt 1★, 2★, 3★ được thêm mảnh. Đủ mảnh thì **thu phục**: boss thu nhỏ về cỡ pet, quay sang phải, vào kho pet ở Lv 1.
- **Màn thu phục** (sau màn Kết quả): boss ở tư thế gục, cỡ lớn → hiện vòng sáng hệ → boss co lại còn cỡ pet, lật quay phải → đổi sang ảnh pet `happy` + chữ "Đã thu phục {tên}!".
- **Chỉ số khi thành pet:** theo vai ở mục 3 và cùng mặt bằng 5 pet hiện có, không mang HP/ATK của boss. Cân lại bằng `node sim.js`.

---

## 7. Kiểm khi nhận ảnh
- [ ] Boss quay **trái**, pet quay **phải**. Cách A: hình lật ngang không bị ngược chữ hay ký hiệu.
- [ ] Không trùng loài và màu với 5 pet hiện có.
- [ ] Thu ảnh boss về 100 px vẫn nhận ra (để dùng làm pet).
- [ ] Nền trắng tinh, không bóng, không chữ. Đuôi, sừng, hiệu ứng không bị cắt mép.
- [ ] Các tư thế cùng cỡ, chân cùng một vạch đất.
