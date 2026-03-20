console.log(`Termux hızlı başlangıç:
1) Mümkünse projeyi ~/zaragram altında çalıştır.
2) pkg update && pkg upgrade
3) pkg install nodejs git cloudflared
4) npm install
5) cp .env.example .env.local
6) npm run dev
7) Public erişim için npm run dev:public

Eğer proje /storage/emulated/0 altında ise npm install yerine gerekirse 'npm install --no-bin-links' kullan.
Bu repoda .npmrc içindeki bin-links=false ayarı Termux symlink sorunlarını azaltmak için eklendi.`);
