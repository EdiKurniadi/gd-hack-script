(function() {
    // 1. Meminta input URL
    let inputUrl = prompt("Paste URL 'viewer/img' di sini:", "");
    if (!inputUrl) return;
    
    let rawUrl = inputUrl.trim();

    // 2. Meminta jumlah halaman
    let totalPages = parseInt(prompt("Berapa jumlah halaman yang ingin ditampilkan?", "10"));
    if (isNaN(totalPages) || totalPages <= 0) return;

    try {
        let baseUrl = rawUrl.replace(/page=\d+/, 'page=__PAGE__');
        if (!baseUrl.includes('page=__PAGE__')) {
            baseUrl += '&page=__PAGE__';
        }

        // 3. Membuat CSS Khusus untuk Mode Print (Save as PDF)
        let printStyle = document.createElement('style');
        printStyle.id = 'gdrive-print-style';
        
        let cssRules = `
            @media print {
                /* Sembunyikan elemen asli website di latar belakang */
                body > *:not(#gdrive-extractor-overlay) { display: none !important; }
                
                /* Reset gaya overlay agar cocok untuk kertas PDF */
                #gdrive-extractor-overlay { 
                    position: static !important; 
                    overflow: visible !important; 
                    padding: 0 !important; 
                    background: white !important; 
                }
                
                /* Sembunyikan tombol-tombol saat dicetak */
                .no-print { display: none !important; }
                
                /* Atur setiap gambar agar pas 1 halaman penuh (A4) */
                .img-container { 
                    page-break-after: always; 
                    page-break-inside: avoid; 
                    margin: 0 !important; 
                    padding: 0 !important;
                }
                .img-container img { 
                    max-width: 100% !important; 
                    max-height: 100vh !important; 
                    border: none !important; 
                    box-shadow: none !important; 
                }
            }
        `;
        
        // PERBAIKAN: Menggunakan createTextNode untuk bypass error TrustedHTML
        printStyle.appendChild(document.createTextNode(cssRules));
        document.head.appendChild(printStyle);

        // 4. Membuat Layar Overlay
        let overlay = document.createElement('div');
        overlay.id = 'gdrive-extractor-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = '#f0f2f5';
        overlay.style.zIndex = '999999';
        overlay.style.overflowY = 'auto';
        overlay.style.padding = '30px 20px';
        overlay.style.boxSizing = 'border-box';
        overlay.style.fontFamily = 'Segoe UI, Tahoma, sans-serif';
        overlay.style.textAlign = 'center';

        // 5. Membuat Tombol Simpan PDF (Kiri Atas)
        let pdfBtn = document.createElement('button');
        pdfBtn.innerText = "📄 Simpan sebagai PDF";
        pdfBtn.className = "no-print";
        pdfBtn.style.position = 'fixed';
        pdfBtn.style.top = '20px';
        pdfBtn.style.left = '20px';
        pdfBtn.style.padding = '10px 20px';
        pdfBtn.style.backgroundColor = '#34a853';
        pdfBtn.style.color = 'white';
        pdfBtn.style.border = 'none';
        pdfBtn.style.borderRadius = '20px';
        pdfBtn.style.fontWeight = 'bold';
        pdfBtn.style.cursor = 'pointer';
        pdfBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        pdfBtn.onclick = function() { window.print(); };
        overlay.appendChild(pdfBtn);

        // 6. Membuat Tombol Tutup (Kanan Atas)
        let closeBtn = document.createElement('button');
        closeBtn.innerText = "✕ Tutup Tampilan";
        closeBtn.className = "no-print";
        closeBtn.style.position = 'fixed';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.padding = '10px 20px';
        closeBtn.style.backgroundColor = '#ea4335';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '20px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        closeBtn.onclick = function() { 
            overlay.remove(); 
            if (document.getElementById('gdrive-print-style')) {
                document.getElementById('gdrive-print-style').remove();
            }
        };
        overlay.appendChild(closeBtn);

        // Membuat Judul Layar
        let title = document.createElement('h2');
        // PERBAIKAN: Menggunakan textContent alih-alih innerText untuk keamanan konsistensi
        title.textContent = "Hasil Ekstraksi Halaman Dokumen";
        title.className = "no-print";
        title.style.color = '#333';
        title.style.marginBottom = '40px';
        overlay.appendChild(title);

        // 7. Proses melakukan perulangan Gambar
        for (let i = 0; i < totalPages; i++) {
            let pageUrl = baseUrl.replace('__PAGE__', i);
            
            let container = document.createElement('div');
            container.className = "img-container";
            container.style.marginBottom = '35px';
            container.style.display = 'inline-block';
            container.style.width = '100%';
            
            let label = document.createElement('p');
            label.textContent = `Halaman ${i + 1}`; // PERBAIKAN: Gunakan textContent
            label.className = "no-print";
            label.style.color = '#666';
            label.style.fontWeight = 'bold';
            label.style.margin = '0 0 10px 0';
            
            let img = document.createElement('img');
            img.src = pageUrl;
            img.style.maxWidth = '100%';
            img.style.width = '850px';
            img.style.background = 'white';
            img.style.border = '1px solid #ccc';
            img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            img.style.display = 'block';
            img.style.margin = '0 auto';
            
            container.appendChild(label);
            container.appendChild(img);
            overlay.appendChild(container);
        }

        // Masukkan seluruh layar overlay ke dalam browser
        document.body.appendChild(overlay);

    } catch (error) {
        alert("Terjadi kesalahan teknis. Silakan cek detail error di dalam Console Log.");
        console.error("Detail Error:", error);
    }
})();