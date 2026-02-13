<p align="center">
  <img src="https://raw.githubusercontent.com/gokselalperen669-ux/bch-agent-sdk/main/bch-agent-sdk/assets/logo.png" width="250" alt="BCH Agent Framework Logo">
</p>

# Nexus: The Global BCH Autonomous Agent Engine

**Faz 1: Otonom Çekirdek & CLI (Tamamlandı) | Faz 2: Ekosistem & Sosyal (Yükleniyor)**

Nexus, Bitcoin Cash (BCH) ağı üzerinde yaşayan, düşünen ve işlem yapan otonom AI ajanları inşa etmek için tasarlanmış profesyonel bir SDK ve CLI ekosistemidir.

---

## 🚀 Proje Yol Haritası

### 🛡️ Faz 1: Otonom Çekirdek & CLI (TEKNİK TAMAMLANDI)
*Odak: Üstün Otonomi, Güvenlik ve Geliştirici Deneyimi.*
- [x] **Otonom Zekâ Döngüsü:** Derin akıl yürütme (reasoning) ve on-chain aksiyon alma.
- [x] **Local Message Bus (Crosstalk):** Ajanlar arası yerel sinyal iletişimi.
- [x] **Persistent Memory:** Ajanların geçmiş kararları hatırlamasını sağlayan yerel hafıza.
- [x] **Expert Connector Hub:** Kullanıcı denetimli özel API (DeFi, Social, Vault) katmanı.
- [x] **CLI Power Tools:** `init`, `create`, `deploy`, `agent run`, `status`, `doctor`.
- [x] **Global Sync:** CLI ve Web Dashboard arasında `authToken` ile zırhlı senkronizasyon.

### 💎 Faz 2: Ekosistem & Tokenizasyon (GELECEK)
*Odak: Likidite, Ölçeklenme ve Sosyal Etkileşim.*
- [ ] **NFT Identity Marketplace:** Ajan haklarının devredilebildiği NFT pazarı.
- [ ] **Agent Bonding Curves:** Ajanların tokenizasyonu ve topluluk fonlaması.

---

## 🌐 Global Dağıtım (Production Setup)

Nexus'u lokalden çıkarıp global bir "Komuta Merkezi"ne dönüştürmek için şu adımları izleyin:

### 1. Nexus HQ (Backend & Dashboard)
Nexus Dashboard'un canlı örneğine [bch-agent-app.vercel.app](https://bch-agent-app.vercel.app) üzerinden ulaşabilirsiniz. 

**API Sunucusunu Sizin İçin Otomatikleştirdim (Render & Railway):**
Aşağıdaki butonları kullanarak API sunucusunu saniyeler içinde canlıya alabilirsiniz:

| Platform | Dağıtım Butonu |
| :--- | :--- |
| **Railway (Önerilen)** | [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/gokselalperen669-ux/bch-agent-sdk) |
| **Render** | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/gokselalperen669-ux/bch-agent-sdk) |

> **Not:** Railway kullanırken, projenizi bağladığınızda eklediğim `railway.json` dosyasını otomatik okuyacak ve Docker kurulumunu kendisi yapacaktır.
### 2. CLI Yapılandırması
CLI'yı canlı Dashboard'a bağlamak için terminalinizde şu değişkenleri tanımlayın:
```powershell
# Windows (PowerShell)
$env:AGENT_DASHBOARD_URL = "https://bch-agent-app.vercel.app"
$env:AGENT_API_URL = "https://senin-render-api-adresin.onrender.com"
```

### 3. Ajanların Canlıya Alınması (Docker Standalone)
Ajanınızı ihraç edip bağımsız bir konteyner olarak her yerde çalıştırabilirsiniz:
```bash
bch-agent export MyAgent --output ./dist
cd ./dist
docker build -t my-autonomous-agent .
docker run -d --env-file .env my-autonomous-agent
```

---

## 🛠️ Hızlı Başlangıç

### Kurulum
```bash
# SDK ve CLI Kurulumu
cd bch-agent-sdk
npm install
npm run build
npm link
```

### Proje Başlatma
```bash
bch-agent login
bch-agent init my-project
cd my-project
bch-agent wallet setup
```

### Ajan Döngüsünü Başlatma
```bash
bch-agent agent create MyTrader --type defi
bch-agent deploy MyTrader
bch-agent agent run MyTrader
```

---

## 🔒 Güvenlik & Gizlilik
- **Özel Anahtarlar:** Cüzdan anahtarları asla lokalden ayrılmaz.
- **Güvenli Senkronizasyon:** Ajan kararları `authToken` ile sadece sizin hesabınızla eşleşir.
- **Açık Kaynak:** Tüm kontratlar ve SDK mantığı şeffaf bir şekilde incelenebilir.

Built with 💚 for the Bitcoin Cash ecosystem.
