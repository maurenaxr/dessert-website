// ================= 1. ФИЛЬТР КАТЕГОРИЙ =================
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterValue = btn.getAttribute('data-filter');

        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ================= 2. ПОИСК ТОВАРОВ =================
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    productCards.forEach(card => {
        const titleElement = card.querySelector('.product-title');
        const titleText = titleElement.textContent.toLowerCase();
        if (titleText.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    filterBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');
}

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', performSearch);
}

// ================= 3. ВСПЛЫВАЮЩЕЕ ОКНО "CONTACT" =================
const contactLink = document.getElementById('contact-link');
const contactModal = document.getElementById('contact-modal');
const closeBtn = document.querySelector('.close-btn');

if (contactLink && contactModal && closeBtn) {
    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.add('show');
    });
    closeBtn.addEventListener('click', () => {
        contactModal.classList.remove('show');
    });
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('show');
        }
    });
}

// ================= 4. ИЗБРАННОЕ (СЕРДЕЧКИ) =================
const heartBtns = document.querySelectorAll('.heart-btn');
heartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.textContent === '♡') {
            btn.textContent = '♥';
            btn.style.color = 'var(--berry-brown)';
        } else {
            btn.textContent = '♡';
            btn.style.color = 'var(--almond-cream)';
        }
    });
});

// ================= 5. УПРАВЛЕНИЕ КОЛИЧЕСТВОМ (+ / -) НА ГЛАВНОЙ =================
const minusBtns = document.querySelectorAll('.qty-btn.minus');
const plusBtns = document.querySelectorAll('.qty-btn.plus');

minusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const qtySpan = btn.nextElementSibling;
        let currentQty = parseInt(qtySpan.textContent);
        if (currentQty > 1) {
            qtySpan.textContent = currentQty - 1;
        }
    });
});

plusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const qtySpan = btn.previousElementSibling;
        let currentQty = parseInt(qtySpan.textContent);
        qtySpan.textContent = currentQty + 1;
    });
});

// ================= 6. ДОБАВЛЕНИЕ В КОРЗИНУ (localStorage) =================
// Берем корзину из памяти браузера
let cart = JSON.parse(localStorage.getItem('bakeryCart')) || [];
const headerCartBtn = document.querySelector('.cart-btn');

// Обновляем цифру на кнопке корзины в шапке
function updateCartUI() {
    if (!headerCartBtn) return;
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    headerCartBtn.textContent = ` Cart (${totalItems})`;
}

// Запускаем при открытии страницы
updateCartUI();

const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        const qtySpan = btn.closest('.card-actions').querySelector('.qty');
        const quantity = parseInt(qtySpan.textContent);

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name: name, price: price, quantity: quantity });
        }

        // Сохраняем в память
        localStorage.setItem('bakeryCart', JSON.stringify(cart));

        // Эффект галочки на кнопке
        const originalIcon = btn.textContent;
        btn.textContent = '✔️';
        setTimeout(() => {
            btn.textContent = originalIcon;
            qtySpan.textContent = '1'; // Сбрасываем счетчик обратно на 1
        }, 1000);

        updateCartUI();
    });
});


// ================= 7. МОБИЛЬНОЕ МЕНЮ (БУРГЕР) =================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileMenuBtn && mainNav) {
    // Открытие/закрытие меню при клике на бургер
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('show');
        
        // Если меню открыто, меняем иконку на крестик, иначе обратно на бургер
        if (mainNav.classList.contains('show')) {
            mobileMenuBtn.textContent = '✕';
        } else {
            mobileMenuBtn.textContent = '☰';
        }
    });

    // Автоматическое закрытие меню при клике на любую ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('show');
            mobileMenuBtn.textContent = '☰';
        });
    });
}