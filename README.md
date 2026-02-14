<p align="center">
  <img src="https://raw.githubusercontent.com/gokselalperen669-ux/bch-agent-sdk/main/bch-agent-sdk/assets/logo.png" width="250" alt="BCH Agent Framework Logo">
</p>

# Nexus: The Global BCH Autonomous Agent Engine

**Faz 1: Otonom Çekirdek & CLI (Tamamlandı) | Faz 2: Ekosistem & Sosyal (Yükleniyor)**

Nexus, Bitcoin Cash (BCH) ağı üzerinde yaşayan, düşünen ve işlem yapan otonom AI ajanları inşa etmek için tasarlanmış profesyonel bir SDK ve CLI ekosistemidir.

---

## 💻 Yerel Geliştirme (Localhost First)

Nexus, varsayılan olarak **tamamen yerel** çalışacak şekilde tasarlanmıştır. Diğer geliştiriciler projeyi kendi bilgisayarlarında saniyeler içinde ayağa kaldırabilirler.

### 1. Servisleri Başlatma
Kök dizindeki `START_NEXUS.bat` dosyasını çalıştırın veya şu komutları kullanın:
```bash
# Terminal 1: API Sunucusu
cd bch-agent-app && npm run api

# Terminal 2: Web Dashboard
cd bch-agent-app && npm run dev
```

### 2. CLI Kurulumu
Ajanlarınızı yönetmek için CLI aracını global olarak bağlayın:
```bash
cd bch-agent-sdk
npm install && npm run build
npm link
```

### 3. Kullanıma Hazır!
Artık tarayıcınızdan `http://localhost:5173` adresine giderek hesabınızı oluşturabilir ve `bch-agent login` ile terminalden bağlanabilirsiniz.

---

## 🚀 Proje Yol Haritası

### 🛡️ Faz 1: Otonom Çekirdek & CLI (TAMAMLANDI)
*Güçlü bir yerel temel üzerine inşa edilmiştir.*
- [x] **Otonom Zekâ Döngüsü:** Derin akıl yürütme ve on-chain aksiyon.
- [x] **Local Message Bus:** Ajanlar arası yerel iletişim (Crosstalk).
- [x] **Persistent Memory:** Kararların yerel diskte saklanması.
- [x] **Expert Connector Hub:** Kullanıcı denetimli özel API katmanı.
- [x] **CLI Power Tools:** `init`, `create`, `deploy`, `agent run`.

### 💎 Faz 2: Ekosistem & Tokenizasyon (GELECEK)
- [ ] **NFT Identity Marketplace:** Ajan haklarının devri.
- [ ] **Agent Bonding Curves:** Ajanların topluluk fonlaması.

---

## 🌐 Global / Cloud Dağıtım (Opsiyonel / İleri Seviye)

Projenizi buluta taşıyarak 7/24 otonomi sağlamak isterseniz bu seçenekleri kullanabilirsiniz:

### 1. Nexus HQ (Backend & Dashboard)
Nexus Dashboard'un canlı örneğine [bch-agent-app.vercel.app](https://bch-agent-app.vercel.app) üzerinden ulaşabilirsiniz. 

**API Sunucusunu Sizin İçin Otomatikleştirdim (Render & Railway):**
Aşağıdaki butonları kullanarak API sunucusunu saniyeler içinde canlıya alabilirsiniz:

| Platform | Dağıtım Butonu |
| :--- | :--- |
| **Railway (Önerilen)** | [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?template=https://github.com/gokselalperen669-ux/bch-agent-sdk) |
| **Render** | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/gokselalperen669-ux/bch-agent-sdk) |

### 2. CLI Yapılandırması
CLI'yı canlı Dashboard'a bağlamak için:
```powershell
$env:AGENT_DASHBOARD_URL = "https://bch-agent-app.vercel.app"
$env:AGENT_API_URL = "https://senin-api-adresin.com"
```

---

##  Güvenlik & Gizlilik
- **Özel Anahtarlar:** Cüzdan anahtarları asla lokalden ayrılmaz.
- **Güvenli Senkronizasyon:** Ajan kararları `authToken` ile sadece sizin hesabınızla eşleşir.

Built with 💚 for the Bitcoin Cash ecosystem.
