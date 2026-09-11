# Портовый священник — мини-канон

Только принятые изображения. Публикация: 11 сентября 2026.

## README

# Портовый священник — канон v1

8 сентября 2026. Вход: `index.html`. Пять исходных PNG без сжатия и обрезки.

**Весь пакет из пяти изображений принят Сашей: «свяшенник принят», 8 сентября 2026.**

**Главный эталон — `images/master.png`, принятый Сашей словами «священник норм — можно собрать канон».** Остальные четыре файла — производные опоры, созданные от этого мастера и проверенные при сборке; они не заменяют его при расхождении деталей.

| Изображение | Роль |
|---|---|
| `images/master.png` | Утверждённые лицо, ростовая фигура, костюм и пропорции |
| `images/portrait.png` | Черты лица, линия волос, усы и борода |
| `images/turnaround.png` | Вид спереди, профиль и спина; пояс исправлен отдельным проходом |
| `images/hands.png` | Возраст кистей, пустые руки, открытая ладонь и опора ладонью на стол |
| `images/emotions.png` | Сверху: участие, тревога; снизу: твёрдость, сдержанное облегчение |

## Неизменная внешность

Пожилой человек обычного человеческого роста. Узкие усталые щёки, высокий открытый лоб, редкие седые волосы, тяжёлые брови, серо-карие глаза, длинный нос с плотным кончиком. Седые усы переходят в неровную бороду до груди. Лицо сохраняет асимметрию и возраст при смене эмоций.

Ряса серо-угольная, до щиколоток; простой светлый льняной край у горла и манжет, потёртые и ремонтированные локти. Пояс из сложенной тёмной ткани с узлом слева спереди от самого персонажа и двумя концами. Сзади только тканевый пояс и швы, без металлической пряжки. Маленькая красновато-коричневая штопка внизу подола справа спереди от персонажа. Простые коричневые закрытые башмаки. Нет постоянного головного убора, оружия, посоха или украшений.

Детали костюма и лицо закреплены визуальным мастером. По книге подтверждены старость, борода до груди, потёртая ряса, усталость и помощь больным. Собственный религиозный знак ему не придуман. В главе 12 дневник принадлежит настоятелю по имени Берман, а священник называет эту келью своей (book/ch12.md:514, 528–536); это основание связывать его с Берманом. Точный возраст и дополнительные биографические факты не определены.

## Как использовать в сценах

1. Первым референсом всегда передавать `master.png`; вторым — подходящий крупный план, ракурс или эмоции. Не использовать цепочку новых сцен вместо мастера.
2. Взгляд, жест и положение тела меняются по эпизоду. Мастер определяет лицо и одежду, а не постоянную позу открытой ладони.
3. Руки по умолчанию пусты. Любой нужный сцене предмет описывать отдельно: какая рука, где захват, на чём держится вес. Стол с листа рук — демонстрация контакта, не личный предмет священника.
4. Узел пояса и подольная штопка привязаны к сторонам тела, а не изображения. Не зеркалить лист для противоположного ракурса.
5. Принимать только кадры с тем же лицом, линией волос, длиной бороды, вырезом рясы и обувью. Проверять пальцы, стопы и контакт с полом.
6. Вставлять полный `style-anchor.txt`: книжная живопись, один тёплый источник, открытые холодные тени. Настроение священника человеческое, без эффектов «святого сияния» по умолчанию.

Визуальная проверка пакета: на всех четырёх производных сохраняются возраст, лицо, борода, вырез рясы и палитра. Ростовой лист содержит один фронт, один профиль и одну спину. На листе рук четыре кисти в трёх отдельных этюдах; каждой соответствуют пять пальцев, нет парящих предметов. Точные промпты и происхождение файлов сохранены рядом. Абсолютное совпадение каждой складки генератор не обеспечивает; приоритет деталей всегда у мастера.


## generation-lock

Use the approved images/master.png as the FIRST reference. Preserve identity, hairline, chest-length grey beard, charcoal robe, plain linen edging, cloth belt knotted at the wearer LEFT front with two tails, small rust-red repair at RIGHT front lower hem, brown shoes. No religious jewellery, hood, staff or weapon by default. Describe each hand and object, exact ground contacts, and keep anatomical sides consistent. Do not copy composition, background or lighting from the reference images; build the scene described below.

