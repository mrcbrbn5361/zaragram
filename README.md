# 1743 Music: Discord Botu ve Web Arayüzü

Bu proje, Discord sunucunuz için gelişmiş bir müzik botu ve ona eşlik eden profesyonel bir web arayüzü sunar. Bot ve web arayüzü "1743 Music" adıyla özelleştirilmiş olup, web tarafı modern bir kırmızı, siyah, beyaz ve gri renk temasına sahiptir. Web arayüzü Vercel'e kolayca dağıtılabilir ve kendi Discord botunuzun OAuth sistemi ile entegre edilebilir.

## 🚀 Özellikler

### Discord Botu
*   **Çoklu Kaynak Desteği**: YouTube, Spotify, SoundCloud ve doğrudan linklerden müzik çalma.
*   **Gelişmiş Komutlar**: Müzik kontrolü, sıra yönetimi, filtreler ve daha fazlası.
*   **Sharding Desteği**: Büyük sunucular için ölçeklenebilirlik ve performans optimizasyonu.
*   **Özelleştirilebilir Durum ve Embedler**: Botun durum mesajını ve embed renklerini kişiselleştirme.

### Web Arayüzü
*   **Profesyonel Tasarım**: Modern ve göz alıcı kullanıcı arayüzü.
*   **Responsive**: Tüm cihazlarda sorunsuz bir deneyim sunar.
*   **Özelleştirilebilir Tema**: Kırmızı, siyah, beyaz ve gri tonlarında benzersiz renk şeması.
*   **Vercel Uyumlu**: Kolay dağıtım ve sürekli entegrasyon.
*   **Kendi Discord OAuth**: Botunuzun kendi OAuth sistemi ile güvenli giriş ve yetkilendirme.

## 🛠️ Kurulum

