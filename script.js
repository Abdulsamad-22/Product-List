import { cart, displayEmptyCart } from "./cart.js";
import { products } from "./product.js";
import { saveToStorage } from "./cart.js";
import { formartCurrency } from "./money.js";

let productHtml = '';

products.forEach(product => {
    productHtml += `
        <div class="product-container">
                <div class="image-container">
                <img class="product-image" src="${product.image}">
    
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

function updateNumber() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });

    cartNumber.innerHTML = `Your Cart(${cartQuantity})`;
}

const cartButton = document.querySelectorAll('.add-to-cart-btn');

cartButton.forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;

        if (button.querySelector('img') || button.innerText === 'Add to Cart') {
            console.log(addToCart(productId));
            cartCounter(button, productId);
            updateNumber();
        }
    });
});


//console.log(productId);
console.log(products.map(p => p.id));
function updateCart() {

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
                        
                            <p class="product-cart-price">
                                @ $${formartCurrency(matchingProduct.priceCents)}
                            </p>
                        
                            <p class="product-total-price">
                                $${formartCurrency(matchingProduct.priceCents * cartItem.quantity)}
                            </p>
                        </div>
                    </div>
            
                    <span class="remove-cart-container">
                        <img class="remove-cart js-remove-cart" src="assets/images/icon-remove-item.svg" alt="delete cart icon" data-product-id="${matchingProduct.id}">
                    </span>
            
                    </div>
                    <hr class="divider">
                </div>
                `;
                //const cartButtonContainer = document.querySelector('.total-container'); // The container where the items are appended
                const orderTotalBlockExists = document.querySelector('.total-order');
                console.log("Order Total Exists:", !!orderTotalBlockExists)

                if (!orderTotalBlockExists && cartItem.length > 0) {

                    const orderTotalHtml = `
                        <div class="total-order">
                            <p>Order Total</p>
                            <p class="cart-total">$0.00</p>
                        </div>
                        <div class="carbon-neutral-container">
                            <img src="assets/images/icon-carbon-neutral.svg" alt="">
                            <p>This is a <strong>carbon-neutral</strong> delivery</p>
                        </div>
                        <button class="confirm-cta">Confirm Order</button>`;

                    cartSummaryHtml += orderTotalHtml;
                }
        }
    });

    if (document.querySelector('.total-container')) {
        document.querySelector('.total-container').innerHTML = cartSummaryHtml;
    }

    document.querySelectorAll('.js-remove-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            removeFromCart(productId);
        });
    });
    updateCartTotalSum();
}


function addToCart(productId) {
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

    updateCart();
    saveToStorage();
    
    return currentItem.quantity;
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
            button.innerHTML = '';
            button.classList.remove('new-button');
            const img = document.createElement('img');
            img.src = 'assets/images/icon-add-to-cart.svg';
            img.classList.add('cart-icon');
            button.appendChild(img);
            button.appendChild(document.createTextNode('Add to Cart'));
        }

        // Update the total cart sum
        updateCartTotalSum();

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

function cartCounter(button, productId) {
    button.innerHTML = '';
    button.classList.add('new-button');

    // Create minus icon
    const minusIcon = document.createElement('span');
    minusIcon.classList.add('icon');
    const minusImg = document.createElement('img');
    minusImg.src = 'assets/images/icon-decrement-quantity.svg';
    minusImg.alt = 'Minus icon';
    minusImg.classList.add('minus-icon-image');

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
        updatePriceCartGrid(productId, 1);
    } else {
        cartCountDisplay.innerText = currentItem ? currentItem.quantity : 0;
    }

    // Create plus icon
    const plusIcon = document.createElement('span');
    plusIcon.classList.add('icon');
    const plusImg = document.createElement('img');
    plusImg.src = 'assets/images/icon-increment-quantity.svg';
    plusImg.alt = 'Plus icon';
    plusImg.classList.add('plus-icon-image');


    function findCartItemElements(productId) {
        // Find the container with the matching product ID
        const priceCartGrid = document.querySelector(`.price-cart-grid[data-product-id="${productId}"]`);
        
        // Safely find the elements within the specific container
        const quantityElement = priceCartGrid ? priceCartGrid.querySelector('.product-quantity') : null;
        const totalPriceElement = priceCartGrid ? priceCartGrid.querySelector('.product-total-price') : null;
    
        return { quantityElement, totalPriceElement };
    }
    

    // Function to update price-cart-grid for specific item
    function updatePriceCartGrid(productId, quantity) {
        const matchingProduct = products.find(product => product.id === productId);
        if (!matchingProduct) return;

        const { quantityElement, totalPriceElement } = findCartItemElements(productId);

        if (quantityElement) {
            quantityElement.textContent = `${quantity}x`;
        }
        
        if (totalPriceElement) {
            const newTotal = ((matchingProduct.priceCents * quantity) / 100).toFixed(2);
            totalPriceElement.textContent = `$${newTotal}`;
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

                
                // Reset button to original state
                button.innerHTML = '';
                button.classList.remove('new-button');
                const img = document.createElement('img');
                img.src = 'assets/images/icon-add-to-cart.svg';
                img.classList.add('cart-icon');
                button.appendChild(img);
                button.appendChild(document.createTextNode('Add to Cart'));
            }

            saveToStorage();
            updateNumber();
        }
    });

    // Append all elements to button
    button.appendChild(minusImg);
    button.appendChild(cartCountDisplay);
    button.appendChild(plusImg);
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
        cartTotalElement.textContent = `Total: $${totalCartSum.toFixed(2)}`;
    }
}

