import { cart, displayEmptyCart, addToCart, itemsInCart, updateCartTotalSum } from "./cart.js";
import { removeFromCart } from "./cart.js";
import { products } from "./Scripts/data/product.js";
import { saveToStorage } from "./cart.js";
import {formartCurrency} from "./Scripts/Utilities/money.js";

let productHtml = '';

products.forEach(product => {
    productHtml += `
        <div class="product-container">
                <div class="image-container">
                <img class="product-image" src="${product.image.desktop}"  data-product-id="${product.id}">
    
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    <img class="cart-icon" src="assets/images/icon-add-to-cart.svg" alt="cart icon">Add to Cart
                </button>
                </div>
        
                <div class="product-description">
                <p class="product-category">
                    ${product.category}
                </p>
        
                <p class="product-name">
                    ${product.name}
                </p>
        
                <p class="product-price">
                    $${formartCurrency(product.priceCents)}
                </p>
                </div>
            </div>
    `;
    
});

document.querySelector('.js-products-grid').innerHTML = productHtml;


let cartNumber = document.querySelector('.cart-number');

export function updateNumber() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });

    cartNumber.innerHTML = `Your Cart(${cartQuantity})`;
}

export function activeItem(productId, quantity) {
    const imageContainer = document.querySelector(`.product-image[data-product-id="${productId}"]`);
    
    if (imageContainer) {
        if (quantity > 0) {
            // Add stroke if quantity is greater than 0
            imageContainer.classList.add('active');
        } else {
            // Remove stroke if quantity is 0 or item is removed
            imageContainer.classList.remove('active');
        }
    }
}

const cartButton = document.querySelectorAll('.add-to-cart-btn');

cartButton.forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;

        if (button.querySelector('img') || button.innerText === 'Add to Cart') {
            addToCart(productId);
            cartCounter(button, productId);
            updateNumber();
        }
    });
});


export function updateCart() {

    let cartSummaryHtml = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        let matchingProduct = products.find(product => product.id === productId);
        

        if (matchingProduct) {

                cartSummaryHtml += `

                <div class="product-info-divider  js-product-info-divider-${matchingProduct.id}">
                    <div class="product-name-price">

                    <div class="product-details-cart">
                        <p class="product-cart-name">
                        ${matchingProduct.name}
                        </p>
                
                        <div class="price-cart-grid" data-product-id="${cartItem.productId}">
                            <p class="product-quantity">
                                ${cartItem.quantity}x
                            </p>

                            <div class="price-and-total">
                                <p class="product-cart-price">
                                    @ $${formartCurrency(matchingProduct.priceCents)}
                                </p>
                            
                                <p class="product-total-price">
                                    $${formartCurrency(matchingProduct.priceCents * cartItem.quantity)}
                                </p>
                            </div>
                        </div>
                    </div>
            
                    <span class="remove-cart-container">
                        <img class="remove-cart js-remove-cart" src="assets/images/icon-remove-item.svg" alt="delete cart icon" data-product-id="${matchingProduct.id}">
                    </span>
            
                    </div>
                    <hr class="divider">
                </div>
                `;
        }
    });

    const orderTotalBlockExists = document.querySelector('.total-order');

            if (orderTotalBlockExists) {
                orderTotalBlockExists.remove();
            }

            if (cart.length > 0) {

                const orderTotalHtml = `
                    <div class="total-order">
                        <p class="order-label">Order Total</p>
                        <p class="cart-total">$0.00</p>
                    </div>
                    <div class="carbon-neutral-container">
                        <img src="assets/images/icon-carbon-neutral.svg" alt="">
                        <p>This is a <strong>carbon-neutral</strong> delivery</p>
                    </div>
                    <button class="confirm-cta">Confirm Order</button>`;

                cartSummaryHtml += orderTotalHtml;
            }

            const isTotalContainerAvailable =
            document.querySelector(".total-container");
    
        if (isTotalContainerAvailable) {
            isTotalContainerAvailable.innerHTML = cartSummaryHtml;
        }

    document.querySelectorAll('.js-remove-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            removeFromCart(productId);
        });
    });
    setupConfirmButton();
    updateCartTotalSum();
}

