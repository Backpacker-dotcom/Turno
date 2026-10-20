# Turno

Personel vardiya, fazla mesai ve izin takibi (Android). Ortunç Otel · Elia Otel · Spa.

- **İndir:** [Turno.apk (son sürüm)](https://github.com/Backpacker-dotcom/Turno/releases/latest/download/Turno.apk)
- Pano: bugün çalışanlar, deneme süresi, denkleştirme ve izin hakkı uyarıları
- Çizelge: haftalık Excel (.xlsx) yükleme, isimle eşleştirme, gelecek haftaları planlama, talepler
- Personel: yıllık izin, alacak 1:1 / 1:1,5, borç (B-OFF), devir bakiyeleri, işten çıkış
- Rapor: haftalık / aylık PDF kaydet, WhatsApp'ta paylaş
- Ekip bulutu: aynı ekip kodunu kullanan tüm telefonlar aynı veriyi görür

## Nasıl güncellenir

- `index.html` uygulamanın kendisidir. Bu dosya değişince telefondaki uygulama bir sonraki açılışta yeni sürümü indirir (değişiklik ikinci açılışta görünür); yeniden kurmaya gerek yoktur.
- `.github/workflows/android.yml` değişince (veya Actions sekmesinden elle çalıştırınca) GitHub Actions yeni bir APK derleyip **Releases** bölümüne koyar. İlk derlemede imza anahtarı (`release.keystore`) otomatik oluşturulup depoya eklenir; sonraki sürümler aynı anahtarla imzalanır, böylece kurulu uygulamanın üzerine güncellenebilir.

## Ekip bulutu kurulumu (bir kez)

1. https://console.firebase.google.com → **Proje ekle** (ör. `turno-otel`). Analytics gerekmez.
2. Sol menü **Build → Realtime Database → Veritabanı oluştur** → konum *europe-west1* → **kilitli modda başlat**.
3. **Kurallar** sekmesine şunu yapıştırıp **Yayınla**:
   ```json
   { "rules": { "teams": { "$team": { ".read": true, ".write": true } } } }
   ```
   Ekip kodu tahmin edilemez olmalı (ör. `ortunc-elia-7k2q9x`); kodu bilen veriyi okuyabilir.
   Daha sıkı güvenlik için: Proje ayarları → Hizmet hesapları → Veritabanı gizli anahtarları → anahtarı Turno'da **Erişim anahtarı** alanına girin ve kuralları `".read": false, ".write": false` yapın.
4. Veritabanı sayfasının üstündeki adresi kopyalayın (`https://…firebasedatabase.app`).
5. Turno → sağ üst **Ayarlar** → adres + ekip kodu → **Bağlan**. İlk bağlanan telefon mevcut veriyi buluta yükler.
6. **Bağlantı kodunu paylaş** ile kodu diğer telefonlara gönderin; onlar **Bağlantı kodu** alanına yapıştırıp **Bağlan**'a dokunur.

İnternet yokken yapılan değişiklikler telefonda bekler, bağlantı gelince gönderilir.

## Excel çizelge biçimi

- “Günler” satırında Pazartesi–Pazar tarihleri (Excel tarih hücresi) olmalı.
- “Ortunç Otel”, “Elia Otel” satırları blok başlığıdır. İsim satırında 7 gün: `08:00-16:00`, `OFF`, `Y-İZİN`, `B-OFF`, `A-OFF`.
- İsmin altındaki görev satırı ve “Elia / Ortunç / Spa” lokasyon satırı okunur.
- Eski `.xls` biçimi desteklenmez; Excel'de “Farklı kaydet → .xlsx” kullanın.

> Hesaplamalar girilen verilere dayanır; resmi bordro ve SGK kayıtları esastır.
