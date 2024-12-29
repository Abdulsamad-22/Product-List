import { products } from "./product.js";
import { updateNumber } from "../script.js";
import { displayEmptyCart } from "../cart.js";


export function setupConfirmButton() {
    const confirmButton = document.querySelector('.confirm-cta');

    // Ensure the button exists
    if (confirmButton) { 
        confirmButton.addEventListener('click', () => {
            console.log('Order confirmed!');
            itemsInCart();
            document.querySelector('.overlay').style.display = 'block';
        });
    }
}

function itemsInCart() {
    
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
        

        console.log(matchingProduct);
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
                <p>
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
    //orderSummary += newOrderButton;
    //const orderCard = document.querySelector(".confirmed-order-container");

    orderCard.innerHTML = newOrderButton;

    orderButton();  
}

let totalCartSum = 0;

function updateCartTotalSum() {
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

function orderButton() {
    const button = document.querySelector('.new-order-cta');

    const orderCard = document.querySelector(".confirmed-order-container");

    if (orderCard) { // Ensure the button exists
        button.addEventListener('click', () => {
            orderCard.innerHTML = '';
            orderCard.remove();
            document.querySelector('.overlay').style.display = 'none';
            console.log('Start new order!');

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
        button.innerHTML = '';
        button.classList.remove('new-button');

        // Recreate the button content
        const img = document.createElement('img');
        img.src = 'assets/images/icon-add-to-cart.svg';
        img.classList.add('cart-icon');
        button.appendChild(img);
        button.appendChild(document.createTextNode('Add to Cart'));
    });

    const orderCard = document.querySelector('.confirmed-order-container');
    if (orderCard) {
        orderCard.remove();
    }

    // Display the empty cart
    displayEmptyCart();
    updateNumber();  
}

