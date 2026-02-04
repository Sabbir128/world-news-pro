// ==========================================
// এনালিটিক্স ম্যানেজার
// ==========================================

class AnalyticsManager {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
    }
    
    init() {
        this.trackPageView();
        this.initScrollTracking();
        this.initEngagementTracking();
    }
    
    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 9);
    }
    
    track(event, properties = {}) {
        const data = {
            event,
            properties: {
                ...properties,
                path: window.location.pathname,
                timestamp: new Date().toISOString(),
                sessionId: this.sessionId
            }
        };
        
        // LocalStorage এ স্টোর (পরে পাঠানোর জন্য)
        this.events.push(data);
        localStorage.setItem('analytics_events', JSON.stringify(this.events));
        
        // Console এ দেখান (ডেভেলপমেন্টে)
        console.log('Analytics:', data);
    }
    
    trackPageView() {
        this.track('page_view', {
            referrer: document.referrer,
            title: document.title
        });
    }
    
    initScrollTracking() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                if ([25, 50, 75, 90, 100].includes(maxScroll)) {
                    this.track('scroll_depth', { depth: maxScroll });
                }
            }
        });
    }
    
    initEngagementTracking() {
        let startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.track('engagement', { time_on_page: timeSpent });
        });
    }
}

const analytics = new AnalyticsManager();
