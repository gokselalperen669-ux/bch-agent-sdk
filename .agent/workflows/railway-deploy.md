---
description: Railway Otomatik Deploy Kurulumu
---

Bu workflow, projenin Railway üzerinde otomatik olarak deploy edilmesini sağlar.

### Hazırlık
1. Kodun bir GitHub reposunda olduğundan emin olun.
2. [Railway.app](https://railway.app) üzerinde bir hesap oluşturun.

### Kurulum Adımları
1. **GitHub Reposunu Bağlayın**:
   - Railway Dashboard'da `New Project` -> `Deploy from GitHub repo` seçeneğini seçin.
   - Bu repoyu seçin.

2. **Değişkenleri Ayarlayın (Variables)**:
   - `Settings` veya `Variables` sekmesine gidin.
   - `PORT` değişkeninin otomatik set edildiğini kontrol edin (genelde `4000` veya Railway'in verdiği port).
   - Eğer özel bir API URL kullanacaksanız `VITE_API_URL` ekleyebilirsiniz (boş bırakırsanız aynı domaini kullanır).
   - `DATABASE_PATH` olarak `/data/db.json` kullanabilirsiniz (Volumeları kullanmak için).

3. **Volume Ekleme (Opsiyonel - Kalıcı Veri İçin)**:
   - `db.json` dosyasının silinmemesi için Railway'de bir `Volume` ekleyin.
   - Mount path: `/data`
   - Bu sayede sunucu her restart olduğunda verileriniz silinmez.

// turbo
### Manuel Test (Opsiyonel)
Projenin build sürecini yerelde test etmek isterseniz:
```powershell
npm run build
```

### Önemli Notlar
- `root` dizindeki `package.json` build sürecini yönetir.
- `bch-agent-app/api-server.js` hem API'yi hem de `dist` klasöründeki frontend'i sunar.
- Otomatik deploy için GitHub'a push yapmanız yeterlidir.
