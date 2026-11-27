import { read } from "node:fs";
import * as readlinesync from "readline-sync"

interface Produk {
    id: string;             //ID Produk
    nama: string;           //Nama Produk
    jenis: string;          //Jenis Produk
    harga: number;          //Harga Dasar
    stok: number;           //Jumlah Stok barang
    statusDiskon: boolean;  //Apakah mendapatkan diskon?
    tersedia: boolean;      //Apakah barangnya tersedia di toko?
}

let daftarProduk: Produk[] = [];

//Cari Produk ID
function cariProdukId(id: string): number {
    for (let i: number = 0; i < daftarProduk.length; i++) {
        if (daftarProduk[i]?.id.toLowerCase() === id.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

//Agar sesuai dengan ID
function validasiAngka(nilai: number): boolean {
    return nilai >=0;
}

function hitungHargaProduk(produk: Produk, tipeIsi: string, tipeGas: string): number {
    let hargaSatuan: number = produk.harga;

    //Jenis Produk
    switch (produk.jenis.toLowerCase()) {
        case "makanan":
        case "minuman":
            hargaSatuan = produk.harga;
            break;
        
        case "galon":
            if (tipeIsi === "beli_baru"){
                hargaSatuan += 23000;
            }
            break;
        
        case "gas":
        if (tipeGas === "3kg") {
            if (tipeIsi === "beli_baru"){
                hargaSatuan += 195000; //Harga Gas beli baru 3kg
            } else {
                hargaSatuan += 24000;
            }
    } else if (tipeGas === "5kg"){
        if (tipeIsi === "beli_baru") {
        hargaSatuan +=430000; // Harga beli baru 5kg
    } else {
        hargaSatuan += 115000; //Harga isi Ulang 5kg
    }
    } else {
    console.log("Tidak tersedia");
    
    }
    break;
}

return hargaSatuan;
}

//Create
function tambahProduk(): void {
    console.log("\n--- TAMBAH PRODUK BARU (CREATE) ---");
    const id: string = readlinesync.question("Masukkan ID Produk");

    //Cek validitas ID
    if (id === " "){
        console.log("ID Tidak Tersedia");
        return;
    }
    if (cariProdukId(id) !== -1) {
        console.log("ID Sudah Terdaftar");
        return;
    }

    const nama: string = readlinesync.question("Masukkan Nama Produk: ").trim();
    const jenis: string = readlinesync.question("Masukkan Jenis (makanan/minuman/galon/gas): ").trim();
    const harga: number = parseFloat(readlinesync.question("Masukkan Harga Barang (Rp): "));
    const stok: number = parseInt(readlinesync.question("Masukkan Jumlah Stok Barang: "));
    const inputDiskon: string = readlinesync.question("Apakah Pelanggan Setia? (ya/tidak): ").toLowerCase();
    const inputTersedia: string = readlinesync.question("Apakah Produk Tersedia? (ya/tidak): ").toLowerCase();


//Validitas Data Pencarian
if (nama == "" || jenis === "" || !validasiAngka(harga) || !validasiAngka(stok)) {
    console.log("Data Tidak Valid, Pastikan Nama dan Stok Barang Benar");
    return;
}

    const produkBaru: Produk = {
        id: id,
        nama: nama,
        jenis: jenis,
        harga: harga,
        stok: stok,
        statusDiskon: inputDiskon === "ya",
        tersedia: inputTersedia === "ya"
    };
    daftarProduk.push(produkBaru);
    console.log("Data Berhasil Ditambahkan!: ");
}

//Fitur Read (detail Produk)
function lihatProdukById(): void {
    console.log("\n---LIHAT DETAIL PRODUK ID ---");
    const id: string = readlinesync.question("Masukkan ID Produk yang dicari: ").trim();
    const indeks: number = cariProdukId(id);
    
    if (indeks !== -1) {
        const produk = daftarProduk[indeks]!;
        console.log("ID Produk      : " + produk.id);
        console.log("Nama Produk    :  " + produk.nama);
        console.log("Jenis Produk   : " + produk.jenis);
        console.log("Harga Dasar    : Rp." + produk.harga);
        console.log("Stok           : " + produk.stok);
        console.log("Status Diskon  : " + (produk.statusDiskon ? "Aktif" : "Tidak Aktif"));
        console.log("Ketersediaa    : " + (produk.tersedia ? "Tersedia" : "Kosong"));
    } else {
        console.log("Data Tidak Ditemukan.");
    }
}

//Fitur Update 
function ubahProduk(): void {
    console.log("\n--- UBAH DATA PRODUK (UPDATE) ---");
    const id: string = readlinesync.question("Masukkan ID Produk yang Akan Diubah: ").trim();
    const indeks: number = cariProdukId(id);

    if (indeks === -1) {
        console.log("Data Tidak Ditemukan");
        return;
    }

    const produk = daftarProduk[indeks]!;
    const namaBaru: string = readlinesync.question("Nama Baru (" + produk.nama +"): ").trim();
    const jenisBaru: string = readlinesync.question("Jenis Baru (" + produk.jenis +"): ").trim();
    const hargaBaru: number = parseFloat(readlinesync.question("Harga Baru (" + produk.harga +"): "));
    const stokBaru: number = parseInt(readlinesync.question("Stok Baru (" + produk.stok +"): "));
    const diskonBaru: string = readlinesync.question("Diskon 10% Aktif? (ya/tidak): ").toLowerCase();
    const tersediaBaru: string = readlinesync.question("Produk Tersedia? (ya/tidak): ").toLowerCase();

    if (namaBaru  === "" || jenisBaru === "" || !validasiAngka(hargaBaru) || !validasiAngka(stokBaru)) {
        console.log("Input Data Tidak Valid");
        return;
    }

    //Update Data Pada Array
    produk.nama = namaBaru;
    produk.jenis = jenisBaru;
    produk.harga = hargaBaru;
    produk.stok = stokBaru;
    produk.statusDiskon = diskonBaru === "ya";
    produk.tersedia = tersediaBaru === "ya";

    console.log("Data berhasil dimasukkan!");
}

//Fitur Delete
function hapusProduk(): void {
    console.log("\n--- HAPUS DATA PRODUK ---");
    const id: string = readlinesync.question("Masukkan ID Produk yang Akan Dihapus: ").trim();
    const indeks: number = cariProdukId(id);

    if (indeks == -1) {
        console.log("Data Tidak Ditemukan");
        return;
    }

    const produk = daftarProduk[indeks]!;
    console.log("Produk ditemukan: " + produk.nama + " (Stok: " + produk.stok + ")");
    const konfirmasi: string = readlinesync.question("Yakin ingin menghapus data ini? (y/n): ").toLowerCase();

    if (konfirmasi === "y") {
        daftarProduk.splice(indeks, 1); //Utk Menghapus produk dari
        console.log("Data berhasil dihapus!");
    } else { 
        console.log ("Penghapusan dibatalkan.");
    }
}


//Fitur Search Produk ID
function cariProduk(): void {
    console.log("\n---CARI PRODUK---");
    const katakunci: string = readlinesync.question("Masukkan ID produk: ").toLowerCase();
    let jumlahKetemu: number = 0;

    //Looping array
    for (let i: number = 0; i < daftarProduk.length; i++) {
        const p = daftarProduk[i]!;
        if (p.nama.toLowerCase().includes(katakunci) || p.jenis.toLowerCase().includes(katakunci)){
            console.log(`- [${p.id}]  [${p.nama}]  [${p.jenis}] | Harga: Rp [${p.harga}] | Stok:  [${p.stok}]`);
            jumlahKetemu++;
        }
    }

    if(jumlahKetemu === 0){
        console.log("Data Tidak Ditemukan");
    }
}

//Fitur Transaksi Kasir
function prosesTransaksi(): void {
    console.log("\n---TRANSAKSI KASIR---");
    const id: string = readlinesync.question("Masukkan ID Produk yang dibeli").trim();
    const indeks:number = cariProdukId(id);

    if (indeks === -1 || !daftarProduk[indeks]!.tersedia) {
        console.log("Produk Tidak Tersedia");
        return;
    }

    const produk = daftarProduk[indeks]!;
    const jumlahBeli: number = parseInt(readlinesync.question("Masukkan Jumlah Beli: "));

    if (!validasiAngka(jumlahBeli) || jumlahBeli === 0) {
        console.log("Transaksi Gagal : Jumlah Beli Harus Lebih Dari 0");
        return
    }

    if (jumlahBeli > produk.stok) {
        console.log("Transaksi Gagal : Stok Habis (Sisa stok: " + produk.stok + ").");
        return;
    }

    //Input Tambahan Galon/Gas
    let tipeIsi: string = "-";
    let tipeGas: string = "-";
    if (produk.jenis.toLowerCase()=== "Galon") {
        tipeIsi = readlinesync.question("Tipe Isi (isi_ulang/beli_baru): ").toLowerCase();
    } else if (produk.jenis.toLowerCase() === "Gas") {
        tipeGas = readlinesync.question("Tipe Gas (3kg/5kg): ").toLowerCase();
        tipeIsi = readlinesync.question("Tipe Isi (isi_ulang/beli_baru): ").toLowerCase();
    }

    const metodeBayar: string = readlinesync.question("Metode Bayar (tunai/qris): ").toLowerCase();
    const uangPembayaran: number = parseFloat(readlinesync.question("Nominal Uang Bayar (Rp): "));

    if(!validasiAngka(uangPembayaran)){
        console.log("Transaksi Gagal: Nominal Uang Tidak Valid");
        return;
    }

    const hargaSatuan: number = hitungHargaProduk(produk, tipeIsi, tipeGas);
    const subtotal: number = hargaSatuan * jumlahBeli;
    const diskon: number = produk.statusDiskon ? subtotal * 0.10 : 0;
    const biayaAdmin: number = metodeBayar === "qris"? 2500 : 0;
    const bonusPoin: number = Math.floor(subtotal / 10000);
    const totalAkhir: number = subtotal - diskon + biayaAdmin;

    //Cetak Struk
    console.log("\n-----STRUK PEMBAYARAN-----");
    console.log("Barang         : " + produk.nama + " (x" + jumlahBeli + ")");
    console.log("Subtotal       : Rp." + subtotal);
    console.log("Diskon (10%)   : Rp." + diskon);
    console.log("Biaya Admin    : Rp." + biayaAdmin);
    console.log("\n--------------------------");
    console.log("Total Akhir    : Rp." + totalAkhir);
    console.log("Bonus Poin     : " + bonusPoin + "poin");

    //Validasi stok
    if (uangPembayaran >= totalAkhir) {
        produk.stok -= jumlahBeli; //Stok berkurang apabila ada yg beli
        const kembalian: number = uangPembayaran- totalAkhir;
        console.log("Transaksi Berhasil! Kembalian: Rp" + kembalian);
    } else {
        const kekurangan: number = totalAkhir - uangPembayaran;
        console.log("Transaksi Gagal : Uang Anda Kurang Rp" + kekurangan);

    }
} 
//MENU UTAMA
let pilihanMenu: string = "";

do {
    console.log("\n====================================");
    console.log("      SISTEM KASIR TOKO MBAK TIKA");
    console.log("\n====================================");
    console.log("1. Create (Tambah Produk)" );
    console.log("2. Read (Lihat ID Produk)" );
    console.log("3. Update (Ubah Data Produk)" );
    console.log("4. Delete (Hapus Produk)" );
    console.log("5. Search (Cari Produk)" );
    console.log("6. Transaksi Kasir" );
    console.log("0. Keluar" );

    pilihanMenu = readlinesync.question("Pilih Menu (0-6): ").trim();

    switch(pilihanMenu) {
        case "1":
            tambahProduk();
            break;
        case "2":
            lihatProdukById();
            break;
        case "3":
            ubahProduk();
            break;
        case "4":
            hapusProduk();
            break;
        case "5":
            cariProduk();
            break;
        case "6":
            prosesTransaksi();
            break;
        case "0":
            console.log("ANDA KELUAR DARI SISTEM KASIR");
            break;
        default:
            console.log("Pilihan Tidak Valid");
            break;
    }

} while (pilihanMenu !== "0");