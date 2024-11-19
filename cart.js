//import { product } from "./product.js";

export let cart = JSON.parse(localStorage.getItem('cart')) || [
    { productId: 'macaron-mix-of-five', quantity: 1 },
    { productId: 'waffle-with-berries', quantity: 1 }
];

// Save to local storage if cart is newly initialized
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Empty cart HTML structure
const emptyCartHTML = `
    
    <div class="empty-cart-container">
        <div>
            <img class="empty-cart-image" src="assets/images/illustration-empty-cart.svg" alt="empty cart image">
        </div>
        <p>Your added items will appear here</p>
    </div>
`;

// Function to display empty cart message if the cart is empty
export function displayEmptyCart() {
    const cartContainer = document.querySelector('.total-container');

    // Check if the cart is empty
    if (cart.length === 0) {
        cartContainer.innerHTML = emptyCartHTML;
    }
}

/*
<h2 class="cart-number">
        Your Cart(0)
    </h2>
if (!cart || cart.length === 0) {
    const emptyCartHTML = 
    `
        <h2 class="cart-number">
            Your Cart(0)
            </h2>

            <div class="empty-cart-container">
            <div>
                <img class="empty-cart-image" src="assets/images/illustration-empty-cart.svg" alt="empty cart image">
            </div>
        
            <p>
                Your added items will appear here
            </p>
            </div>
        `;
    document.querySelector('.cart-card').innerHTML = emptyCartHTML;
    return;
}
*/
export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    displayEmptyCart();
}

document.addEventListener('DOMContentLoaded', () => {
    displayEmptyCart();
});
/*
export function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
        
        // Update any existing counter buttons
        cartButtons.forEach(button => {
            const productId = button.dataset.productId;
            const currentItem = cart.find(item => item.productId === productId);
            if (currentItem && currentItem.quantity > 0) {
                cartCounter(button, productId);
            }
        });
    }
}
*/
/*
export function addToCart (productId) {
    let matchingItem = cart.find(cartItem => cartItem.productId === productId);

        if (matchingItem) {
            matchingItem.quantity += 1;
            console.log(matchingItem);
        } else {
            cart.push({
                productId: productId,
                quantity: 1
            });
            console.log(matchingItem);
        }
    saveToStorage();
    return matchingItem ? matchingItem.quantity : 1;
}
*/
/*
export function removeFromCart(productId) {
    const newCart = [];

    cart.forEach(cartItem => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;

    saveToStorage();
}

*/
