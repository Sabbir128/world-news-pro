// ==========================================
// মূল কন্টেন্ট ম্যানেজার
// ==========================================

class ContentManager {
    constructor() {
        this.data = null;
        this.cacheDuration = 60000;
        this.lastFetch = 0;
    }
    
    async loadContent(force = false) {
        const now = Date.now();
        
        if (!force && this.data && (now - this.lastFetch) < this.cacheDuration) {
            return this.data;
        }
        
        try {
            const response = await fetch(`data/content.json?t=${now}`);
            if (!response.ok) throw new Error('লোড করতে ব্যর্থ');
            
            this.data = await response.json();
            this.lastFetch = now;
            return this.data;
        } catch (error) {
            console.error('কন্টেন্ট লোড ত্রুটি:', error);
            return this.data || { posts: [], settings: {} };
        }
    }
    
    async renderPosts(containerId, options = {}) {
        const data = await this.loadContent();
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const { 
            limit = 10, 
            category = null, 
            publishedOnly = true,
            searchQuery = ''
        } = options;
        
        let posts = data.posts || [];
        
        if (publishedOnly) {
            posts = posts.filter(p => p.published !== false && p.status !== 'scheduled');
        }
        
        if (category) {
            posts = posts.filter(p => p.category === category);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            posts = posts.filter(p => {
                const title = (p.translations?.bn?.title || p.title).toLowerCase();
                const content = (p.translations?.bn?.content || p.content).toLowerCase();
                return title.includes(query) || content.includes(query);
            });
        }
        
        posts = posts.slice(0, limit);
        
        if (posts.length === 0) {
            container.innerHTML = '<div class="no-results">কোনো পোস্ট পাওয়া যায়নি</div>';
            return;
        }
        
        container.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
    }
    
    createPostHTML(post) {
        const lang = i18n?.currentLang || 'bn';
        const content = post.translations?.[lang] || post;
        
        return `
            <article class="post-card" data-id="${post.id}">
                ${post.image ? `<img src="${post.image}" class="post-image" alt="${content.title}" loading="lazy">` : ''}
                <h2 class="post-title">${this.escapeHtml(content.title)}</h2>
                <div class="post-meta">
                    <span class="post-category">${post.category}</span>
                    <span>${this.formatDate(post.date)}</span>
                </div>
                <div class="post-content">${this.renderMarkdown(content.content)}</div>
                ${post.tags ? `
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </article>
        `;
    }
    
    renderMarkdown(text) {
        if (!text) return '';
        
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" loading="lazy">')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
            .replace(/\n/gim, '<br>');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    startAutoRefresh(callback) {
        setInterval(async () => {
            const newData = await this.loadContent(true);
            if (callback) callback(newData);
        }, 120000);
    }
}

const contentManager = new ContentManager();