STYLE:
MEDIUM: painted narrative book illustration, the kind printed as a full-page plate inside a novel — not game concept art, not a splash screen, not a poster. Oil-like digital painting: visible directional brushwork in the large masses, edges lost and found, crisp drawing reserved for the face, the hands and one key object; everything else is stated once and left alone.
LIGHT: exactly one warm practical source, in frame or just outside it — candle, torch, forge, oil lamp, a window, a fire — set against a cold blue-grey ambient. Strong chiaroscuro, but the shadows stay open and cold blue and never go dead black. One light direction per image, and the same logic across the whole set.
PALETTE: held tight and low — soot black, wet-stone grey, damp ochre, dirty linen white, oxidised copper green, tarnished silver, raw wood brown, and exactly one accent of dried-blood red per frame. Colour is muted and slightly desaturated; never candy, never oversaturated.
DETAIL: faces are specific, weathered, a little plain — real people with bad nights behind them, never cosmetic beauty. Grime, damp, patched cloth, rust and old repairs are rendered with affection, not disgust. Dark fantasy with dirt and with humour in it — plague, port, sewer, but never grim for its own sake; there is always one small warm human thing in the frame.
SURFACE: fine paper tooth and a thin warm varnish over the whole image, light vignette, subdued grain, as if the plate were printed and has aged.
FRAMING: portraits 3:4 vertical · character sheets 3:2 horizontal · scenes 3:2 horizontal.
FORBIDDEN: any text, letters, captions, numbers, watermarks, signatures, logos, UI, frames or borders; neon, lens flare, glowing rim-light halos, photographic bokeh; glossy plastic skin, airbrush beauty retouch, glamour makeup, pin-up posing; anime, chibi, cel shading, hard comic ink outline; 3D render, CGI, chrome sheen; contemporary clothing, zippers, firearms, modern objects; collage, tiled patterns or multiple unrelated panels (except where a sheet layout is explicitly requested).

NEGATIVE: text, letters, words, captions, labels, numbers, watermark, signature, logo, UI, frame, border, speech bubble; extra fingers, six fingers, fused fingers, extra limbs, extra arms, deformed hands, malformed face, mismatched eyes; duplicate character, twin, clone, mirrored copy of the same person; anime, manga, chibi, cel shading, comic ink outline, cartoon; 3D render, CGI, octane, plastic sheen, wax skin; photograph, DSLR bokeh, lens flare, HDR; neon, glowing rim halo, sparkles everywhere; airbrush beauty retouch, flawless skin, glossy lips, glamour makeup, pin-up posing; modern clothing, zippers, firearms, wristwatch; cluttered background, busy props, collage, tiled pattern, multiple panels; oversaturated colour, dead black shadows; pointed ears, goblin, green skin, horns, wizard, battle armour, staff, cross, bishop hat, skull ornaments, magical eyes, youthful face, luxurious gold embroidery.


## style-anchor

STYLE:
MEDIUM: painted narrative book illustration, the kind printed as a full-page plate inside a novel — not game concept art, not a splash screen, not a poster. Oil-like digital painting: visible directional brushwork in the large masses, edges lost and found, crisp drawing reserved for the face, the hands and one key object; everything else is stated once and left alone.
LIGHT: exactly one warm practical source, in frame or just outside it — candle, torch, forge, oil lamp, a window, a fire — set against a cold blue-grey ambient. Strong chiaroscuro, but the shadows stay open and cold blue and never go dead black. One light direction per image, and the same logic across the whole set.
PALETTE: held tight and low — soot black, wet-stone grey, damp ochre, dirty linen white, oxidised copper green, tarnished silver, raw wood brown, and exactly one accent of dried-blood red per frame. Colour is muted and slightly desaturated; never candy, never oversaturated.
DETAIL: faces are specific, weathered, a little plain — real people with bad nights behind them, never cosmetic beauty. Grime, damp, patched cloth, rust and old repairs are rendered with affection, not disgust. Dark fantasy with dirt and with humour in it — plague, port, sewer, but never grim for its own sake; there is always one small warm human thing in the frame.
SURFACE: fine paper tooth and a thin warm varnish over the whole image, light vignette, subdued grain, as if the plate were printed and has aged.
FRAMING: portraits 3:4 vertical · character sheets 3:2 horizontal · scenes 3:2 horizontal.
FORBIDDEN: any text, letters, captions, numbers, watermarks, signatures, logos, UI, frames or borders; neon, lens flare, glowing rim-light halos, photographic bokeh; glossy plastic skin, airbrush beauty retouch, glamour makeup, pin-up posing; anime, chibi, cel shading, hard comic ink outline; 3D render, CGI, chrome sheen; contemporary clothing, zippers, firearms, modern objects; collage, tiled patterns or multiple unrelated panels (except where a sheet layout is explicitly requested).