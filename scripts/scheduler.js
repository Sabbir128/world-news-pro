const fs = require('fs');
const path = require('path');

const CONTENT_PATH = path.join(__dirname, '../data/content.json');

function scheduler() {
    const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
    const now = new Date();
    let modified = false;
    
    content.posts = content.posts.map(post => {
        if (post.status === 'scheduled' && post.publishAt) {
            const publishTime = new Date(post.publishAt);
            
            if (publishTime <= now) {
                console.log(`প্রকাশ করা হচ্ছে: ${post.title}`);
                modified = true;
                return {
                    ...post,
                    status: 'published',
                    published: true,
                    date: now.toISOString().split('T')[0]
                };
            }
        }
        return post;
    });
    
    content.meta.lastScheduledCheck = now.toISOString();
    
    if (modified) {
        fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2));
        console.log('পোস্ট প্রকাশিত হয়েছে');
    }
}

scheduler();
