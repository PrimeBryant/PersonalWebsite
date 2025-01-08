class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        
        // 从 localStorage 获取保存的主题
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }

    init() {
        // 应用保存的主题
        this.applyTheme(this.currentTheme);
        
        // 添加切换事件监听
        this.themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme(this.currentTheme);
            
            // 保存主题设置
            localStorage.setItem('theme', this.currentTheme);
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // 更新图标
        this.themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        
        // 更新按钮标题
        this.themeToggle.title = `切换到${theme === 'dark' ? '亮色' : '暗色'}主题`;
    }
}

// 初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
}); 