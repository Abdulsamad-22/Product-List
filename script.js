import { cart, displayEmptyCart, addToCart } from "./cart.js";
//import { startNewOrder } from "./cart.js";
import { products } from "./Scripts/Utilities/data/product.js";
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

let cartNumber = document.querySelector('.cart-number');

document.querySelector('.js-products-grid').innerHTML = productHtml;

export function updateNumber() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });

    cartNumber.innerHTML = `Your Cart(${cartQuantity})`;
}

const cartButton = document.querySelectorAll('.add-to-cart-btn');

function activeItem(productId, quantity) {
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
        

        console.log(matchingProduct);
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
            console.log("Order Total Exists:", !!orderTotalBlockExists);

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


function resetButton(button) {
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

function removeFromCart(productId) {
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

function setupConfirmButton() {
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


function updateProductImages() {
    const screenWidth = window.innerWidth;

    products.forEach(product => {
        const imageElement = document.querySelector(`product-image[data-product-id="${product.id}"]`);

        if (!imageElement) return;

        if (screenWidth <= 480) {
            imageElement.src = product.image.mobile;
        } else if (screenWidth <= 768) {
            imageElement.src = product.image.tablet;
        } else {
            imageElement.src = product.image.desktop;
        }
    });
}


window.addEventListener('resize', updateProductImages);

