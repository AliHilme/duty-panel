const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const MONGO_URL = "mongodb+srv://alihilme_db_:A2006l9i23%23@backend-dev.kz7lbye.mongodb.net/test?retryWrites=true&w=majority&appName=backend-dev";

const gorevShema = new mongoose.Schema({
    baslik:{type:String, required:true},
    tamamlandi:{type: Boolean, default: false},
    tarih:{type:Date, default:Date.now}
})
const DutyProjectDB = mongoose.model("DutyProjectDB", gorevShema);


mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Mutfak Hazır Şef! MongoDB Veritabanına Başarıyla Bağlanıldı.");
    })
    .catch((err) => {
        console.error(" Veritabanı bağlantı hatası şef:", err.message);
    })

//YENİ GÖREV EKLEME ROTASI (POST)
app.post('/api/gorevler', async (req,res) => {
    try {
        // 1. Frontend'den gelen kargo paketinin içindeki başlığı yakalıyoruz
        const {baslik} = req.body;
        // 2. Mongoose modelimizi kullanarak veritabanına kaydedilecek yeni bir görev objesi üretiyoruz
        const yeniGorev = new DutyProjectDB({
            baslik: baslik
        });

        // 3. 💥 İŞTE O SİHİRLİ AN: Veriyi MongoDB'ye kaydet emri veriyoruz (Tablo burada doğacak!)
        const kaydedilenGorev = await yeniGorev.save();

        // 4. İşlem başarılıysa frontend'e kaydedilen veriyi nizamîce geri fırlatıyoruz
        res.status(201).json(kaydedilenGorev);
    } catch (err) {
        res.status(500).json({hata: "Veritabanına görev eklenirken bir pürüz çıktı şef!"});
    }
});

app.get('/api/gorevler', async (req,res) => {
    try{
        const tumGorevler = await DutyProjectDB.find({});

        res.json(tumGorevler);

    } catch (err) {
        res.status(500).json({ hata: "Veritabanından görevler çekilirken bir pürüz çıktı şef!"})
    }
})


app.delete('/api/gorevler/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const silinenGorev = await DutyProjectDB.findByIdAndDelete(id);

        if(!silinenGorev){
            return res.status(404).json({ hata: "Silinecek görev veritabanında  bulunamadı şef!"});
        }

        res.json({ mesaj:"🗑️ Operasyon Başarılı: Görev buluttan kalıcı olarak silindi!"});
    } 
    catch (err) {
        res.status(500).json({ hata: "Veritabanından silme işlemi yapılırken bir pürüz çıktı şef!"})
    }
});


app.put('/api/gorevler/:id', async (req, res) => {
    try {
        const {id} =req.params;
        const {tamamlandi} = req.body;

        const guncellenenGorev = await DutyProjectDB.findByIdAndUpdate(
            id,
            {tamamlandi: tamamlandi},
            {new: true}
        );

        if(!guncellenenGorev){
            return res.status(404).json({hata: "Güncellenecek görev bulunamadı şef!"});
        }
        res.json(guncellenenGorev);
    }
    catch (err) {
        res.status(500).json({hata: "Veritabanında güncelleme yapılırken bir pürüz çıktı şef!"})
    }
});

app.listen(PORT,() =>{
    console.log(`🚀 Sunucu http://localhost:${PORT} portunda aktif!`);
})