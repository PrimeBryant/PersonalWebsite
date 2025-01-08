class Carousel {
    constructor() {
        this.container = document.querySelector('.carousel-inner');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');
        this.indicators = document.querySelector('.carousel-indicators');
        
        this.images = [
            {
                url: './images/badminton-1.jpg',
                alt: '羽毛球比赛瞬间'
            },
            {
                url: './images/programming-1.jpg',
                alt: '专注编程'
            },
            {
                url: './images/badminton-2.jpg',
                alt: '羽毛球训练'
            },
            {
                url: './images/programming-2.jpg',
                alt: '代码调试'
            }
        ];
        
        this.currentIndex = 0;
        this.autoPlayTimer = null;
        
        this.init();
    }

    init() {
        // 创建图片元素
        this.images.forEach(image => {
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = image.alt;
            this.container.appendChild(img);
        });

        // 添加指示器
        this.images.forEach((image, index) => {
            const indicator = document.createElement('span');
            indicator.classList.add('indicator');
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicators.appendChild(indicator);
        });

        // 绑定事件
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // 鼠标悬停暂停
        this.container.addEventListener('mouseenter', () => this.pause());
        this.container.addEventListener('mouseleave', () => this.play());

        this.updateSlide();
        this.play();

        // 添加触摸事件支持
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            this.pause();
        });

        this.container.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchend', () => {
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            this.play();
        });
    }

    updateSlide() {
        // 添加平滑过渡
        this.container.style.transition = 'transform 0.5s ease';
        this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // 更新指示器
        const indicators = this.indicators.children;
        Array.from(indicators).forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlide();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlide();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
    }

    play() {
        this.autoPlayTimer = setInterval(() => this.next(), 3000);
    }

    pause() {
        clearInterval(this.autoPlayTimer);
    }
}

// 初始化轮播图
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
}); 