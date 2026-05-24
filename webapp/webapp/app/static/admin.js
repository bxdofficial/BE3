// ByteEgypt Admin Dashboard — client-side controller
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // ---------- API helper ----------
  async function api(path, opts = {}) {
    const r = await fetch('/api' + path, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', ...(opts.headers || {}) },
      credentials: 'same-origin',
      ...opts,
    });
    if (r.status === 401) { location.href = '/admin/login'; return; }
    const json = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(json.error || ('HTTP ' + r.status));
    return json;
  }

  function toast(msg, type = 'success') {
    const host = $('#toastHost');
    const el = document.createElement('div');
    el.className = 'toast toast-' + type;
    el.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'circle-check' : 'circle-exclamation'}"></i> ${esc(msg)}`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 2500);
  }

  // ---------- Modal ----------
  const modal = {
    el: $('#modal'),
    title: $('#modalTitle'),
    body: $('#modalBody'),
    saveBtn: $('#modalSave'),
    open(title, html, onSave) {
      this.title.textContent = title;
      this.body.innerHTML = html;
      this.el.classList.add('show');
      this.saveBtn.onclick = async () => {
        try {
          this.saveBtn.disabled = true;
          await onSave();
          this.close();
        } catch (e) {
          toast(e.message || 'حصلت مشكلة', 'error');
        } finally {
          this.saveBtn.disabled = false;
        }
      };
    },
    close() { this.el.classList.remove('show'); this.body.innerHTML = ''; this.saveBtn.onclick = null; },
  };
  $('#modalClose').onclick = () => modal.close();
  $('#modalCancel').onclick = () => modal.close();
  $('#modal').addEventListener('click', (e) => { if (e.target === modal.el) modal.close(); });

  // ---------- Sidebar / Navigation ----------
  const sidebar = $('#sidebar'), backdrop = $('#backdrop'), menuBtn = $('#menuBtn');
  menuBtn?.addEventListener('click', () => { sidebar.classList.add('show'); backdrop.classList.remove('hidden'); });
  backdrop?.addEventListener('click', () => { sidebar.classList.remove('show'); backdrop.classList.add('hidden'); });

  const pageTitles = {
    overview: 'نظرة عامة',
    images: 'إدارة الصور 🎨',
    settings: 'الإعدادات العامة',
    hero: 'قسم Hero',
    about: 'عن المجتمع',
    features: 'المميزات',
    future: 'الرؤية المستقبلية',
    steps: 'خطوات الانضمام',
    faqs: 'الأسئلة الشائعة',
    roles: 'الرتب',
    stats: 'الإحصائيات',
    safety: 'نقاط الأمان',
    marquee: 'شريط Marquee',
    account: 'تغيير كلمة السر',
  };

  $$('#nav .nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#nav .nav-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      $('#pageTitle').textContent = pageTitles[tab] || tab;
      loadTab(tab);
      // close sidebar on mobile
      if (window.innerWidth < 1024) {
        sidebar.classList.remove('show');
        backdrop.classList.add('hidden');
      }
    });
  });

  // ---------- Image utils ----------
  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () => reject(new Error('Failed to read file'));
      fr.readAsDataURL(file);
    });
  }

  async function pickFile(accept = 'image/*') {
    return new Promise((resolve) => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = accept;
      inp.onchange = () => resolve(inp.files?.[0] || null);
      inp.click();
    });
  }

  // ---------- TAB: Overview ----------
  async function renderOverview() {
    const c = $('#content');
    c.innerHTML = `<div class="text-center py-20 text-slate-400"><i class="fa-solid fa-spinner fa-spin text-3xl"></i></div>`;
    const stats = await api('/overview');
    const cards = [
      { label: 'المميزات', value: stats.features, icon: 'fa-sparkles', color: 'from-purple-500 to-indigo-500' },
      { label: 'الرؤية المستقبلية', value: stats.future, icon: 'fa-rocket', color: 'from-pink-500 to-rose-500' },
      { label: 'خطوات الانضمام', value: stats.steps, icon: 'fa-list-ol', color: 'from-amber-500 to-orange-500' },
      { label: 'الأسئلة الشائعة', value: stats.faqs, icon: 'fa-circle-question', color: 'from-cyan-500 to-blue-500' },
      { label: 'الرتب', value: stats.roles, icon: 'fa-user-shield', color: 'from-emerald-500 to-teal-500' },
      { label: 'الصور المخزنة', value: stats.images, icon: 'fa-images', color: 'from-fuchsia-500 to-pink-500' },
      { label: 'شريط Marquee', value: stats.marquee, icon: 'fa-bars-staggered', color: 'from-lime-500 to-green-500' },
    ];
    c.innerHTML = `
      <div class="mb-6">
        <h2 class="text-2xl font-black mb-2">مرحباً بك في لوحة التحكم 👋</h2>
        <p class="text-slate-400">من هنا تقدر تعدل كل حاجة في الموقع — النصوص، الصور، والأقسام.</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        ${cards.map((c) => `
          <div class="card">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3">
              <i class="fa-solid ${c.icon} text-white text-xl"></i>
            </div>
            <div class="text-3xl font-black mb-1">${c.value}</div>
            <div class="text-sm text-slate-400">${c.label}</div>
          </div>
        `).join('')}
      </div>

      <div class="card mt-6">
        <h3 class="font-bold text-lg mb-3"><i class="fa-solid fa-lightbulb text-amber-400"></i> اختصارات سريعة</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button onclick="document.querySelector('[data-tab=images]').click()" class="btn btn-ghost justify-center"><i class="fa-solid fa-image"></i> تعديل الصور</button>
          <button onclick="document.querySelector('[data-tab=hero]').click()" class="btn btn-ghost justify-center"><i class="fa-solid fa-bullhorn"></i> تعديل Hero</button>
          <button onclick="document.querySelector('[data-tab=features]').click()" class="btn btn-ghost justify-center"><i class="fa-solid fa-sparkles"></i> إدارة المميزات</button>
          <button onclick="document.querySelector('[data-tab=faqs]').click()" class="btn btn-ghost justify-center"><i class="fa-solid fa-circle-question"></i> الأسئلة</button>
          <a href="/" target="_blank" class="btn btn-primary justify-center"><i class="fa-solid fa-eye"></i> معاينة الموقع</a>
        </div>
      </div>
    `;
  }

  // ---------- TAB: Images ----------
  // Image slots used throughout the site
  const IMAGE_SLOTS = [
    { id: 'logo', name: 'شعار الموقع', description: 'يظهر في النافبار، الفوتر، الكارد، CTA — ومثبت كـ favicon. مقاس مفضل 400x400 SVG/PNG.' },
  ];

  async function renderImages() {
    const c = $('#content');
    c.innerHTML = `<div class="text-center py-20 text-slate-400"><i class="fa-solid fa-spinner fa-spin text-3xl"></i></div>`;
    const { items } = await api('/images');
    const byId = Object.fromEntries(items.map((i) => [i.id, i]));

    // Render predefined slots
    const slotsHTML = IMAGE_SLOTS.map((slot) => {
      const img = byId[slot.id];
      const src = img ? `/images/${slot.id}?v=${Date.parse(img.updated_at || '') || Date.now()}` : '/static/logo.svg';
      return `
        <div class="image-card">
          <div class="image-preview"><img src="${esc(src)}" alt="${esc(slot.name)}" /></div>
          <div class="image-info">
            <h4 class="font-bold mb-1">${esc(slot.name)}</h4>
            <p class="text-xs text-slate-400 mb-3">${esc(slot.description)}</p>
            <div class="flex gap-2">
              <button class="btn btn-primary btn-sm flex-1" data-upload="${esc(slot.id)}" data-name="${esc(slot.name)}" data-desc="${esc(slot.description)}">
                <i class="fa-solid fa-upload"></i> ${img ? 'تغيير الصورة' : 'رفع صورة'}
              </button>
              ${img ? `<button class="btn btn-danger btn-sm" data-delete="${esc(slot.id)}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
            ${img ? `<p class="text-[10px] text-slate-500 mt-2">${esc(img.mime_type || '')} • ${formatBytes(img.size_bytes)}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Other custom images
    const customImages = items.filter((i) => !IMAGE_SLOTS.some((s) => s.id === i.id));
    const customHTML = customImages.map((img) => `
      <div class="image-card">
        <div class="image-preview"><img src="/images/${esc(img.id)}?v=${Date.parse(img.updated_at || '') || Date.now()}" /></div>
        <div class="image-info">
          <h4 class="font-bold mb-1">${esc(img.name)}</h4>
          <p class="text-xs text-slate-400 mb-3">ID: <code class="text-purple-300">${esc(img.id)}</code></p>
          <div class="flex gap-2">
            <button class="btn btn-primary btn-sm flex-1" data-upload="${esc(img.id)}" data-name="${esc(img.name)}" data-desc="${esc(img.description || '')}">
              <i class="fa-solid fa-upload"></i> تغيير
            </button>
            <button class="btn btn-danger btn-sm" data-delete="${esc(img.id)}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
    `).join('');

    c.innerHTML = `
      <div class="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 class="text-2xl font-black mb-1">إدارة الصور 🎨</h2>
          <p class="text-slate-400 text-sm">ارفع وعدّل الصور المستخدمة في الموقع. الحد الأقصى ~1.5MB لكل صورة.</p>
        </div>
        <button id="addCustomImg" class="btn btn-primary"><i class="fa-solid fa-plus"></i> إضافة صورة مخصصة</button>
      </div>

      <div class="section-block">
        <div class="section-block-title"><i class="fa-solid fa-star text-amber-400"></i> صور الموقع الأساسية</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${slotsHTML}</div>
      </div>

      ${customHTML ? `
      <div class="section-block">
        <div class="section-block-title"><i class="fa-solid fa-folder-open text-purple-400"></i> صور مخصصة</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${customHTML}</div>
      </div>` : ''}
    `;

    // Wire up
    c.querySelectorAll('[data-upload]').forEach((btn) => {
      btn.addEventListener('click', () => uploadImageDialog(btn.dataset.upload, btn.dataset.name, btn.dataset.desc));
    });
    c.querySelectorAll('[data-delete]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('متأكد إنك عايز تمسح الصورة دي؟')) return;
        try {
          await api('/images/' + encodeURIComponent(btn.dataset.delete), { method: 'DELETE' });
          toast('تم الحذف');
          renderImages();
        } catch (e) { toast(e.message, 'error'); }
      });
    });
    $('#addCustomImg').onclick = () => addCustomImageDialog();
  }

  function formatBytes(b) {
    if (!b) return '—';
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(2) + ' MB';
  }

  function uploadImageDialog(id, name, desc) {
    const html = `
      <div>
        <p class="text-sm text-slate-400 mb-4">رفع صورة لـ: <strong class="text-white">${esc(name)}</strong></p>
        <div class="dropzone" id="dz">
          <i class="fa-solid fa-cloud-arrow-up text-4xl text-purple-400 mb-2"></i>
          <p class="font-bold">اضغط لاختيار صورة أو اسحبها هنا</p>
          <p class="text-xs text-slate-500 mt-1">PNG, JPG, SVG, WebP — أقل من 1.5 ميجابايت</p>
        </div>
        <div id="dzPreview" class="mt-4 hidden">
          <div class="image-preview rounded-xl"><img id="dzImg" class="max-h-48"/></div>
          <p id="dzInfo" class="text-xs text-slate-400 mt-2 text-center"></p>
        </div>
        <div class="mt-4">
          <label class="label">اسم الصورة</label>
          <input type="text" id="imgName" class="input" value="${esc(name)}" />
        </div>
        <div class="mt-3">
          <label class="label">وصف (اختياري)</label>
          <input type="text" id="imgDesc" class="input" value="${esc(desc || '')}" />
        </div>
      </div>
    `;
    let pendingFile = null;
    let pendingDataUrl = null;

    modal.open('رفع/تغيير صورة', html, async () => {
      if (!pendingDataUrl) throw new Error('من فضلك اختر صورة');
      await api('/images/' + encodeURIComponent(id), {
        method: 'PUT',
        body: JSON.stringify({
          name: $('#imgName').value,
          description: $('#imgDesc').value,
          data_url: pendingDataUrl,
          mime_type: pendingFile?.type || null,
          size_bytes: pendingFile?.size || pendingDataUrl.length,
        }),
      });
      toast('تم الحفظ');
      renderImages();
    });

    async function handleFile(file) {
      if (!file) return;
      if (file.size > 1_500_000) {
        toast('الصورة كبيرة جداً (الحد 1.5 ميجا)', 'error');
        return;
      }
      pendingFile = file;
      pendingDataUrl = await fileToDataURL(file);
      $('#dzImg').src = pendingDataUrl;
      $('#dzInfo').textContent = `${file.name} • ${formatBytes(file.size)}`;
      $('#dzPreview').classList.remove('hidden');
    }

    const dz = $('#dz');
    dz.addEventListener('click', async () => {
      const file = await pickFile();
      handleFile(file);
    });
    dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', (e) => {
      e.preventDefault();
      dz.classList.remove('dragover');
      handleFile(e.dataTransfer.files[0]);
    });
  }

  function addCustomImageDialog() {
    const html = `
      <div>
        <div class="mb-3">
          <label class="label">معرّف الصورة (ID) — حروف إنجليزية وأرقام فقط</label>
          <input type="text" id="newImgId" class="input" placeholder="my_custom_image" />
        </div>
        <div class="mb-3">
          <label class="label">اسم الصورة</label>
          <input type="text" id="newImgName" class="input" placeholder="صورة كذا" />
        </div>
        <div class="mb-3">
          <label class="label">وصف</label>
          <input type="text" id="newImgDesc" class="input" placeholder="مكان استخدامها" />
        </div>
        <div class="dropzone" id="dzNew">
          <i class="fa-solid fa-cloud-arrow-up text-4xl text-purple-400 mb-2"></i>
          <p class="font-bold">اختر صورة</p>
        </div>
        <div id="dzNewPreview" class="mt-3 hidden">
          <div class="image-preview rounded-xl"><img id="dzNewImg" class="max-h-32"/></div>
        </div>
      </div>
    `;
    let pendingFile = null, pendingDataUrl = null;
    modal.open('إضافة صورة مخصصة', html, async () => {
      const id = $('#newImgId').value.trim();
      const name = $('#newImgName').value.trim() || id;
      const desc = $('#newImgDesc').value.trim();
      if (!id || !/^[a-zA-Z0-9_\-]+$/.test(id)) throw new Error('ID لازم يكون حروف إنجليزية وأرقام فقط');
      if (!pendingDataUrl) throw new Error('اختر صورة');
      await api('/images/' + encodeURIComponent(id), {
        method: 'PUT',
        body: JSON.stringify({
          name, description: desc, data_url: pendingDataUrl,
          mime_type: pendingFile?.type, size_bytes: pendingFile?.size,
        }),
      });
      toast('تمت الإضافة');
      renderImages();
    });

    const dz = $('#dzNew');
    dz.addEventListener('click', async () => {
      const file = await pickFile();
      if (!file) return;
      if (file.size > 1_500_000) { toast('الصورة كبيرة جداً', 'error'); return; }
      pendingFile = file;
      pendingDataUrl = await fileToDataURL(file);
      $('#dzNewImg').src = pendingDataUrl;
      $('#dzNewPreview').classList.remove('hidden');
    });
  }

  // ---------- TAB: Generic settings page ----------
  // Group settings by section for editing
  const SETTING_GROUPS = {
    settings: {
      title: 'إعدادات الموقع',
      icon: 'fa-globe',
      fields: [
        { key: 'site_title', label: 'عنوان الصفحة (Title)' },
        { key: 'site_description', label: 'وصف الموقع (Description)', textarea: true },
        { key: 'invite_link', label: 'رابط دعوة Discord' },
        { key: 'brand_name_en', label: 'اسم العلامة بالإنجليزي' },
        { key: 'brand_name_ar', label: 'اسم العلامة بالعربي' },
        { key: 'signature', label: 'التوقيع (يظهر في الفوتر)' },
        { key: 'footer_brand_title', label: 'عنوان البراند في الفوتر' },
        { key: 'footer_brand_desc', label: 'وصف الفوتر' },
        { key: 'footer_copyright', label: 'حقوق النشر' },
      ],
    },
    hero: {
      title: 'قسم Hero (أول الصفحة)',
      icon: 'fa-bullhorn',
      fields: [
        { key: 'hero_badge', label: 'البادج العلوي' },
        { key: 'hero_subtitle', label: 'النص التحت العنوان (يدعم HTML)', textarea: true },
        { key: 'hero_cta_primary', label: 'نص زر الانضمام' },
        { key: 'hero_cta_secondary', label: 'نص الزر الثاني' },
        { key: 'hero_trust_1', label: 'عنصر ثقة 1' },
        { key: 'hero_trust_2', label: 'عنصر ثقة 2' },
        { key: 'hero_trust_3', label: 'عنصر ثقة 3' },
      ],
    },
    about: {
      title: 'قسم عن المجتمع',
      icon: 'fa-circle-info',
      fields: [
        { key: 'about_eyebrow', label: 'النص الصغير (Eyebrow)' },
        { key: 'about_title', label: 'العنوان (HTML)', textarea: true },
        { key: 'about_p1', label: 'الفقرة الأولى (HTML)', textarea: true },
        { key: 'about_p2', label: 'الفقرة الثانية (HTML)', textarea: true },
        { key: 'about_check_1', label: '✓ نقطة 1 (HTML)' },
        { key: 'about_check_2', label: '✓ نقطة 2 (HTML)' },
        { key: 'about_check_3', label: '✓ نقطة 3 (HTML)' },
        { key: 'about_check_4', label: '✓ نقطة 4 (HTML)' },
        { key: 'about_check_5', label: '✓ نقطة 5 (HTML)' },
        { key: 'discord_eyebrow', label: 'قسم Discord — Eyebrow' },
        { key: 'discord_title', label: 'قسم Discord — العنوان (HTML)', textarea: true },
        { key: 'discord_sub', label: 'قسم Discord — وصف', textarea: true },
        { key: 'discord_card1_title', label: 'كارد 1 — عنوان' },
        { key: 'discord_card1_desc', label: 'كارد 1 — وصف', textarea: true },
        { key: 'discord_card2_title', label: 'كارد 2 — عنوان' },
        { key: 'discord_card2_desc', label: 'كارد 2 — وصف', textarea: true },
        { key: 'discord_card3_title', label: 'كارد 3 — عنوان' },
        { key: 'discord_card3_desc', label: 'كارد 3 — وصف', textarea: true },
      ],
    },
    discord_intro: {
      title: 'قسم "إيه هو ديسكورد؟"',
      icon: 'fa-discord',
      fields: [
        { key: 'discord_eyebrow', label: 'النص الصغير (Eyebrow)' },
        { key: 'discord_title', label: 'العنوان (HTML)', textarea: true },
        { key: 'discord_sub', label: 'الوصف الكبير', textarea: true },
        { key: 'discord_card1_title', label: 'كارد 1 — عنوان' },
        { key: 'discord_card1_desc', label: 'كارد 1 — وصف', textarea: true },
        { key: 'discord_card2_title', label: 'كارد 2 — عنوان' },
        { key: 'discord_card2_desc', label: 'كارد 2 — وصف', textarea: true },
        { key: 'discord_card3_title', label: 'كارد 3 — عنوان' },
        { key: 'discord_card3_desc', label: 'كارد 3 — وصف', textarea: true },
      ],
    },
    cta: {
      title: 'الـ Call to Action النهائي',
      icon: 'fa-bullhorn',
      fields: [
        { key: 'cta_title', label: 'العنوان (HTML)', textarea: true },
        { key: 'cta_desc', label: 'الوصف', textarea: true },
        { key: 'cta_button', label: 'نص الزر' },
        { key: 'invite_link', label: 'رابط دعوة Discord' },
      ],
    },
  };

  async function renderSettingsTab(groupKey) {
    const group = SETTING_GROUPS[groupKey];
    const c = $('#content');
    c.innerHTML = `<div class="text-center py-20 text-slate-400"><i class="fa-solid fa-spinner fa-spin text-3xl"></i></div>`;
    const { settings } = await api('/settings');
    const fieldsHTML = group.fields.map((f) => `
      <div ${f.textarea ? 'class="md:col-span-2"' : ''}>
        <label class="label">${esc(f.label)} <code class="text-purple-300 text-[10px]">${esc(f.key)}</code></label>
        ${f.textarea
          ? `<textarea class="textarea" data-key="${esc(f.key)}">${esc(settings[f.key] || '')}</textarea>`
          : `<input type="text" class="input" data-key="${esc(f.key)}" value="${esc(settings[f.key] || '')}" />`}
      </div>
    `).join('');
    c.innerHTML = `
      <div class="section-block">
        <div class="section-block-title"><i class="fa-solid ${group.icon} text-purple-400"></i> ${esc(group.title)}</div>
        <div class="settings-grid">${fieldsHTML}</div>
        <div class="mt-6 flex justify-end gap-2">
          <button class="btn btn-ghost" id="resetBtn"><i class="fa-solid fa-rotate-left"></i> إلغاء</button>
          <button class="btn btn-primary" id="saveBtn"><i class="fa-solid fa-floppy-disk"></i> حفظ كل التعديلات</button>
        </div>
      </div>
    `;
    $('#saveBtn').onclick = async () => {
      const updates = {};
      $$('#content [data-key]').forEach((el) => { updates[el.dataset.key] = el.value; });
      try {
        await api('/settings', { method: 'PUT', body: JSON.stringify({ settings: updates }) });
        toast('تم الحفظ ✨');
      } catch (e) { toast(e.message, 'error'); }
    };
    $('#resetBtn').onclick = () => renderSettingsTab(groupKey);
  }

  // ---------- TAB: List sections (features, future, steps, faqs, roles, stats, safety, marquee) ----------
  const LIST_CONFIG = {
    features: {
      title: 'المميزات',
      icon: 'fa-sparkles',
      sectionSettings: ['features_eyebrow', 'features_title', 'features_sub'],
      table: 'features',
      fields: [
        { key: 'title', label: 'العنوان' },
        { key: 'description', label: 'الوصف', textarea: true },
        { key: 'icon', label: 'أيقونة FontAwesome', hint: 'مثل fa-solid fa-code' },
        { key: 'gradient', label: 'تدرج اللون (Gradient CSS)', hint: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
      ],
      render: (it) => ({
        icon: it.icon, bg: it.gradient, title: it.title, sub: it.description,
      }),
    },
    future: {
      title: 'الرؤية المستقبلية',
      icon: 'fa-rocket',
      sectionSettings: ['future_eyebrow', 'future_title', 'future_sub', 'future_note'],
      table: 'future_cards',
      fields: [
        { key: 'title', label: 'العنوان' },
        { key: 'description', label: 'الوصف', textarea: true },
        { key: 'icon', label: 'أيقونة FontAwesome' },
        { key: 'badge', label: 'البادج (افتراضي: قريباً)' },
      ],
      render: (it) => ({ icon: it.icon, bg: 'linear-gradient(135deg,#ec4899,#a855f7)', title: it.title, sub: it.description }),
    },
    steps: {
      title: 'خطوات الانضمام',
      icon: 'fa-list-ol',
      sectionSettings: ['join_eyebrow', 'join_title', 'join_sub', 'join_cta', 'join_note'],
      table: 'steps',
      fields: [
        { key: 'step_num', label: 'رقم الخطوة', type: 'number' },
        { key: 'title', label: 'العنوان' },
        { key: 'description', label: 'الوصف', textarea: true },
        { key: 'icon', label: 'أيقونة FontAwesome' },
      ],
      render: (it) => ({ icon: it.icon, bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', title: `${it.step_num}. ${it.title}`, sub: it.description }),
    },
    faqs: {
      title: 'الأسئلة الشائعة',
      icon: 'fa-circle-question',
      sectionSettings: ['faq_eyebrow', 'faq_title'],
      table: 'faqs',
      fields: [
        { key: 'question', label: 'السؤال' },
        { key: 'answer', label: 'الإجابة (يدعم HTML)', textarea: true },
      ],
      render: (it) => ({ icon: 'fa-solid fa-question', bg: 'linear-gradient(135deg,#06b6d4,#3b82f6)', title: it.question, sub: it.answer }),
    },
    roles: {
      title: 'الرتب',
      icon: 'fa-user-shield',
      sectionSettings: ['roles_eyebrow', 'roles_title', 'roles_sub'],
      table: 'roles',
      fields: [
        { key: 'group_name', label: 'المجموعة', type: 'select', options: [
          { v: 'years', t: 'السنوات الدراسية' },
          { v: 'specializations', t: 'التخصصات التقنية' },
        ]},
        { key: 'label', label: 'النص (مع الإيموجي)' },
        { key: 'color', label: 'اللون (HEX)', type: 'color' },
      ],
      render: (it) => ({ icon: 'fa-solid fa-circle', bg: it.color, title: it.label, sub: `مجموعة: ${it.group_name === 'years' ? 'السنوات الدراسية' : 'التخصصات'}` }),
    },
    stats: {
      title: 'الإحصائيات (قسم About)',
      icon: 'fa-chart-simple',
      sectionSettings: [],
      table: 'stats',
      fields: [
        { key: 'number', label: 'الرقم (نص)' },
        { key: 'label', label: 'الوصف' },
        { key: 'icon', label: 'أيقونة FontAwesome' },
      ],
      render: (it) => ({ icon: it.icon, bg: 'linear-gradient(135deg,#10b981,#06b6d4)', title: `${it.number} — ${it.label}`, sub: '' }),
    },
    safety: {
      title: 'نقاط الأمان',
      icon: 'fa-shield-halved',
      sectionSettings: ['safety_eyebrow', 'safety_title', 'safety_desc'],
      table: 'safety_points',
      fields: [
        { key: 'text', label: 'النص' },
        { key: 'icon', label: 'أيقونة FontAwesome' },
      ],
      render: (it) => ({ icon: it.icon, bg: 'linear-gradient(135deg,#84cc16,#10b981)', title: it.text, sub: '' }),
    },
    marquee: {
      title: 'شريط Marquee',
      icon: 'fa-bars-staggered',
      sectionSettings: [],
      table: 'marquee_items',
      fields: [
        { key: 'label', label: 'النص (مثل Python)' },
        { key: 'icon', label: 'أيقونة FontAwesome' },
      ],
      render: (it) => ({ icon: it.icon, bg: 'linear-gradient(135deg,#fbbf24,#f59e0b)', title: it.label, sub: '' }),
    },
    onestop: {
      title: 'كل اللي محتاجه في مكان واحد',
      icon: 'fa-box-archive',
      sectionSettings: ['onestop_eyebrow', 'onestop_title', 'onestop_sub', 'onestop_footnote'],
      table: 'onestop_items',
      fields: [
        { key: 'title', label: 'العنوان' },
        { key: 'description', label: 'الوصف', textarea: true },
        { key: 'icon', label: 'أيقونة FontAwesome', hint: 'مثل fa-solid fa-code' },
        { key: 'gradient', label: 'تدرج اللون (CSS Gradient)', hint: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
      ],
      render: (it) => ({ icon: it.icon, bg: it.gradient, title: it.title, sub: it.description }),
    },
  };

  async function renderListTab(tabKey) {
    const cfg = LIST_CONFIG[tabKey];
    const c = $('#content');
    c.innerHTML = `<div class="text-center py-20 text-slate-400"><i class="fa-solid fa-spinner fa-spin text-3xl"></i></div>`;
    const [{ items }, { settings }] = await Promise.all([
      api('/list/' + cfg.table),
      api('/settings'),
    ]);

    // Section settings block
    let sectionHTML = '';
    if (cfg.sectionSettings && cfg.sectionSettings.length) {
      const fieldsHTML = cfg.sectionSettings.map((k) => `
        <div ${k.includes('title') || k.includes('sub') || k.includes('note') || k.includes('desc') ? 'class="md:col-span-2"' : ''}>
          <label class="label">${esc(k)}</label>
          <textarea class="textarea" data-skey="${esc(k)}" rows="2">${esc(settings[k] || '')}</textarea>
        </div>
      `).join('');
      sectionHTML = `
        <div class="section-block">
          <div class="section-block-title"><i class="fa-solid fa-pen-to-square text-amber-400"></i> نصوص القسم</div>
          <div class="settings-grid">${fieldsHTML}</div>
          <div class="mt-4 flex justify-end">
            <button id="saveSectionBtn" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> حفظ نصوص القسم</button>
          </div>
        </div>
      `;
    }

    // Items list
    const itemsHTML = items.map((it) => {
      const r = cfg.render(it);
      return `
        <div class="item-card" data-id="${it.id}">
          <div class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></div>
          <div class="item-icon" style="background:${esc(r.bg)}"><i class="${esc(r.icon)}"></i></div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold mb-1 truncate">${esc(r.title)}</h4>
            <p class="text-sm text-slate-400 line-clamp-2">${esc(r.sub).replace(/<[^>]+>/g, '')}</p>
          </div>
          <div class="flex flex-col gap-1">
            <button class="btn btn-ghost btn-sm" data-edit="${it.id}"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-ghost btn-sm" data-toggle="${it.id}" data-visible="${it.is_visible}">
              <i class="fa-solid ${it.is_visible ? 'fa-eye' : 'fa-eye-slash text-slate-500'}"></i>
            </button>
            <button class="btn btn-danger btn-sm" data-del="${it.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
    }).join('');

    c.innerHTML = `
      ${sectionHTML}
      <div class="section-block">
        <div class="section-block-title flex items-center justify-between w-full">
          <span><i class="fa-solid ${cfg.icon} text-purple-400"></i> العناصر (${items.length})</span>
          <button id="addItemBtn" class="btn btn-primary btn-sm"><i class="fa-solid fa-plus"></i> إضافة جديد</button>
        </div>
        <div id="itemsList" class="space-y-2">${itemsHTML || '<p class="text-slate-500 text-center py-8">مفيش عناصر — اضغط إضافة</p>'}</div>
      </div>
    `;

    if ($('#saveSectionBtn')) {
      $('#saveSectionBtn').onclick = async () => {
        const updates = {};
        $$('#content [data-skey]').forEach((el) => { updates[el.dataset.skey] = el.value; });
        try {
          await api('/settings', { method: 'PUT', body: JSON.stringify({ settings: updates }) });
          toast('تم الحفظ ✨');
        } catch (e) { toast(e.message, 'error'); }
      };
    }

    $('#addItemBtn').onclick = () => editItemDialog(cfg, null);
    $$('#itemsList [data-edit]').forEach((b) => b.onclick = () => {
      const item = items.find((x) => x.id == b.dataset.edit);
      editItemDialog(cfg, item);
    });
    $$('#itemsList [data-del]').forEach((b) => b.onclick = async () => {
      if (!confirm('متأكد من الحذف؟')) return;
      try {
        await api(`/list/${cfg.table}/${b.dataset.del}`, { method: 'DELETE' });
        toast('تم الحذف');
        renderListTab(tabKey);
      } catch (e) { toast(e.message, 'error'); }
    });
    $$('#itemsList [data-toggle]').forEach((b) => b.onclick = async () => {
      const newVal = b.dataset.visible === '1' ? 0 : 1;
      try {
        await api(`/list/${cfg.table}/${b.dataset.toggle}`, {
          method: 'PUT',
          body: JSON.stringify({ is_visible: newVal }),
        });
        toast(newVal ? 'تم الإظهار' : 'تم الإخفاء');
        renderListTab(tabKey);
      } catch (e) { toast(e.message, 'error'); }
    });
  }

  function editItemDialog(cfg, item) {
    const fieldsHTML = cfg.fields.map((f) => {
      const val = item?.[f.key] ?? '';
      if (f.type === 'select') {
        return `
          <div>
            <label class="label">${esc(f.label)}</label>
            <select class="select" data-f="${esc(f.key)}">
              ${f.options.map((o) => `<option value="${esc(o.v)}" ${val === o.v ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}
            </select>
          </div>
        `;
      }
      if (f.type === 'color') {
        return `
          <div>
            <label class="label">${esc(f.label)}</label>
            <div class="flex gap-2">
              <input type="color" class="w-14 h-10 rounded-lg border border-slate-700 bg-slate-900" data-f="${esc(f.key)}" value="${esc(val || '#8b5cf6')}" />
              <input type="text" class="input flex-1" data-fmirror="${esc(f.key)}" value="${esc(val || '#8b5cf6')}" />
            </div>
          </div>
        `;
      }
      if (f.textarea) {
        return `
          <div class="md:col-span-2">
            <label class="label">${esc(f.label)}${f.hint ? `<span class="text-slate-500 font-normal mr-2">— ${esc(f.hint)}</span>` : ''}</label>
            <textarea class="textarea" data-f="${esc(f.key)}">${esc(val)}</textarea>
          </div>
        `;
      }
      return `
        <div>
          <label class="label">${esc(f.label)}${f.hint ? `<span class="text-slate-500 font-normal mr-2">— ${esc(f.hint)}</span>` : ''}</label>
          <input type="${f.type || 'text'}" class="input" data-f="${esc(f.key)}" value="${esc(val)}" />
        </div>
      `;
    }).join('');

    const html = `
      <div class="settings-grid">${fieldsHTML}</div>
      ${item ? '' : `<p class="text-xs text-slate-500 mt-3"><i class="fa-solid fa-info-circle"></i> العنصر الجديد هيتضاف في آخر القائمة</p>`}
    `;

    modal.open(item ? 'تعديل عنصر' : 'إضافة عنصر جديد', html, async () => {
      const payload = {};
      // mirror color inputs to text
      $$('#modalBody [data-f]').forEach((el) => {
        let val = el.value;
        if (el.type === 'number') val = Number(val);
        payload[el.dataset.f] = val;
      });
      if (!item) {
        payload.sort_order = 999;
        payload.is_visible = 1;
      }
      if (item) {
        await api(`/list/${cfg.table}/${item.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await api(`/list/${cfg.table}`, { method: 'POST', body: JSON.stringify(payload) });
      }
      toast(item ? 'تم التعديل' : 'تمت الإضافة');
      // re-render current tab
      const activeTab = document.querySelector('#nav .nav-btn.active')?.dataset.tab;
      if (activeTab) loadTab(activeTab);
    });

    // wire color mirrors
    $$('#modalBody input[type=color][data-f]').forEach((cInp) => {
      const mirror = $(`#modalBody [data-fmirror="${cInp.dataset.f}"]`);
      if (mirror) {
        cInp.addEventListener('input', () => mirror.value = cInp.value);
        mirror.addEventListener('input', () => { if (/^#[0-9a-fA-F]{6}$/.test(mirror.value)) cInp.value = mirror.value; });
      }
    });
  }

  // ---------- TAB: Account / change password ----------
  function renderAccount() {
    const c = $('#content');
    c.innerHTML = `
      <div class="section-block max-w-xl mx-auto">
        <div class="section-block-title"><i class="fa-solid fa-user-gear text-purple-400"></i> تغيير كلمة السر</div>
        <div class="space-y-4">
          <div>
            <label class="label">كلمة السر الحالية</label>
            <input type="password" class="input" id="curPwd" autocomplete="current-password" />
          </div>
          <div>
            <label class="label">كلمة السر الجديدة (6 أحرف على الأقل)</label>
            <input type="password" class="input" id="newPwd" autocomplete="new-password" />
          </div>
          <div>
            <label class="label">تأكيد كلمة السر الجديدة</label>
            <input type="password" class="input" id="newPwd2" autocomplete="new-password" />
          </div>
          <button class="btn btn-primary w-full justify-center" id="changePwdBtn">
            <i class="fa-solid fa-key"></i> تغيير كلمة السر
          </button>
        </div>
      </div>
    `;
    $('#changePwdBtn').onclick = async () => {
      const cur = $('#curPwd').value, nw = $('#newPwd').value, nw2 = $('#newPwd2').value;
      if (nw !== nw2) return toast('كلمتي السر الجديدتين مش متطابقتين', 'error');
      if (nw.length < 6) return toast('كلمة السر الجديدة لازم 6 أحرف', 'error');
      try {
        await api('/account/password', { method: 'POST', body: JSON.stringify({ current: cur, next: nw }) });
        toast('تم تغيير كلمة السر');
        $('#curPwd').value = $('#newPwd').value = $('#newPwd2').value = '';
      } catch (e) { toast(e.message, 'error'); }
    };
  }

  // ---------- Tab dispatcher ----------
  function loadTab(tab) {
    if (tab === 'overview') return renderOverview();
    if (tab === 'images') return renderImages();
    if (tab === 'settings' || tab === 'hero' || tab === 'about' || tab === 'discord_intro' || tab === 'cta') return renderSettingsTab(tab);
    if (LIST_CONFIG[tab]) return renderListTab(tab);
    if (tab === 'account') return renderAccount();
    $('#content').innerHTML = `<div class="text-center py-20 text-slate-500">قسم غير متوفر</div>`;
  }

  // Initial load
  loadTab('overview');
})();
