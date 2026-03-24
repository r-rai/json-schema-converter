// Search Modal Management
class SearchModal {
  constructor() {
    this.modal = document.getElementById('search-modal');
    this.input = document.getElementById('search-input');
    this.results = document.getElementById('search-results');
    this.searchBtn = document.getElementById('search-btn');
    
    // Tool database
    this.tools = [
      {
        id: 'json-schema',
        name: 'JSON Schema Validator',
        description: 'Generate JSON schemas, validate data, format JSON',
        icon: 'data_object',
        url: '/tools/json-schema/'
      },
      {
        id: 'html-markdown',
        name: 'HTML ↔ Markdown Converter',
        description: 'Convert between HTML and Markdown formats bidirectionally',
        icon: 'code_blocks',
        url: '/tools/html-markdown/'
      },
      {
        id: 'text-diff',
        name: 'Text Diff Checker',
        description: 'Compare two texts and see differences highlighted',
        icon: 'difference',
        url: '/tools/text-diff/'
      },
      {
        id: 'sip-calculator',
        name: 'SIP Calculator',
        description: 'Calculate systematic investment plan returns with visualization',
        icon: 'trending_up',
        url: '/tools/sip-calculator/'
      },
      {
        id: 'emi-calculator',
        name: 'EMI Calculator',
        description: 'Calculate equated monthly installments with amortization schedule',
        icon: 'account_balance',
        url: '/tools/emi-calculator/'
      }
    ];
    
    this.selectedIndex = 0;
    
    this.init();
  }
  
  init() {
    if (!this.modal || !this.searchBtn) return;
    
    // Open modal on button click
    this.searchBtn.addEventListener('click', () => this.open());
    
    // Close modal
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    
    // Search input
    this.input.addEventListener('input', () => this.handleSearch());
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
      // "/" key (if not in input/textarea)
      else if (e.key === '/' && !this.isTyping(e.target)) {
        e.preventDefault();
        this.open();
      }
      // ESC key
      else if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.close();
      }
    });
    
    // Initial render
    this.renderResults(this.tools);
  }
  
  isTyping(element) {
    return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
  }
  
  open() {
    this.modal.classList.remove('hidden');
    this.input.value = '';
    this.input.focus();
    this.selectedIndex = 0;
    this.renderResults(this.tools);
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.modal.classList.add('hidden');
    this.input.value = '';
    document.body.style.overflow = '';
    this.searchBtn.focus();
  }
  
  handleSearch() {
    const query = this.input.value.toLowerCase().trim();
    
    if (!query) {
      this.renderResults(this.tools);
      return;
    }
    
    const filtered = this.tools.filter(tool => {
      return tool.name.toLowerCase().includes(query) ||
             tool.description.toLowerCase().includes(query) ||
             tool.id.toLowerCase().includes(query);
    });
    
    this.selectedIndex = 0;
    this.renderResults(filtered);
  }
  
  renderResults(tools) {
    if (tools.length === 0) {
      this.results.innerHTML = `
        <div class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-muted-light dark:text-muted-dark mb-4">search_off</span>
          <p class="text-muted-light dark:text-muted-dark">No tools found</p>
        </div>
      `;
      return;
    }
    
    this.results.innerHTML = tools.map((tool, index) => `
      <a 
        href="${tool.url}" 
        class="flex items-start gap-4 p-4 rounded-lg hover:bg-bg-light dark:hover:bg-bg-dark transition-colors cursor-pointer ${index === this.selectedIndex ? 'bg-bg-light dark:bg-bg-dark' : ''}"
        data-index="${index}"
      >
        <span class="material-symbols-outlined text-4xl text-primary-light dark:text-primary-dark flex-shrink-0">${tool.icon}</span>
        <div class="flex-1 min-w-0">
          <h3 class="font-heading text-lg text-text-light dark:text-text-dark mb-1">${tool.name}</h3>
          <p class="text-sm text-muted-light dark:text-muted-dark">${tool.description}</p>
        </div>
        <span class="material-symbols-outlined text-muted-light dark:text-muted-dark flex-shrink-0">arrow_forward</span>
      </a>
    `).join('');
  }
  
  handleKeydown(e) {
    const results = this.results.querySelectorAll('a');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % results.length;
      this.updateSelection(results);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + results.length) % results.length;
      this.updateSelection(results);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[this.selectedIndex]) {
        results[this.selectedIndex].click();
      }
    }
  }
  
  updateSelection(results) {
    results.forEach((result, index) => {
      if (index === this.selectedIndex) {
        result.classList.add('bg-bg-light', 'dark:bg-bg-dark');
        result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        result.classList.remove('bg-bg-light', 'dark:bg-bg-dark');
      }
    });
  }
}

// Initialize search modal when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SearchModal();
  });
} else {
  new SearchModal();
}
