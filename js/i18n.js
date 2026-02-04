// ==========================================
// ভাষা ম্যানেজার (i18n)
// ==========================================

class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'bn';
        this.translations = {};
        this.data = null;
    }
    
    async init(contentData) {
        this.data = contentData;
        this.translations = contentData.translations || this.getDefaultTranslations();
        this.renderLanguageSwitcher();
        this.applyLanguage(this.currentLang);
    }
    
    getDefaultTranslations() {
        return {
            bn: {
                siteTitle: 'আমার সাইট',
                nav: { home: 'হোম', about: 'আমাদের সম্পর্কে', admin: 'অ্যাডমিন' },
                buttons: { readMore: 'আরো পড়ুন', loadMore: 'আরো লোড করুন', search: 'খুঁজুন' },
                messages: { noResults: 'কোনো ফলাফল পাওয়া যায়নি', loading: 'লোড হচ্ছে...' }
            },
            en: {
                siteTitle: 'My Site',
                nav: { home: 'Home', about: 'About', admin: 'Admin' },
                buttons: { readMore: 'Read More', loadMore: 'Load More', search: 'Search' },
                messages: { noResults: 'No results found', loading: 'Loading...' }
            }
        };
    }
    
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        this.applyLanguage(lang);
        window.dispatchEvent(new CustomEvent('languagechange', { detail: lang }));
    }
    
    applyLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
        
        if (contentManager.data) {
            contentManager.renderPosts('posts-container');
        }
    }
    
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            value = value?.[k];
            if (!value) break;
        }
        
        if (!value && this.currentLang !== 'bn') {
            value = this.translations['bn'];
            for (const k of keys) {
                value = value?.[k];
            }
        }
        
        return value || key;
    }
    
    getPostContent(post) {
        return post.translations?.[this.currentLang] || post.translations?.['bn'] || post;
    }
    
    renderLanguageSwitcher() {
        const container = document.getElementById('language-switcher');
        if (!container) return;
        
        const languages = [
            { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
            { code: 'en', name: 'English', flag: '🇬🇧' }
        ];
        
        container.innerHTML = `
            <div class="language-switcher">
                <button class="lang-current" onclick="toggleLangMenu()">
                    ${languages.find(l => l.code === this.currentLang).flag}
                </button>
                <div class="lang-menu" id="lang-menu" style="display:none;position:absolute;background:white;border:1px solid #e2e8f0;border-radius:0.5rem;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                    ${languages.map(lang => `
                        <button onclick="i18n.setLanguage('${lang.code}');toggleLangMenu()" 
                                style="display:block;width:100%;padding:0.75rem 1rem;border:none;background:${lang.code === this.currentLang ? '#eff6ff' : 'white'};text-align:left;cursor:pointer;">
                            ${lang.flag} ${lang.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

function toggleLangMenu() {
    const menu = document.getElementById('lang-menu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
}

const i18n = new I18nManager();
