(function () {
  'use strict';
  // Aktifkan mode pemeriksaan sebelum konten halaman ditampilkan.
  document.documentElement.classList.add('access-checking');

  function makeOverlay(title, message, detail, reload) {
    var old = document.getElementById('accessGuard');
    if (old) old.remove();
    var overlay = document.createElement('div');
    overlay.id = 'accessGuard';
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'accessGuardTitle');
    var card = document.createElement('div');
    card.className = 'access-guard-card';
    var h = document.createElement('h2');
    h.id = 'accessGuardTitle'; h.textContent = title;
    var p = document.createElement('p'); p.textContent = message;
    var d = document.createElement('p'); d.className = 'access-guard-status'; d.textContent = detail || '';
    card.appendChild(h); card.appendChild(p); card.appendChild(d);
    if (reload) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'access-guard-reload';
      b.textContent = 'Coba periksa lagi'; b.addEventListener('click', function () { location.reload(); });
      card.appendChild(b);
    }
    overlay.appendChild(card);
    (document.body || document.documentElement).appendChild(overlay);
    return overlay;
  }

  function hasAdBlock() {
    var bait = document.createElement('div');
    bait.className = 'adsbox ad-banner adsbygoogle ad-placement';
    bait.setAttribute('aria-hidden', 'true');
    bait.style.cssText = 'position:absolute!important;left:-10000px!important;top:-10000px!important;display:block!important;width:12px!important;height:12px!important;';
    document.body.appendChild(bait);
    var cs = window.getComputedStyle(bait);
    var blocked = bait.offsetHeight === 0 || bait.offsetWidth === 0 || cs.display === 'none' || cs.visibility === 'hidden';
    bait.remove();
    return blocked;
  }

  function checkVpn() {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 7000) : null;
    var options = controller ? { cache: 'no-store', signal: controller.signal } : { cache: 'no-store' };
    return fetch('https://hackmyip.com/api/score', options).then(function (res) {
      if (!res.ok) throw new Error('VPN check unavailable');
      return res.json();
    }).then(function (json) {
      var d = json && json.data ? json.data : {};
      var privacy = d.privacy || {};
      var flags = Array.isArray(privacy.flags) ? privacy.flags.join(' ').toLowerCase() : '';
      var type = String(privacy.type || '').toLowerCase();
      // Memblokir VPN/proxy/Tor yang dikenali dan IP pusat data sebagai sinyal tambahan.
      return Boolean(privacy.is_vpn || privacy.is_proxy || privacy.is_tor || privacy.is_datacenter || /vpn|proxy|tor|datacenter|data.center|hosting/.test(flags) || /vpn|proxy|tor|datacenter|data.center|hosting/.test(type));
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  function start() {
    makeOverlay('Memeriksa akses', 'Mohon tunggu sebentar sementara koneksi dan pemblokir iklan diperiksa.', 'Pemeriksaan keamanan sedang berjalan…', false);
    var adBlocked = false;
    try { adBlocked = hasAdBlock(); } catch (e) {}
    if (adBlocked) {
      makeOverlay('AdBlock terdeteksi', 'Untuk mengunjungi website ini, matikan AdBlock atau pemblokir iklan pada browser Anda, lalu muat ulang halaman.', 'Konten tetap terkunci sampai pemeriksaan AdBlock lolos.', true);
      return;
    }
    checkVpn().then(function (blocked) {
      if (blocked) {
        makeOverlay('VPN / Proxy terdeteksi', 'Akses ke website ini tidak tersedia saat menggunakan VPN, proxy, Tor, atau koneksi pusat data. Matikan VPN/proxy lalu muat ulang halaman.', 'Sistem menggunakan pemeriksaan IP pihak ketiga; deteksi tidak selalu sempurna.', true);
      } else {
        var overlay = document.getElementById('accessGuard');
        if (overlay) overlay.remove();
        document.documentElement.classList.remove('access-checking');
      }
    }).catch(function () {
      // Jika layanan pemeriksaan pihak ketiga sedang gagal, izinkan akses agar situs tidak mati total.
      var overlay = document.getElementById('accessGuard');
      if (overlay) overlay.remove();
      document.documentElement.classList.remove('access-checking');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
