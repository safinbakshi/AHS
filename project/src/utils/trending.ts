export async function updateTrendingNews() {
  try {
    const response = await fetch('/api/trending');
    const articles = await response.json();
    
    const trendingList = document.getElementById('trendingList');
    if (!trendingList) return;

    // Animate out old items
    trendingList.style.opacity = '0';
    
    setTimeout(() => {
      // Update content
      trendingList.innerHTML = articles.map(article => `
        <li class="trending-item">
          <a href="/news/${article.slug}">
            <span class="trending-title">${article.title}</span>
            <span class="trending-source">${article.source}</span>
          </a>
        </li>
      `).join('');
      
      // Animate in new items
      trendingList.style.opacity = '1';
    }, 300);
  } catch (error) {
    console.error('Error updating trending news:', error);
  }
}