import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [gorevler, setGorevler] = useState([]);
  const [yeniBaslik, setYeniBaslik] = useState('');

  // 📡 1. GÖREVLERİ GETİREN EFFECT
  useEffect(() => {
    const gorevleriGetir = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gorevler');
        const data = await response.json();
        setGorevler(data);
      } catch (err) {
        console.error("Veriler çekilirken hata oluştu şef:", err);
      }
    };
    gorevleriGetir();
  }, []);

  // ➕ 2. GÖREV EKLEME (POST)
  const gorevEkle = async (e) => {
    e.preventDefault();
    if (!yeniBaslik.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/gorevler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baslik: yeniBaslik })
      });
      
      if (response.ok) {
        const yeniKayit = await response.json();
        setGorevler((eskiGorevler) => [...eskiGorevler, yeniKayit]);
        setYeniBaslik('');
      }
    } catch (err) {
      console.error("Görev eklenirken hata oluştu şef:", err);
    }
  };

  // 🗑️ 3. GÖREV SİLME (DELETE)
  const gorevSil = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/gorevler/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setGorevler((eskiGorevler) => eskiGorevler.filter(g => g._id !== id));
      }
    } catch (err) {
      console.error("Görev silinirken hata oluştu şef:", err);
    }
  };

  // 🔄 4. GÖREV DURUMU GÜNCELLEME (PUT)
  const gorevTamamla = async (id, mevcutDurum) => {
    try {
      const response = await fetch(`http://localhost:5000/api/gorevler/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tamamlandi: !mevcutDurum })
      });

      if (response.ok) {
        setGorevler((eskiGorevler) =>
          eskiGorevler.map((g) => (g._id === id ? { ...g, tamamlandi: !mevcutDurum } : g))
        );
      }
    } catch (err) {
      console.error("Görev güncellenirken hata oluştu şef:", err);
    }
  };

  return (
    // 💡 Satır içi stiller yok! Sadece className kullanarak temizce tasarlıyoruz şef.
    <div className="panel-wrapper">
      <div className="panel-container">
        <h2 className="panel-title">⚡ ISON Duty Panel</h2>
        
        <form onSubmit={gorevEkle} className="input-form">
          <input 
            type="text" 
            placeholder="Yeni bir görev yazın şef..." 
            value={yeniBaslik}
            onChange={(e) => setYeniBaslik(e.target.value)}
            className="task-input"
          />
          <button type="submit" className="add-btn">Ekle</button>
        </form>

        <ul className="task-list">
          {gorevler.map((gorev) => (
            // Eğer görev tamamlandıysa li etiketine otomatik "completed" sınıfı ekliyoruz şef!
            <li key={gorev._id} className={`task-item ${gorev.tamamlandi ? 'completed' : ''}`}>
              
              <div className="task-left">
                <input 
                  type="checkbox" 
                  checked={gorev.tamamlandi || false} 
                  onChange={() => gorevTamamla(gorev._id, gorev.tamamlandi)}
                  className="task-checkbox"
                />
                <div className="task-text-group">
                  <span className="task-text">{gorev.baslik}</span>
                  <span className="task-status">
                    Durum: {gorev.tamamlandi ? 'Tamamlandı' : 'Bekliyor'}
                  </span>
                </div>
              </div>

              <button onClick={() => gorevSil(gorev._id)} className="delete-btn">
                Sil
              </button>

            </li>
          ))}
          
          {gorevler.length === 0 && (
            <p className="empty-message">Henüz bir görev yok şef, yeni bir tane ekleyin!</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;