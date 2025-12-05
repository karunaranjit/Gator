document.addEventListener('DOMContentLoaded', function() {
    // Load Header
    fetch('./Header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    // Load Footer
    fetch('./Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));

    // Occasions Slider
    setTimeout(() => {
        const track = document.querySelector('.slider-track');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dots = document.querySelectorAll('.dot');
        const cards = document.querySelectorAll('.occasion-card');
        
        if (!track || !prevBtn || !nextBtn) return;
        
        const totalCards = cards.length;
        let currentIndex = 2;

        const firstClone = cards[0].cloneNode(true);
        const secondClone = cards[1].cloneNode(true);
        const lastClone = cards[totalCards - 1].cloneNode(true);
        const secondLastClone = cards[totalCards - 2].cloneNode(true);
        
        track.appendChild(firstClone);
        track.appendChild(secondClone);
        track.insertBefore(lastClone, cards[0]);
        track.insertBefore(secondLastClone, lastClone);

        const allCards = document.querySelectorAll('.occasion-card');
        const cardWidth = 320 + 32;

        currentIndex = 3;
        updateSlider(false);

        function updateSlider(transition = true) {
            if (!transition) {
                track.style.transition = 'none';
            } else {
                track.style.transition = 'transform 0.5s ease';
            }
            
            const containerWidth = document.querySelector('.slider-container').offsetWidth;
            const offset = (containerWidth / 2) - (cardWidth / 2) - (currentIndex * cardWidth);
            track.style.transform = `translateX(${offset}px)`;
            
            allCards.forEach((card, index) => {
                card.classList.remove('active');
                if (index === currentIndex) {
                    card.classList.add('active');
                }
            });

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
    }, 100);

    // Testimonials Slider
    setTimeout(() => {
        let currentTestimonial = 0;
        const testimonialTrack = document.querySelector('.testimonial-track');
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const prevTestimonialBtn = document.querySelector('.prev-testimonial');
        const nextTestimonialBtn = document.querySelector('.next-testimonial');
        const testimonialDots = document.querySelectorAll('.testimonial-dot');
        const totalTestimonials = testimonialItems.length;

        if (!testimonialTrack || totalTestimonials === 0) return;

        function updateTestimonialStack() {
            testimonialItems.forEach((item, index) => {
                item.classList.remove('active', 'next-1', 'next-2', 'prev', 'hidden');
                
                const position = (index - currentTestimonial + totalTestimonials) % totalTestimonials;
                
                if (position === 0) {
                    item.classList.add('active');
                } else if (position === 1) {
                    item.classList.add('next-1');
                } else if (position === 2) {
                    item.classList.add('next-2');
                } else if (position === totalTestimonials - 1) {
                    item.classList.add('prev');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Update dots
            testimonialDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentTestimonial);
            });
        }

        // Initial stack setup
        updateTestimonialStack();

        if (nextTestimonialBtn) {
            nextTestimonialBtn.addEventListener('click', () => {
                currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
                updateTestimonialStack();
            });
        }

        if (prevTestimonialBtn) {
            prevTestimonialBtn.addEventListener('click', () => {
                currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
                updateTestimonialStack();
            });
        }

        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                updateTestimonialStack();
            });
        });

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        let isDragging = false;

        const testimonialContainer = document.querySelector('.testimonial-slider-container');

        testimonialContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isDragging = true;
        }, { passive: true });

        testimonialContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            touchEndX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const swipeDistance = touchStartX - touchEndX;
            
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    // Swipe left - move front card to back, next card comes to front
                    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
                } else {
                    // Swipe right - bring previous card to front
                    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
                }
                updateTestimonialStack();
            }
        }, { passive: true });
    }, 100);

    // FAQ Data
    const faqData = {
        customer: {
            title: "Customer FAQs",
            questions: [
                {
                    q: "What is PhoGator?",
                    a: "PhoGator is an AI-powered platform that helps you instantly find all your event photos by uploading one selfie or entering your Photo Code."
                },
                {
                    q: "Is my selfie safe?",
                    a: "Yes. Your selfie is used only for matching and is automatically deleted once processing is completed."
                },
                {
                    q: "Do I need to create an account?",
                    a: "No. You can search and download your photos without creating an account."
                },
                {
                    q: "What is a Photo Code?",
                    a: "A Photo Code is a unique identifier provided by photographers or event organizers. It lets you access your photos instantly."
                },
                {
                    q: "The event has restricted public downloads. Can I still download my pictures?",
                    a: "Yes! Simply enter your Photo Code and you can access your pictures even if public download is turned off."
                },
                {
                    q: "Can I download HD images?",
                    a: "Yes. Photos are always available in high-quality resolution, depending on the organizer's settings."
                },
                {
                    q: "I can't find my photos. What should I do?",
                    a: "Upload a clear selfie with your face visible. If still not found, it may mean no photo of you was taken at the event."
                },
                {
                    q: "Are my downloads unlimited?",
                    a: "This depends on the event organizer's settings. Some events allow unlimited downloads, while others set limits."
                }
            ]
        },
        organizer: {
            title: "Organizer / Event Admin FAQs",
            questions: [
                {
                    q: "How do I upload event photos?",
                    a: "Organizers can upload bulk images directly through the dashboard using drag-and-drop or folder upload."
                },
                {
                    q: "Can I control who downloads photos?",
                    a: "Yes. You can choose: Public download, Photo Code–only download, Paid download (if applicable), or No download (view only)."
                },
                {
                    q: "Can I watermark my images?",
                    a: "Yes. You can apply custom watermarks automatically during upload."
                },
                {
                    q: "How many photos can I upload?",
                    a: "Unlimited. Storage depends on your subscription plan."
                },
                {
                    q: "Does PhoGator support multiple events?",
                    a: "Yes, organizers can manage multiple events, each with separate albums, individual download settings, and unique Photo Codes."
                },
                {
                    q: "Can I track user activity?",
                    a: "Yes, you can monitor total views, downloads, search counts, traffic, and storage usage."
                },
                {
                    q: "Do you offer branding options?",
                    a: "Yes. Organizers can customize logo, colors, domain, event theme, and watermarks."
                }
            ]
        },
        technical: {
            title: "Technical FAQs",
            questions: [
                {
                    q: "What file formats do you support?",
                    a: "JPG, PNG, and HEIC."
                },
                {
                    q: "Do you compress images?",
                    a: "Preview images are compressed for faster loading. Full downloads are always HD."
                },
                {
                    q: "How accurate is the face-matching?",
                    a: "Our AI is trained for high accuracy and performs best with clear selfies, front-facing images, and proper lighting."
                },
                {
                    q: "How fast is the matching?",
                    a: "Matching takes 3–10 seconds depending on event size and image count."
                },
                {
                    q: "Can I upload videos?",
                    a: "Currently no, but video frame extraction is coming soon."
                }
            ]
        },
        billing: {
            title: "Billing & Payment FAQs",
            questions: [
                {
                    q: "What payment methods are supported?",
                    a: "Esewa, Khalti, FonePay, and Stripe/International cards (optional feature)."
                },
                {
                    q: "Do customers have to pay to download photos?",
                    a: "Only if the event organizer sets paid downloads. The platform supports per-photo pricing, bundle pricing, and unlimited access pricing."
                },
                {
                    q: "Are there subscription plans for organizers?",
                    a: "Yes. Plans include: Starter (5GB - Rs. 499/month), Pro (20GB - Rs. 999/month), Event Master (50GB - Rs. 1,999/month), and Unlimited (Custom Pricing)."
                },
                {
                    q: "Do you offer refunds?",
                    a: "Refunds depend on the event organizer's refund policy—not PhoGator."
                }
            ]
        },
        privacy: {
            title: "Privacy & Security FAQs",
            questions: [
                {
                    q: "Do you store my selfie?",
                    a: "No. All selfies are deleted right after matching."
                },
                {
                    q: "Are my photos shared with others?",
                    a: "Never. Only users with your Photo Code can view your photos."
                },
                {
                    q: "How long are event photos stored?",
                    a: "Storage duration depends on the organizer's chosen plan (30 days, 90 days, or unlimited)."
                },
                {
                    q: "Are Photo Codes secure?",
                    a: "Yes. Codes are randomly generated and encrypted."
                },
                {
                    q: "Can I request deletion of my photos?",
                    a: "Yes. Submit a request with your Photo Code and your photos will be permanently deleted."
                }
            ]
        }
    };

    // FAQ Accordion and Tab functionality
    setTimeout(() => {
        const faqPanel = document.querySelector('.faq-panel');
        
        function renderFAQs(category) {
            const data = faqData[category];
            let html = `<h3>${data.title}</h3>`;
            
            data.questions.forEach((item, index) => {
                html += `
                    <div class="faq-item">
                        <div class="faq-question">
                            <span>${index + 1}. ${item.q}</span>
                            <i class="fa-solid fa-chevron-down"></i>
                        </div>
                        <div class="faq-answer">
                            <p>${item.a}</p>
                        </div>
                    </div>
                `;
            });
            
            faqPanel.innerHTML = html;
            
            // Re-attach click events
            document.querySelectorAll('.faq-question').forEach(question => {
                question.addEventListener('click', () => {
                    const faqItem = question.parentElement;
                    const isActive = faqItem.classList.contains('active');
                    
                    document.querySelectorAll('.faq-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    if (!isActive) {
                        faqItem.classList.add('active');
                    }
                });
            });
        }

        // Initial render
        renderFAQs('customer');

        // Tab switching
        document.querySelectorAll('.faq-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const category = tab.dataset.category;
                renderFAQs(category);
            });
        });
    }, 100);
});