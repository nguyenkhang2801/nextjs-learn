---
name: pokemon-name-meaning
description: Viết lời dẫn văn nói tiếng Việt về ý nghĩa tên Pokémon từ file md, ngắn gọn, để AI đọc chèn vào video. Chỉ dùng khi người dùng gọi trực tiếp.
disable-model-invocation: true
---

# Lời dẫn ý nghĩa tên Pokémon (ngắn, thẳng)

## Mục tiêu

Từ file md nguồn, viết lời dẫn tiếng Việt văn nói để AI đọc chèn vào video. Mỗi Pokémon chỉ một đoạn ngắn, không mở bài, không kết bài, không bình luận thêm.

## Dữ liệu trong file nguồn

- `🍃𝟎𝟎𝟎𝟏: Tên` → số thứ tự và tên
- `✦ Phiên âm:` → romaji + katakana
- `✦ Hệ:` → hệ
- `- Đen:` → nghĩa đen + công thức ghép (`Kỳ diệu (fushigi) + Hạt giống (tane)`)
- `- Bóng:` → nghĩa bóng / chơi chữ (không phải con nào cũng có)
- `✨Tiến Hóa:` → chuỗi tiến hóa

## Công thức câu

**Có dòng Bóng:**

> {Cách đọc Việt}, được ghép từ "{từ 1}" nghĩa là {nghĩa 1}, và "{từ 2}" là {nghĩa 2}, khi kết hợp lại nghe giống một câu "{nghĩa bóng}".

**Chỉ có dòng Đen:**

> {Cách đọc Việt}, được ghép từ "{từ 1}" nghĩa là {nghĩa 1}, và "{từ 2}" là {nghĩa 2}, kết hợp thành "{nghĩa đen}".

Cách chọn công thức:

- Có `- Bóng:` trong file → dùng công thức 1.
- Không có `- Bóng:` → dùng công thức 2. **Không tự bịa nghĩa bóng.**

## Quy tắc

- Mỗi Pokémon 1-2 câu, tối đa khoảng 35 từ.
- Không mở đầu kiểu "Bạn có biết...", không câu chốt, không nhắc hệ, không thêm lore.
- Cách đọc Việt viết ngay đầu câu, tách âm tiết bằng dấu gạch nối (Phu-shi-gi-đa-ne).
- Từ gốc tiếng Nhật đặt trong dấu ngoặc kép, nghĩa viết liền sau.
- Nghĩa đen và nghĩa bóng lấy nguyên từ file, chỉ chỉnh câu cho tự nhiên khi đọc.
- Dùng từ nối nói tự nhiên: "được ghép từ", "nghĩa là", "kết hợp thành", "nghe giống".

## Quy tắc cho AI đọc (TTS)

- Không emoji, ký hiệu (➜, ✦, +), markdown, ngoặc đơn trong lời dẫn.
- Đổi chữ Unicode đặc biệt (𝐅𝐮𝐬𝐡𝐢𝐠𝐢𝐝𝐚𝐧𝐞) về chữ thường bình thường.
- Không đưa katakana vào lời dẫn.

## Chuỗi tiến hóa

Nếu người dùng yêu cầu cả nhóm, viết lần lượt từng con theo thứ tự tiến hóa, mỗi con một đoạn theo công thức trên. Không thêm câu tổng kết trừ khi được yêu cầu.

## Định dạng đầu ra

```
[0001 - Fushigidane]
<lời dẫn>
```

## Ví dụ

Đầu vào: Fushigidane, Đen: Kỳ diệu (fushigi) + Hạt giống (tane), Bóng: "Kỳ diệu thật nhỉ?"

```
[0001 - Fushigidane]
Phu-shi-gi-đa-ne, được ghép từ "fushigi" nghĩa là kỳ diệu, và "tane" là hạt giống, khi kết hợp lại nghe giống một câu cảm thán "Kỳ diệu thật nhỉ?".
```

Đầu vào: Fushigibana, Đen: Hoa Kỳ Diệu = Kỳ diệu (fushigi) + Hoa (hana), không có Bóng

```
[0003 - Fushigibana]
Phu-shi-gi-ba-na, được ghép từ "fushigi" nghĩa là kỳ diệu, và "hana" là hoa, kết hợp thành "Hoa kỳ diệu".
```

## Checklist

- [ ] Đúng công thức (có Bóng / chỉ có Đen)
- [ ] Không bịa nghĩa ngoài file
- [ ] Không có câu mở đầu hay câu chốt
- [ ] Không còn ký hiệu, emoji, Unicode đặc biệt
- [ ] Mỗi Pokémon tối đa 1-2 câu
