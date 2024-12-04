import { updateCart } from "./script.js";

export let cart = JSON.parse(localStorage.getItem('cart')) || [
   // { productId: 'macaron-mix-of-five', quantity: 1 },
    //{ productId: 'waffle-with-berries', quantity: 1 }
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

export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    //displayEmptyCart();
}

document.addEventListener('DOMContentLoaded', () => {
    displayEmptyCart();
});

export function addToCart(productId) {
    let currentItem = cart.find(item => item.productId === productId);
    
    if (!currentItem) {
        currentItem = {
            productId: productId,
            quantity: 1
        };
        cart.push(currentItem);
    } else {
        currentItem.quantity += 1;
    }

    //saveToStorage();
    updateCart();
    
    return currentItem.quantity;
}
