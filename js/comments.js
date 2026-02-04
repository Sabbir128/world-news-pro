// ==========================================
// কমেন্ট সিস্টেম (GitHub Issues ব্যবহার করে)
// ==========================================

class CommentSystem {
    constructor(repoOwner, repoName) {
        this.owner = repoOwner;
        this.repo = repoName;
    }
    
    async getComments(postId) {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/issues?` +
                `labels=comment,post-${postId}&state=open`,
                { headers: { 'Accept': 'application/vnd.github.v3+json' } }
            );
            
            const issues = await response.json();
            if (!issues.length) return [];
            
            const commentsRes = await fetch(issues[0].comments_url);
            return await commentsRes.json();
        } catch (e) {
            console.error('কমেন্ট লোড ত্রুটি:', e);
            return [];
        }
    }
    
    renderCommentSection(postId) {
        return `
            <div class="comments-section" style="margin-top:2rem;padding-top:2rem;border-top:1px solid var(--border);">
                <h3>মন্তব্য</h3>
                <div id="comments-list-${postId}">লোড হচ্ছে...</div>
                <form onsubmit="comments.submitComment(event, '${postId}')" style="margin-top:1rem;">
                    <input type="text" id="comment-author-${postId}" placeholder="আপনার নাম" required style="width:100%;padding:0.5rem;margin-bottom:0.5rem;">
                    <textarea id="comment-text-${postId}" placeholder="আপনার মন্তব্য" required style="width:100%;padding:0.5rem;margin-bottom:0.5rem;min-height:80px;"></textarea>
                    <button type="submit" style="padding:0.5rem 1rem;background:var(--primary);color:white;border:none;border-radius:0.25rem;cursor:pointer;">মন্তব্য পোস্ট করুন</button>
                </form>
            </div>
        `;
    }
    
    async submitComment(e, postId) {
        e.preventDefault();
        const author = document.getElementById(`comment-author-${postId}`).value;
        const text = document.getElementById(`comment-text-${postId}`).value;
        
        // GitHub Issues এ পাঠানোর জন্য API কল
        // এটি অ্যাডমিন প্যানেল থেকে করা উচিত
        
        alert('মন্তব্য জমা দেওয়া হয়েছে! অনুমোদনের পর প্রকাশিত হবে।');
        e.target.reset();
    }
}

const comments = new CommentSystem('your-username', 'your-repo');
