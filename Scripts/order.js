import { itemsInCart } from "./scripts/cart.js";
import { displayEmptyCart } from "./scripts/cart.js";
import { updateNumber } from "./script.js";
import { cart } from "./scripts/cart.js";
import { resetButton } from "./script.js";

export function setupConfirmButton() {
    const confirmButton = document.querySelector('.confirm-cta');

    // Ensure the button exists
    if (confirmButton) { 
        confirmButton.addEventListener('click', () => {
            itemsInCart();
            document.querySelector('.overlay').style.display = 'block';
        });
    }
}

export function orderButton() {
    const button = document.querySelector('.new-order-cta');

    const orderCard = document.querySelector(".confirmed-order-container");

    if (orderCard) { // Ensure the button exists
        button.addEventListener('click', () => {
            orderCard.innerHTML = '';
            orderCard.remove();
            document.querySelector('.overlay').style.display = 'none';

            startNewOrder();
        });
    } 
}

// Function to handle "Start New Order"
function startNewOrder() {
    // Clear the cart array
    cart.length = 0;
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage

    // Reset all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        resetButton(button);
        button.style.pointerEvents = 'auto';
    });

    document.querySelectorAll('.product-image').forEach(container => {
        container.classList.remove('active');
    });

    const orderCard = document.querySelector('.confirmed-order-container');
    if (orderCard) {
        orderCard.remove();
    }

    // Display the empty cart
    displayEmptyCart();
    updateNumber();
}