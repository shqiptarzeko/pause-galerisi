// ===== LIGHTBOX STATE =====
var lbImgs = [];
var lbIndex = 0;

function openLightbox(imgs, index) {
  lbImgs = imgs;
  lbIndex = index;
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  lbImg.src = lbImgs[lbIndex];
  // Dot'ları oluştur
  var dotsEl = document.getElementById('lb-dots');
  dotsEl.innerHTML = '';
  lbImgs.forEach(function(_, i) {
    var d = document.createElement('span');
    d.className = 'lb-dot' + (i === lbIndex ? ' active' : '');
    d.addEventListener('click', function(e) { e.stopPropagation(); lbIndex = i; updateLightboxNav(); });
    dotsEl.appendChild(d);
  });
  // Ok butonlarını sadece birden fazla fotoğrafta göster
  var showArrows = lbImgs.length > 1;
  document.querySelector('.lb-prev').style.display = showArrows ? 'flex' : 'none';
  document.querySelector('.lb-next').style.display = showArrows ? 'flex' : 'none';
  lb.classList.add('active');
  updateLightboxNav();
}

function updateLightboxNav() {
  var lbImg = document.getElementById('lightbox-img');
  lbImg.src = lbImgs[lbIndex];
  // dot güncelle
  var dots = document.querySelectorAll('#lightbox .lb-dot');
  dots.forEach(function(d, i) { d.classList.toggle('active', i === lbIndex); });
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  lbImgs = [];
  lbIndex = 0;
}

function lbGo(dir) {
  if (lbImgs.length < 2) return;
  lbIndex = (lbIndex + dir + lbImgs.length) % lbImgs.length;
  var lbImg = document.getElementById('lightbox-img');
  lbImg.classList.add('fade-out');
  setTimeout(function() {
    lbImg.src = lbImgs[lbIndex];
    lbImg.classList.remove('fade-out');
    updateLightboxNav();
  }, 180);
}

// ===== FLIPCARD – slider =====
document.querySelectorAll('.flipcard').forEach(function(card) {
  var imgs = JSON.parse(card.dataset.imgs);
  var current = 0;
  var imgEl = card.querySelector('.flipcard-img-wrap img');
  var dotsEl = card.querySelector('.flipcard-dots');
  var prevBtn = card.querySelector('.arr-prev');
  var nextBtn = card.querySelector('.arr-next');

  imgs.forEach(function(_, i) {
    var dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', function(e) { e.stopPropagation(); goTo(i); });
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    current = (index + imgs.length) % imgs.length;
    imgEl.classList.add('fade-out');
    setTimeout(function() {
      imgEl.src = imgs[current];
      imgEl.classList.remove('fade-out');
    }, 180);
    dotsEl.querySelectorAll('span').forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', function(e) { e.stopPropagation(); goTo(current - 1); });
  nextBtn.addEventListener('click', function(e) { e.stopPropagation(); goTo(current + 1); });

  imgEl.addEventListener('click', function() {
    openLightbox(imgs, current);
  });
});

// ===== Diğer kartlar (.card) – Lightbox =====
document.querySelectorAll('.card img').forEach(function(img) {
  img.addEventListener('click', function(e) {
    e.stopPropagation();
    openLightbox([this.src], 0);
  });
});

// ===== Klavye =====
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lbGo(1);
  if (e.key === 'ArrowLeft') lbGo(-1);
});
