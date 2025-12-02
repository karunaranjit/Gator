/* filepath: c:\Users\luffy\OneDrive\Desktop\intern\Gator\JS\script.js */

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    const cards = document.querySelectorAll('.occasion-card');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const totalCards = cards.length;
    let currentIndex = 2; // Start with Wedding in center (index 2)

    // Clone cards for infinite loop
    const firstClone = cards[0].cloneNode(true);
    const secondClone = cards[1].cloneNode(true);
    const lastClone = cards[totalCards - 1].cloneNode(true);
    const secondLastClone = cards[totalCards - 2].cloneNode(true);
    
    track.appendChild(firstClone);
    track.appendChild(secondClone);
    track.insertBefore(lastClone, cards[0]);
    track.insertBefore(secondLastClone, lastClone);

    const allCards = document.querySelectorAll('.occasion-card');
    const cardWidth = 320 + 32; // card width + gap

    // Set initial position to show Wedding in center
    currentIndex = 3; // Adjusted for cloned cards
    updateSlider(false);

    function updateSlider(transition = true) {
        if (!transition) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s ease';
        }
        
        // Calculate offset to center the active card
        const containerWidth = document.querySelector('.slider-container').offsetWidth;
        const offset = (containerWidth / 2) - (cardWidth / 2) - (currentIndex * cardWidth);
        track.style.transform = `translateX(${offset}px)`;
        
        // Update active class
        allCards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentIndex) {
                card.classList.add('active');
            }
        });

        // Update dots (only for original cards, not clones)
        const actualIndex = ((currentIndex - 2) % totalCards + totalCards) % totalCards;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === actualIndex);
        });
    }

    function handleTransitionEnd() {
        if (currentIndex <= 1) {
            currentIndex = totalCards + 1;
            updateSlider(false);
        } else if (currentIndex >= totalCards + 2) {
            currentIndex = 2;
            updateSlider(false);
        }
    }

    track.addEventListener('transitionend', handleTransitionEnd);

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateSlider(true);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateSlider(true);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index + 2;
            updateSlider(true);
        });
    });
});