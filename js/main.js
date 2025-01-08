// 打字机效果
document.addEventListener('DOMContentLoaded', () => {
    const typedElement = document.querySelector('.typed-text');
    if (!typedElement) return;

    const text = typedElement.getAttribute('data-text');
    let index = 0;

    function typeText() {
        if (index < text.length) {
            typedElement.textContent = text.slice(0, index + 1);
            index++;
            setTimeout(typeText, 100);
        }
    }

    typeText();
});

// 滚动监听
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

// 处理微信二维码弹窗
document.addEventListener('DOMContentLoaded', () => {
    const wechatLinks = document.querySelectorAll('.wechat-link');
    const modal = document.getElementById('wechatModal');
    const closeBtn = modal.querySelector('.modal-close');

    wechatLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            // 检查图片是否加载成功
            const qrImage = modal.querySelector('.qr-code');
            qrImage.onerror = () => {
                console.error('二维码图片加载失败');
                qrImage.style.display = 'none';
            };
            qrImage.onload = () => {
                console.log('二维码图片加载成功');
                qrImage.style.display = 'block';
            };
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}); 