// ==========================================
// ফিল্টার ম্যানেজার
// ==========================================

class FilterManager {
    constructor(contentManager) {
        this.cm = contentManager;
        this.filters = {
            search: '',
            category: '',
            tags: new Set()
        };
    }
    
    init(data) {
        this.allPosts = data.posts || [];
        this.renderFilterOptions(data.meta);
        this.applyFilters();
    }
    
    renderFilterOptions(meta) {
        const catSelect = document.getElementById('category-filter');
        const categories = meta?.categories || [
            { id: 'tech', name: 'প্রযুক্তি' },
            { id: 'politics', name: 'রাজনীতি' },
            { id: 'sports', name: 'খেলাধুলা' },
            { id: 'entertainment', name: 'বিনোদন' }
        ];
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            catSelect.appendChild(option);
        });
        
        const tagContainer = document.getElementById('tag-filters');
        const tags = meta?.tags || ['জাভাস্ক্রিপ্ট', 'ওয়েব', 'টিউটোরিয়াল', 'খবর'];
        
        tagContainer.innerHTML = tags.map(tag => `
            <button class="tag-filter" onclick="filter.toggleTag('${tag}', this)">${tag}</button>
        `).join('');
    }
    
    toggleTag(tag, btn) {
        if (this.filters.tags.has(tag)) {
            this.filters.tags.delete(tag);
            btn.classList.remove('active');
        } else {
            this.filters.tags.add(tag);
            btn.classList.add('active');
        }
        this.applyFilters();
    }
    
    setSearch(query) {
        this.filters.search = query.toLowerCase();
        this.applyFilters();
    }
    
    setCategory(cat) {
        this.filters.category = cat;
        this.applyFilters();
    }
    
    applyFilters() {
        let filtered = this.allPosts.filter(post => {
            if (post.status === 'scheduled' || post.published === false) return false;
            
            if (this.filters.search) {
                const lang = i18n.currentLang;
                const title = (post.translations?.[lang]?.title || post.title).toLowerCase();
                const content = (post.translations?.[lang]?.content || post.content).toLowerCase();
                if (!title.includes(this.filters.search) && !content.includes(this.filters.search)) {
                    return false;
                }
            }
            
            if (this.filters.category && post.category !== this.filters.category) {
                return false;
            }
            
            if (this.filters.tags.size > 0) {
                const postTags = new Set(post.tags || []);
                for (let tag of this.filters.tags) {
                    if (!postTags.has(tag)) return false;
                }
            }
            
            return true;
        });
        
        this.renderResults(filtered);
    }
    
    renderResults(posts) {
        const container = document.getElementById('posts-container');
        
        if (posts.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>${i18n.t('messages.noResults')}</h3>
                    <p>অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = posts.map(post => this.cm.createPostHTML(post)).join('');
    }
}

function handleSearch() {
    const query = document.getElementById('search-input').value;
    filter.setSearch(query);
}

function applyFilters() {
    const cat = document.getElementById('category-filter').value;
    filter.setCategory(cat);
}

const filter = new FilterManager(contentManager);
