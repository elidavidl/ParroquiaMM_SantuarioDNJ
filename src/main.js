import './style.css';
import { SITE } from './config.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Contacto: WhatsApp / teléfono / correo ---------- */
const hasWA = Boolean(SITE.whatsapp);
const waUrl = (text = '') =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

$$('a[data-wa]').forEach((a) => {
  if (hasWA) {
    a.href = waUrl(a.dataset.waText || '');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  } else {
    a.href = '#contacto'; // sin número confirmado, se usa el formulario
  }
});

$$('[data-fill]').forEach((el) => {
  const key = el.dataset.fill;
  if (key === 'wa-label' && hasWA) el.textContent = `WhatsApp: +${SITE.whatsapp}`;
  if (key === 'phone-label' && SITE.phone) el.textContent = `Teléfono: ${SITE.phone}`;
  if (key === 'phone-plain' && SITE.phone) el.textContent = SITE.phone;
  if (key === 'mass-footer' && SITE.massFooter) el.innerHTML = SITE.massFooter;
  if (key === 'office-footer' && SITE.officeFooter) el.textContent = SITE.officeFooter;
});

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

/* ---------- Menú móvil ---------- */
const menuBtn = $('#menu-btn');
const menu = $('#mobile-menu');
const menuIcon = $('#menu-icon');
function setMenu(open) {
  menu.classList.toggle('hidden', !open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menuIcon.textContent = open ? 'close' : 'menu';
}
menuBtn?.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
$$('#mobile-menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

/* ---------- Enlace activo según la sección visible ---------- */
const navLinks = $$('header nav[data-active-classes] a');
const activeCls = ['text-primary', 'font-bold'];
const idleCls = ['text-on-surface-variant'];
const sectionToPath = {
  inicio: 'inicio', horarios: 'horarios', sacramentos: 'sacramentos', reservas: 'sacramentos',
  historia: 'nuestra-historia', 'red-maria-misionera': 'red-maria-misionera',
  'como-llegar': 'como-llegar', contacto: 'contacto',
};
function markActive(path) {
  navLinks.forEach((a) => {
    const on = a.dataset.path === path;
    a.classList.toggle('text-primary', on);
    a.classList.toggle('font-bold', on);
    a.classList.toggle('text-on-surface-variant', !on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && sectionToPath[en.target.id]) markActive(sectionToPath[en.target.id]);
      });
    },
    { rootMargin: '-35% 0px -55% 0px' },
  );
  Object.keys(sectionToPath).forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------- Imágenes: respaldo si no cargan ---------- */
$$('img[data-fallback]').forEach((img) => {
  const fail = () => img.classList.add('img-fallback');
  img.addEventListener('error', fail);
  if (img.complete && img.naturalWidth === 0) fail();
});

/* ---------- Agregar a mi calendario (.ics) ---------- */
const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

function nextDayOfMonth(day, hour, min) {
  const now = new Date();
  let d = new Date(now.getFullYear(), now.getMonth(), day, hour, min);
  if (d < now) d = new Date(now.getFullYear(), now.getMonth() + 1, day, hour, min);
  return d;
}
function nextFirstSunday(hour, min) {
  const now = new Date();
  const firstSunday = (y, m) => { const d = new Date(y, m, 1, hour, min); d.setDate(1 + ((7 - d.getDay()) % 7)); return d; };
  let d = firstSunday(now.getFullYear(), now.getMonth());
  if (d < now) d = firstSunday(now.getFullYear(), now.getMonth() + 1);
  return d;
}
const EVENTS = {
  novena: {
    title: 'Gran Novena Mensual – Divino Niño Jesús',
    start: () => nextDayOfMonth(25, 18, 0), minutes: 120, rrule: 'FREQ=MONTHLY;BYMONTHDAY=25',
    desc: 'Santo Rosario 6:00 p.m. y Misa 7:00 p.m. (horario referencial: confirmar con la parroquia).',
  },
  ninos: {
    title: 'Misa y Bendición de Niños – Santuario Divino Niño Jesús',
    start: () => nextFirstSunday(10, 0), minutes: 90, rrule: 'FREQ=MONTHLY;BYDAY=1SU',
    desc: 'Primer domingo de cada mes, 10:00 a.m. (horario referencial: confirmar con la parroquia).',
  },
};
function downloadIcs(key) {
  const ev = EVENTS[key];
  if (!ev) return;
  const s = ev.start();
  const e = new Date(s.getTime() + ev.minutes * 60000);
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Santuario Divino Nino Jesus//ES', 'BEGIN:VEVENT',
    `UID:${key}-${Date.now()}@santuario-dnj`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART;TZID=America/Lima:${fmt(s)}`, `DTEND;TZID=America/Lima:${fmt(e)}`,
    `RRULE:${ev.rrule}`, `SUMMARY:${ev.title}`, `DESCRIPTION:${ev.desc}`,
    'LOCATION:Jr. Ismael Escobar 325\\, Pamplona Baja\\, San Juan de Miraflores\\, Lima',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `${key}-divino-nino.ics` });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$$('[data-ics]').forEach((btn) => {
  const key = btn.dataset.ics;
  if (key === 'fiesta') {
    // Fecha por confirmar: llevamos a las redes oficiales en vez de crear un evento inventado.
    const a = document.createElement('a');
    a.className = btn.className;
    a.href = 'https://www.facebook.com/DNJSANTUARIO';
    a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.innerHTML = '<span class="material-symbols-outlined text-[18px]">notifications_active</span><span>Avisarme en Facebook</span>';
    btn.replaceWith(a);
    return;
  }
  btn.type = 'button';
  btn.addEventListener('click', () => downloadIcs(key));
});

/* ---------- Formularios: WhatsApp si hay número, si no correo ---------- */
function formText(form) {
  const kind = form.dataset.form;
  const fd = new FormData(form);
  const sel = (name) => {
    const el = form.elements[name]; return el?.tagName === 'SELECT' ? el.selectedOptions[0].textContent.trim() : fd.get(name);
  };
  const els = [...form.elements].filter((e) => e.name !== undefined);
  return { kind, fd, sel, els };
}
function labelOf(el) {
  const lab = el.closest('div')?.querySelector('label');
  return (lab?.textContent || el.name || '').replace('*', '').trim();
}
$$('form[data-form]').forEach((form) => {
  const status = $('.form-status', form);
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const kind = form.dataset.form;
    const fields = [...form.querySelectorAll('input, select, textarea')];
    const lines = fields.map((el) => {
      const val = el.tagName === 'SELECT' ? el.selectedOptions[0].textContent.trim() : el.value.trim();
      return val ? `${labelOf(el)}: ${val}` : null;
    }).filter(Boolean);
    const title = kind === 'intencion' ? 'Intención de misa' : 'Consulta a secretaría';
    const text = `Paz y Bien. ${title}:\n${lines.join('\n')}`;
    let message;
    if (hasWA) {
      window.open(waUrl(text), '_blank', 'noopener');
      message = 'Abrimos WhatsApp con tu mensaje listo. Solo presiona enviar. ¡Dios te bendiga!';
    } else {
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`;
      message = 'Abrimos tu correo con el mensaje listo para enviar a la secretaría. ¡Dios te bendiga!';
    }
    if (status) { status.textContent = message; status.classList.remove('hidden'); }
    form.reset();
  });
});
