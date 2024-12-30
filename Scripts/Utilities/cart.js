import { updateCart, orderButton, updateNumber, activeItem, resetButton } from "./script.js";
import { products } from "./Scripts/data/product.js";
import {formartCurrency} from "./Scripts/Utilities/money.js";

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

export function removeFromCart(productId) {
    // Find the index of the product in the cart array
    const itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
        // Remove the item from the cart array
        cart.splice(itemIndex, 1);
        saveToStorage(); // Persist changes to local storage

        // Remove the product container from the DOM
        const container = document.querySelector(`.js-product-info-divider-${productId}`);
        if (container) {
            container.remove();
        }

        // Reset button to original state
        const button = document.querySelector(`.add-to-cart-btn[data-product-id="${productId}"]`);
        if (button) {
            resetButton(button);
            button.style.pointerEvents = 'auto';
        }

        // Update the total cart sum
        updateCartTotalSum();
        activeItem(productId,  0);

        // Display empty cart HTML if cart is now empty
        displayEmptyCart();
    }
    updateNumber();
}

function setupRemoveButtons() {
    // Attach click event listeners to all remove buttons
    document.querySelectorAll('.js-remove-cart').forEach(remove => {
        remove.addEventListener('click', (e) => {
            const productId = remove.dataset.productId;
            removeFromCart(productId);
        });
    });
}

// Initialize remove button setup
setupRemoveButtons();

export function itemsInCart() {
    
    let orderCard = document.querySelector('.confirmed-order-container');
    if (!orderCard) {
        const mainContent = document.querySelector('.cart-item-page'); 
        orderCard = document.createElement('div');
        orderCard.classList.add('confirmed-order-container');
        mainContent.appendChild(orderCard);
    }
   
    let orderSummary = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        let matchingProduct = products.find(product => product.id === productId);
        

        if (matchingProduct) {
            orderSummary += `

                    <div class="order-item-divider">
                        <div class="item-in-cart-container">         
                            <div class="item-order-from-cart">

                                <div class="ordered-item-image-container">
                                    <img src="${matchingProduct.image.thumbnail}">
                                </div>
                                <div class="item-name-info">
                                    <div>
                                        <h4 class="order-item-name">
                                            ${matchingProduct.name}
                                        </h4>
                                    </div>

                                    <div class="price-qty-container">
                                        <p class="order-qty">${cartItem.quantity}x</p>
                                        <p class="order-price">@ $${formartCurrency(matchingProduct.priceCents)}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="total-price-container">
                                <p class="order-price-qty">$${formartCurrency(matchingProduct.priceCents * cartItem.quantity)}</p>
                            </div>
                        
                        </div>
                        
                        <div>
                            <hr class="order-divider">
                        </div>
                    </div>
            `;
        }
        
    });

    const newOrderButton = `
        <img class="check-icon" src="assets/images/icon-order-confirmed.svg">
        <div class="confirmed-order-header">
            <h1>Order Confirmed</h1>
            <p>We hope you enjoy your food!</p>
        </div>

        <div class="order-wrapper">
            <div class="item-wrapper">
                ${orderSummary}
            </div>
            <div class="total-order">
                <p class="order-label">
                    Order Total
                </p>
                <p class="cart-total">
                    $${totalCartSum.toFixed(2)}
                </p>
            </div>
        </div>

        <button class="new-order-cta">
            Start New Order
        </button>
        `;

    orderCard.innerHTML = newOrderButton;

    orderButton();  
}

let totalCartSum =  0;

export function updateCartTotalSum() {
    // Reset the total sum before recalculating
    totalCartSum = 0;

    // Iterate through all items in the cart to sum their totals
    cart.forEach(cartItem => {
        const matchingProduct = products.find(product => product.id === cartItem.productId);
        if (matchingProduct) {
            const itemTotal = (matchingProduct.priceCents * cartItem.quantity) / 100;
            totalCartSum += itemTotal;
        }
    });

    // Display the total sum on the page
    const cartTotalElement = document.querySelector('.cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${totalCartSum.toFixed(2)}`;
    }
}
