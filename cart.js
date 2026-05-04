// Достаем корзину из памяти браузера
let cart = JSON.parse(localStorage.getItem('bakeryCart')) || [];
const cartItemsContainer = document.getElementById('cart-items-container');

function renderCart() {
    cartItemsContainer.innerHTML = ''; 
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: #666; padding: 20px 0;">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const row = document.createElement('div');
            row.className = 'cart-item-row';
            
            row.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-title">${item.name}</span>
                </div>
                <div class="cart-item-price">${item.price} ₸</div>
                <div class="quantity-control" style="width: fit-content;">
                    <button class="qty-btn minus" onclick="changeCartQty(${index}, -1)">-</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="qty-btn plus" onclick="changeCartQty(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">${itemTotal} ₸</div>
                <button class="delete-btn" onclick="removeFromCart(${index})">🗑️</button>
            `;
            cartItemsContainer.appendChild(row);
        });
    }

    const deliveryFee = (subtotal >= 10000 || subtotal === 0) ? 0 : 1000;
    const total = subtotal + deliveryFee;

    document.getElementById('summary-subtotal').textContent = `${subtotal} ₸`;
    document.getElementById('summary-delivery').textContent = `${deliveryFee} ₸`;
    document.getElementById('summary-total').textContent = `${total} ₸`;
}

// Изменение количества внутри страницы корзины
window.changeCartQty = function(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1; 
    
    // Пересохраняем изменения в память
    localStorage.setItem('bakeryCart', JSON.stringify(cart));
    renderCart(); 
};

// Удаление товара из корзины
window.removeFromCart = function(index) {
    cart.splice(index, 1); 
    
    // Пересохраняем изменения в память
    localStorage.setItem('bakeryCart', JSON.stringify(cart));
    renderCart(); 
};

// При загрузке страницы сразу рисуем корзину
renderCart();




// ================= Оформление заказа и Валидация =================
const checkoutBtn = document.querySelector('.checkout-btn');

// Фишка для номера карты: автоматические пробелы
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function (e) {
        // Удаляем все не-цифры и ставим пробел после каждых 4 цифр
        this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    });
}

// Фишка для даты: автоматический слэш (MM/YY)
const cardExpInput = document.getElementById('cardExp');
if (cardExpInput) {
    cardExpInput.addEventListener('input', function (e) {
        this.value = this.value.replace(/\D/g, '').replace(/^(\d{2})/, '$1/').trim();
    });
}

checkoutBtn.addEventListener('click', () => {
    // Данные доставки
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const address = document.getElementById('userAddress').value.trim();
    
    // Данные карты
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardExp = document.getElementById('cardExp').value.trim();
    const cardCVV = document.getElementById('cardCVV').value.trim();

    // Проверка 1: Пустая ли корзина?
    if (cart.length === 0) {
        alert('Your cart is empty! Please add some desserts first. ');
        return;
    }

    // Проверка 2: Заполнены ли данные доставки?
    if (!name || !phone || !address) {
        alert('Please fill in your Delivery Details (Name, Phone, Address).');
        return;
    }

    // Проверка 3: Заполнена ли карта?
    if (!cardName || cardNumber.length < 19 || cardExp.length < 5 || cardCVV.length < 3) {
        alert('Please fill in valid Card Details to proceed with payment.');
        return;
    }

    // Успех!
    alert(`Payment successful! \nThank you for your order, ${name}. Your desserts are on the way!`);
    
    // Очищаем корзину
    cart = [];
    localStorage.removeItem('bakeryCart'); 
    
    // Очищаем все поля
    document.getElementById('userName').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('userAddress').value = '';
    document.getElementById('userComments').value = '';
    document.getElementById('cardName').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('cardExp').value = '';
    document.getElementById('cardCVV').value = '';

    renderCart();
});