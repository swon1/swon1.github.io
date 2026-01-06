export function homeVisual () {
    const canvas = document.getElementById('polyCanvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // 설정값 (여기서 디자인 튜닝 가능)
    const config = {
        particleCount: 60,      // 입자 개수 (많을수록 다각형이 촘촘해짐)
        connectionDist: 150,    // 연결 거리 (이 거리 안의 입자끼리 선을 그음)
        speed: .5,             // 이동 속도
        glowColor: 'rgba(100, 255, 218, 1)', // 포인트 빛 색상 (민트색)
        lineColor: 'rgba(100, 255, 218, 0.15)' // 선 색상 (투명도 조절)
    };

    const resize = () => {
        width = canvas.width = document.getElementById('home').offsetWidth;
        height = canvas.height = document.getElementById('home').offsetHeight;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.speed; // X축 속도
            this.vy = (Math.random() - 0.5) * config.speed; // Y축 속도
            this.size = Math.random() * 2 + 1; // 입자 크기 랜덤
        }

        update() {
            // 위치 이동
            this.x += this.vx;
            this.y += this.vy;

            // 화면 밖으로 나가면 반대편에서 튕기기 (Bounce 효과)
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            // 빛나는 효과 (Glow)
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = config.glowColor;
            ctx.shadowBlur = 15; // 빛 퍼짐 정도
            ctx.shadowColor = config.glowColor;
            ctx.fill();
            ctx.shadowBlur = 0; // 성능을 위해 빛 효과 초기화
        }
    }

    const init = () => {
        resize();
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        // 모든 입자 업데이트 및 그리기
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // 다각형 연결 (Polygonal Lines)
            // 현재 입자(p)와 나머지 입자들을 비교
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // 거리가 설정값보다 가까우면 선 연결
                if (dist < config.connectionDist) {
                    ctx.beginPath();
                    ctx.strokeStyle = config.lineColor;
                    ctx.lineWidth = 1 - dist / config.connectionDist; // 거리에 따라 선 두께 조절
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
        resize();
        init(); // 리사이즈 시 입자 재배치
    });

    init();
    animate();
}