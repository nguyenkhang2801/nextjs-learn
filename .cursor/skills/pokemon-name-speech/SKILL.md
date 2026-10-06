---
name: pokemon-name-speech
description: Chuyển lời dẫn Pokémon đã viết sang phiên âm hoàn toàn tiếng Việt (bỏ romaji, tách âm tiết bằng dấu cách) để AI đọc chuẩn. Chỉ dùng khi người dùng gọi trực tiếp.
disable-model-invocation: true
---

# Chuyển lời dẫn sang phiên âm tiếng Việt

## Mục tiêu

Nhận đoạn lời dẫn đã có (kết quả của skill pokemon-ten-van-noi) và viết lại sao cho **không còn chữ romaji nào**. Mọi từ tiếng Nhật được viết theo âm tiếng Việt, mỗi âm tiết cách nhau một dấu cách, để AI đọc không bị sai.

## Quy tắc chung

1. Giữ nguyên toàn bộ phần tiếng Việt (nghĩa, từ nối, dấu câu). Chỉ đổi phần tiếng Nhật.
2. Bỏ dấu gạch nối: `Phu-shi-gi-đa-ne` thành `Phu si ghi đa nê`.
3. Từ gốc tiếng Nhật trong ngoặc kép (`"fushigi"`) viết thành phiên âm và **bỏ ngoặc kép**: `phu si ghi`.
4. Bỏ ngoặc kép ở các câu trích dẫn nghĩa bóng, giữ nguyên dấu `?` `!` `,` `.`.
5. Viết thường toàn bộ phiên âm, trừ chữ đầu câu.
6. Giữ nguyên dòng tiêu đề `[0001 - Fushigidane]`, chỉ đổi phần lời dẫn bên dưới.
7. Không thêm, bớt hay giải thích gì ngoài việc phiên âm.

## Bảng quy đổi (romaji sang âm Việt)

| Romaji               | Viết là              | Ví dụ                |
| -------------------- | -------------------- | -------------------- |
| a, i, u              | a, i, u              |                      |
| e, o                 | ê, ô                 | tane → ta nê         |
| ka, ki, ku, ke, ko   | ca, ki, cu, kê, cô   |                      |
| ga, gi, gu, ge, go   | ga, ghi, gu, ghê, gô | fushigi → phu si ghi |
| sa, shi, su, se, so  | sa, si, su, sê, sô   |                      |
| ja, ji, ju, jo       | gia, gi, giu, giô    |                      |
| ta, chi, tsu, te, to | ta, chi, xu, tê, tô  |                      |
| da, de, do           | đa, đê, đô           |                      |
| na, ni, nu, ne, no   | na, ni, nu, nê, nô   |                      |
| ha, hi, fu, he, ho   | ha, hi, phu, hê, hô  | fushi → phu si       |
| ba, bi, bu, be, bo   | ba, bi, bu, bê, bô   |                      |
| pa, pi, pu, pe, po   | pa, pi, pu, pê, pô   |                      |
| ma, mi, mu, me, mo   | ma, mi, mu, mê, mô   |                      |
| ya, yu, yo           | gia, giu, giô        |                      |
| ra, ri, ru, re, ro   | ra, ri, ru, rê, rô   |                      |
| wa, wo               | oa, ô                |                      |
| n (cuối âm tiết)     | n                    |                      |

Âm ghép: `Cya, Cyu, Cyo` viết thành `Cia, Ciu, Ciô` (kya → kia, ryu → riu, nyo → niô). Với `sha, shu, sho` viết `sa, su, sô`; `cha, chu, cho` viết `cha, chu, chô`.

Nguyên âm dài:

- `ou`, `oo`, `ō` → `ô` (sou → sô)
- `uu`, `ū` → `u`
- `ei` → `ê`
- `aa` → `a`

Phụ âm đôi (chữ nhỏ っ): tách thành hai âm tiết, âm đầu có đuôi phụ âm. Ví dụ `kappa` → `cap pa`.

## Cách xử lý tên Pokémon

- Tên ở đầu câu: viết hoa chữ đầu, phiên âm tách âm tiết (`Phu si ghi đa nê`).
- Nếu lời dẫn đã có sẵn cách đọc kiểu `Phu-shi-gi-đa-ne`, chỉ cần bỏ gạch nối và chuẩn lại theo bảng trên.
- Gặp từ không chắc cách đọc, ưu tiên cách đọc gần nhất theo bảng, không tự suy diễn thêm.

## Định dạng đầu ra

```
[0001 - Fushigidane]
<lời dẫn đã phiên âm>
```

## Ví dụ

Đầu vào:

```
[0001 - Fushigidane]
Phu-shi-gi-đa-ne, được ghép từ "fushigi" nghĩa là kỳ diệu, và "tane" là hạt giống, khi kết hợp lại nghe giống một câu cảm thán "Kỳ diệu thật nhỉ?".
```

Đầu ra:

```
[0001 - Fushigidane]
Phu si ghi đa nê, được ghép từ phu si ghi nghĩa là kỳ diệu, và ta nê là hạt giống, khi kết hợp lại nghe giống một câu cảm thán Kỳ diệu thật nhỉ?.
```

Đầu vào:

```
[0003 - Fushigibana]
Phu-shi-gi-ba-na, được ghép từ "fushigi" nghĩa là kỳ diệu, và "hana" là hoa, kết hợp thành "Hoa kỳ diệu".
```

Đầu ra:

```
[0003 - Fushigibana]
Phu si ghi ba na, được ghép từ phu si ghi nghĩa là kỳ diệu, và ha na là hoa, kết hợp thành Hoa kỳ diệu.
```

## Checklist

- [ ] Không còn chữ romaji hay katakana nào
- [ ] Không còn dấu gạch nối và ngoặc kép
- [ ] Mỗi âm tiết tiếng Nhật cách nhau một dấu cách
- [ ] Phần tiếng Việt giữ nguyên
- [ ] Tiêu đề `[số - tên]` giữ nguyên
