const chars = ['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х'];
const slots = document.querySelectorAll('.slot');
const btn = document.getElementById('spinBtn');
const regSelect = document.getElementById('regionSelect');
const speedSelect = document.getElementById('speedSelect');
const customReg = document.getElementById('customRegion');
const regDisplay = document.getElementById('regDisplay');

// В начале файла убедись, что высота совпадает с CSS
const itemHeight = 120; 

// При инициализации лент (внутри slots.forEach)
slots.forEach(slot => {
    const type = slot.dataset.type;
    const strip = document.createElement('div');
    strip.className = 'strip';
    
    // Генерируем элементы
    for (let i = 0; i < 60; i++) {
        const item = document.createElement('div');
        item.className = 'item';
        // Важно: явно задаем высоту через JS для гарантии
        item.style.height = `${itemHeight}px`; 
        item.innerText = (type === 'char') ? chars[Math.floor(Math.random() * chars.length)] : Math.floor(Math.random() * 10);
        strip.appendChild(item);
    }
    slot.appendChild(strip);
});

async function spin() {
    btn.disabled = true;
    
    const isInstant = speedSelect.value === 'instant';
    const finalRegion = regSelect.value === 'custom' ? customReg.value : regSelect.value;
    regDisplay.innerText = finalRegion || "00";

    const promises = Array.from(slots).map((slot, index) => {
        return new Promise(resolve => {
            const strip = slot.querySelector('.strip');
            
            // Выбираем случайный индекс (от 45 до 55), чтобы анимация была длинной
            const finalIndex = 45 + Math.floor(Math.random() * 10); 
            // Точный расчет смещения
            const offset = finalIndex * itemHeight;

            strip.style.transition = 'none';
            strip.style.transform = 'translateY(0)';

            const duration = isInstant ? 0.1 : (2 + index * 0.15);
            const easing = isInstant ? 'linear' : 'cubic-bezier(0.15, 0, 0.05, 1)';

            // Небольшая задержка перед стартом для сброса позиции
            setTimeout(() => {
                strip.style.transition = `transform ${duration}s ${easing}`;
                strip.style.transform = `translateY(-${offset}px)`;
                setTimeout(resolve, duration * 1000);
            }, 20);
        });
    });

    await Promise.all(promises);
    btn.disabled = false;
}
btn.addEventListener('click', spin);