### 1. Ön Gereksinimler
Başlamadan önce aşağıdaki yazılımların sisteminizde kurulu olduğundan emin olun:
*   **Node.js** (v16 veya üzeri önerilir)
*   **Git**
*   **Discord Bot Token**: [Discord Developer Portal](https://discord.com/developers/applications) üzerinden botunuzu oluşturun ve token'ı alın.
*   **Discord Client ID**: Botunuzun Client ID'sini alın.
*   **Spotify API Kimlik Bilgileri** (İsteğe bağlı, Spotify desteği için): [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) üzerinden bir uygulama oluşturun ve Client ID ile Client Secret'ı alın.
*   **Vercel Hesabı** (Web arayüzü dağıtımı için): [Vercel](https://vercel.com/) adresinden kayıt olun.

### 2. Discord Bot Kurulumu

#### 2.1. Bot Deposunu Klonlama
Öncelikle, bot projesini yerel makinenize klonlayın:

```bash
git clone https://github.com/umutxyp/MusicBot.git 1743-Music-Bot
cd 1743-Music-Bot
```

#### 2.2. Bağımlılıkları Yükleme
Proje dizinine girdikten sonra gerekli bağımlılıkları yükleyin:

```bash
npm install
```

#### 2.3. Ortam Değişkenlerini Yapılandırma (.env)
Proje kök dizininde `.env` adında bir dosya oluşturun ve aşağıdaki değişkenleri kendi bilgilerinizle doldurun:

```dotenv
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN_HERE
CLIENT_ID=YOUR_DISCORD_CLIENT_ID_HERE
GUILD_ID=YOUR_GUILD_ID_HERE # İsteğe bağlı, global komutlar için boş bırakın

SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET

GENIUS_CLIENT_ID=
GENIUS_CLIENT_SECRET=

STATUS="🎵 1743 Music | /play"
EMBED_COLOR="#FF0000" # Kırmızı renk temasına uygun
SUPPORT_SERVER=YOUR_SUPPORT_SERVER_INVITE_LINK
WEBSITE=YOUR_VERCEL_WEBSITE_URL # Web arayüzünü dağıttıktan sonra güncelleyin
```

**Önemli Not**: `CLIENT_ID` değişkeni, botun davet linkini oluşturmak için kullanılacaktır. Kendi botunuzun Client ID'sini doğru girdiğinizden emin olun.

#### 2.4. Bot Yapılandırmasını Güncelleme (config.js)
`config.js` dosyasını açın ve aşağıdaki alanları "1743 Music" markasına uygun şekilde güncelleyin:

*   `bot.status`: Botun Discord'da görünecek durum mesajı. (`.env` dosyasından okunur, ancak burada varsayılan değeri değiştirebilirsiniz.)
*   `bot.embedColor`: Botun gönderdiği embed mesajlarının rengi. Kırmızı, siyah, beyaz, gri tonlarına uygun bir hex kodu (`#FF0000` kırmızı için örnek). (`.env` dosyasından okunur.)
*   `bot.supportServer`: Destek sunucunuzun davet linki.
*   `bot.website`: Web arayüzünüzün URL'si.
*   `bot.invite`: Bu alan otomatik olarak `CLIENT_ID`'nizden oluşturulur. Eğer özel bir davet linki kullanmak isterseniz, bu satırı düzenleyebilirsiniz.

#### 2.5. Botu Başlatma
Botu başlatmak için aşağıdaki komutları kullanın:

*   **Normal Mod (1000 sunucudan az için)**:
    ```bash
    node index.js
    ```
*   **Sharding Modu (1000+ sunucu için)**:
    ```bash
    node shard.js
    ```

### 3. Web Arayüzü Kurulumu ve Vercel Dağıtımı

#### 3.1. Web Arayüzü Deposunu Klonlama
Web arayüzü projesini yerel makinenize klonlayın:

```bash
git clone https://github.com/umutxyp/Discord-Bot-Website.git 1743-Music-Website
cd 1743-Music-Website
```

#### 3.2. Bağımlılıkları Yükleme
Proje dizinine girdikten sonra gerekli bağımlılıkları yükleyin:

```bash
npm install
```

#### 3.3. Web Arayüzünü Özelleştirme

##### a. Genel Marka Değişiklikleri
*   `pages/index.jsx`: Ana sayfadaki "MusicMaker" metinlerini "1743 Music" olarak değiştirin. Davet linklerini kendi botunuzun davet linkiyle güncelleyin.
*   `components/Static/Header.jsx`: Header bileşenindeki "MusicMaker" metinlerini "1743 Music" olarak değiştirin. Logo (`/img/logo2.png`) ve davet linklerini güncelleyin.
*   `pages/_app.jsx`: `<Head>` içindeki `<title>` etiketini "1743 Music" olarak güncelleyin. `NavItems` dizisindeki "Add Bot" ve "Support" linklerini kendi botunuzun ve destek sunucunuzun linkleriyle değiştirin.
*   `pages/_document.jsx`: SEO ve sosyal medya paylaşımları için `<Head>` içindeki `description`, `og:url`, `og:title`, `og:image:alt`, `og:site_name`, `twitter:*` ve `theme-color` etiketlerini "1743 Music" ve web sitenizin URL'sine uygun şekilde güncelleyin.
*   `pages/privacy.jsx` ve `pages/tos.jsx`: Bu dosyalardaki "MusicMaker" referanslarını ve Top.gg vote linklerini "1743 Music" ve kendi botunuzun ilgili linkleriyle güncelleyin.

##### b. Renk Teması Ayarları (Kırmızı, Siyah, Beyaz, Gri)
Web arayüzünün renk temasını kırmızı, siyah, beyaz ve gri tonlarına ayarlamak için aşağıdaki dosyaları düzenleyin:

*   `tailwind.config.js`: Bu dosyada `amber` renk paleti tanımlıdır. Mevcut `amber` yerine kendi özel renk paletinizi tanımlayabilir veya mevcut renkleri değiştirerek istediğiniz tonları elde edebilirsiniz. Örneğin, `amber` yerine `red` renk paletini kullanabilir ve siyah, beyaz, gri tonlarını Tailwind CSS sınıfları aracılığıyla uygulayabilirsiniz.

    Mevcut `amber` renk tanımını kaldırıp kendi özel renklerinizi ekleyebilirsiniz. Örneğin:
    ```javascript
    // tailwind.config.js
    module.exports = {
        // ... diğer ayarlar
        theme: {
            extend: {
                colors: {
                    primary: {
                        DEFAULT: '#FF0000', // Kırmızı
                        dark: '#CC0000',
                        light: '#FF3333',
                    },
                    dark: {
                        DEFAULT: '#1A1A1A', // Koyu Gri/Siyah
                        light: '#333333',
                    },
                    light: {
                        DEFAULT: '#FFFFFF', // Beyaz
                        dark: '#F0F0F0',
                    },
                    gray: {
                        DEFAULT: '#808080',
                        light: '#A0A0A0',
                        dark: '#606060',
                    },
                },
            },
        },
        // ... diğer ayarlar
    };
    ```
    Bu değişiklikleri yaptıktan sonra, `index.jsx`, `Header.jsx` ve diğer bileşenlerdeki `amber-` ile başlayan Tailwind sınıflarını yeni tanımladığınız `primary-`, `dark-`, `light-`, `gray-` sınıflarıyla değiştirmeniz gerekecektir.

*   `public/css/customColors.css`: Bu dosya `data-theme` özniteliğine göre dinamik renk temaları tanımlar. Mevcut `violet`, `blue`, `rose`, `emerald`, `amber` temalarını inceleyerek kendi `red-black-white-gray` temanızı oluşturabilir ve `_app.jsx` dosyasındaki `ThemeProvider defaultTheme=\'violet\'` değerini kendi temanızın `id`'si ile değiştirebilirsiniz. Örneğin, `data-theme="red-black-white-gray"` için yeni bir blok oluşturup istediğiniz renk değişkenlerini tanımlayabilirsiniz.

    ```css
    /* public/css/customColors.css */
    [data-theme="red-black-white-gray"] {
        --gradient: rgba(255, 0, 0, 0.2); /* Kırmızı gradient */
        --900: rgba(26, 26, 26); /* Koyu Siyah */
        --800: rgba(51, 51, 51);
        --700: rgba(77, 77, 77);
        --600: rgba(102, 102, 102);
        --500: rgba(128, 128, 128); /* Orta Gri */
        --400: rgba(153, 153, 153);
        --300: rgba(179, 179, 179);
        --200: rgba(204, 204, 204);
        --100: rgba(230, 230, 230);
        --50: rgba(255, 255, 255); /* Beyaz */
        /* Diğer tonlar ve opaklıklar için benzer tanımlamalar */
    }
    ```
    Bu durumda `_app.jsx` dosyasındaki `ThemeProvider defaultTheme=\'violet\'` satırını `ThemeProvider defaultTheme=\'red-black-white-gray\'` olarak güncellemeniz gerekecektir.

##### c. Discord OAuth Entegrasyonu
Web arayüzü, botunuzun davet linkini ve muhtemelen gelecekteki kullanıcı girişlerini kendi botunuzun OAuth sistemi üzerinden yapacaktır. Bu nedenle, `pages/index.jsx` ve `components/Static/Header.jsx` dosyalarındaki davet linklerini kendi botunuzun `CLIENT_ID`'sini içeren doğru davet URL'si ile güncellediğinizden emin olun.

Örnek davet URL formatı:
`https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands`

`YOUR_CLIENT_ID` yerine kendi botunuzun Client ID'sini yazmalısınız.

#### 3.4. Vercel'e Dağıtım

1.  **GitHub Deposu Oluşturma**: Web arayüzü projenizi (1743-Music-Website) kendi GitHub hesabınızda yeni bir özel depoya (`private repository`) yükleyin.
2.  **Vercel'e Bağlama**: Vercel hesabınıza giriş yapın. Yeni bir proje oluşturun ve GitHub deponuzu Vercel'e bağlayın.
3.  **Ortam Değişkenleri**: Eğer web arayüzünüz için herhangi bir ortam değişkeni (örneğin, API anahtarları) kullanıyorsanız, bunları Vercel proje ayarlarından ekleyin.
4.  **Dağıtım**: Vercel, deponuzu bağladıktan sonra otomatik olarak bir dağıtım başlatacaktır. Dağıtım tamamlandığında, web sitenizin canlı URL'sine sahip olacaksınız.
5.  **Özel Alan Adı (Custom Domain)**: İsteğe bağlı olarak, Vercel üzerinden kendi özel alan adınızı web sitenize bağlayabilirsiniz.

## 🤝 Katkıda Bulunma

Bu projeye katkıda bulunmak isterseniz, lütfen bir pull request açmaktan çekinmeyin. Her türlü katkı memnuniyetle karşılanır.

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

---

**Manus AI Tarafından Oluşturuldu**