function cartCounter(button, productId) {
    button.innerHTML = '';
    button.classList.add('new-button');

    // Disable interaction on the entire button
    button.style.pointerEvents = 'none'; // Prevent all interaction
    button.style.position = 'absolute'; // Needed to adjust child elements

    // Create minus icon
    const minusIcon = document.createElement('span');
    minusIcon.classList.add('icon');
    const minusImg = document.createElement('img');
    minusImg.src = 'assets/images/icon-decrement-quantity.svg';
    minusImg.alt = 'Minus icon';
    minusImg.classList.add('minus-icon-image');
    minusImg.style.pointerEvents = 'auto'; // Re-enable interaction for the icon

    // Create cart count display
    const cartCountDisplay = document.createElement('span');
    cartCountDisplay.classList.add('cart');

    
    // Set initial count to 1 if this is the first click
    const isFirstClick = button.querySelector('img') || button.innerText === 'Add to Cart';
    const currentItem = cart.find(item => item.productId === productId);
    
    if (isFirstClick) {
        const newItem = { productId, quantity: 1 };
        cart.push(newItem);
        cartCountDisplay.innerText = 1;

       activeItem(productId, 1);
        updatePriceCartGrid(productId, 1);
    } else {
        cartCountDisplay.innerText = currentItem ? currentItem.quantity : 0;
        activeItem(productId, currentItem ? currentItem.quantity : 0);
    }

    // Create plus icon
    const plusIcon = document.createElement('span');
    plusIcon.classList.add('icon');
    const plusImg = document.createElement('img');
    plusImg.src = 'assets/images/icon-increment-quantity.svg';
    plusImg.alt = 'Plus icon';
    plusImg.classList.add('plus-icon-image');
    plusImg.style.pointerEvents = 'auto'; // Re-enable interaction for the icon

    // Append all elements to button
    button.appendChild(minusImg);
    button.appendChild(cartCountDisplay);
    button.appendChild(plusImg);

    // Re-enable interaction for icons only
    minusImg.style.pointerEvents = 'auto';
    plusImg.style.pointerEvents = 'auto';


    // Function to update price-cart-grid for specific item
    function updatePriceCartGrid(productId, quantity) {
        const matchingProduct = products.find(product => product.id === productId);
        if (!matchingProduct) return;

        const priceCartGrid = document.querySelector(`.price-cart-grid[data-product-id="${productId}"]`);
        if (priceCartGrid) {
            const quantityElement = priceCartGrid.querySelector('.product-quantity');
            const totalPriceElement = priceCartGrid.querySelector('.product-total-price');

            if (quantityElement) {
                quantityElement.textContent = `${quantity}x`;
            }
            if (totalPriceElement) {
                const newTotal = `${formartCurrency(matchingProduct.priceCents * quantity)}`;
                totalPriceElement.textContent = `$${newTotal}`;
            }
        }

        updateCartTotalSum();
    }

    // Plus button click handler
    plusImg.addEventListener('click', (e) => {
        e.stopPropagation();
        let currentItem = cart.find(item => item.productId === productId);
        
        if (!currentItem) {
            currentItem = { productId, quantity: 0 };
            cart.push(currentItem);
        }

        currentItem.quantity += 1;
        cartCountDisplay.innerText = currentItem.quantity;
        activeItem(productId, currentItem.quantity);
        updatePriceCartGrid(productId, currentItem.quantity);
        
        saveToStorage();
        updateNumber();
    });

    // Minus button click handler
    minusImg.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentItem = cart.find(item => item.productId === productId);
        
        if (currentItem && currentItem.quantity > 0) {
            currentItem.quantity -= 1;
            cartCountDisplay.innerText = currentItem.quantity;
            activeItem(productId, currentItem.quantity);
            updatePriceCartGrid(productId, currentItem.quantity);

            if (currentItem.quantity === 0) {
                // Remove item from cart
                const itemIndex = cart.findIndex(item => item.productId === productId);
                if (itemIndex > -1) {
                    cart.splice(itemIndex, 1);
                }

                const container = document.querySelector(`.js-product-info-divider-${productId}`);
                if (container) {
                    container.remove();
                }

                resetButton(button);
            }

            //saveToStorage();
            updateNumber();
            displayEmptyCart();
        }
    });

}


export function resetButton(button) {
    // Reset the button to its default state
    button.innerHTML = '';
    button.classList.remove('new-button');
    button.style.pointerEvents = 'auto'; // Enable interaction for the button

    const img = document.createElement('img');
    img.src = 'assets/images/icon-add-to-cart.svg';
    img.classList.add('cart-icon');
    button.appendChild(img);
    button.appendChild(document.createTextNode('Add to Cart'));
}


function setupConfirmButton() {
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


function resizeWindow() {
    //const screenWidth = window.innerWidth;

    products.forEach(product => {
        const imageElement = document.querySelector(`.product-image[data-product-id="${product.id}"]`);

        if (window.innerWidth <= 600) {
            // Add check to ensure image element exists
            if (imageElement) {
                imageElement.src = product.image.mobile;
                console.log('Changed to mobile background');
            }
        } else {
            if (imageElement) {
                imageElement.src = product.image.desktop;
                console.log('Changed to desktop background');
            }
        }
    });
}

let resizeTimer;
resizeWindow(); // Run on initial load
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeWindow, 250); // Debounce
});

// Check if image element exists before adding event listener
/*if (imageElement) {
    // Run on initial load
    resizeWindow();
    
    // Add debounced resize listener to prevent excessive function calls
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeWindow, 250); // Wait 250ms after last resize event
    });
} else {
    console.error('Background image element not found');
}


// Optional: Add load event listener to ensure image loads properly
imageElement?.addEventListener('load', () => {
    console.log('Background image loaded successfully');
});

// Optional: Add error handling for image loading
imageElement?.addEventListener('error', () => {
    console.error('Failed to load background image');
});


//window.addEventListener('resize', updateProductImages);
*/