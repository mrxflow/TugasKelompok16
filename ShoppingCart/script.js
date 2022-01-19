const shippingAlert = document.getElementById('alert');
const navbar = document.getElementById('navbar');
const sticky = navbar.offsetTop;
const navbarCartIcon = document.querySelector('.fa-shopping-bag');
const shoppingCart = document.querySelector('.shopping-cart');
const closeCartDiv = document.querySelector('.close-cart-window');
const quantity = document.querySelectorAll('.qty');
const removeCartItemIcons = document.querySelectorAll('.fa-trash');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const completePurchase = document.getElementById('checkout-btn');


//event listener for click to remove free shipping alert banner
shippingAlert.addEventListener('click', () => {
  shippingAlert.classList.toggle('hidden');
});

//create a sticky nav once the user starts to scroll down
window.onscroll = function () {
  stickyNav()
};

//event listener on navbar shopping cart icon click to show/hide cart
navbarCartIcon.addEventListener('click', toggleCart);

//event listener on shopping cart 'close' div to close it
closeCartDiv.addEventListener('click', toggleCart);

//event listeners on each cart item quanity value
quantity.forEach(el =>
  el.addEventListener('change', updateShoppingCartTotal));

//event listeners on each cart item trash icons for removal
removeCartItemIcons.forEach(el =>
  el.addEventListener('click', removeShoppingCartItem));

//event listeners for 'add to cart' buttons
addToCartButtons.forEach(el =>
  el.addEventListener('click', addClickedItemToCart));

//event listener for shopping cart 'checkout'
completePurchase.addEventListener('click', clearCartAfterPurchase);

updateShoppingCart()
updateTotalShoppingCartItems();
updateNavbarCartIconTotal();
updateShoppingCartTotal()


function toggleCart() {
  shoppingCart.classList.toggle('hidden');
}

//close modal if a user clicks outside of the modal
window.onclick = function (event) {
  if (event.target == shoppingCart) {
    shoppingCart.classList.toggle('hidden');
  }
}

function stickyNav() {
  if (window.pageYOffset > sticky + 1) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}

function updateShoppingCart() {
  // see whats in local storage
  let shoppingCartItems = JSON.parse(localStorage.getItem('shoppingCartItems'))

  // loop through each item object, add to cart
  if (shoppingCartItems === null) {
    let shoppingCartItems = []
    localStorage.setItem('shoppingCartItems', JSON.stringify(shoppingCartItems))
  } else {
    shoppingCartItems.map(item => {
      let itemImage = item.image
      let itemName = item.name
      let itemPrice = item.price
      addItemToCart(itemImage, itemName, itemPrice)
    })
  }
}

function updateNavbarCartIconTotal() {
  //update navbar shopping cart icon to reflect total items in shopping cart
  const totalCartItems = document.getElementById('total-cart-items');
  const updatedTotal = updateTotalShoppingCartItems().length.toString();

  //toggle hidden on cart icon total, avoid showing a zero
  //if cart is empty, when you add to cart, unhide icon
  if (updatedTotal == 0) {
    totalCartItems.classList.toggle('hidden');
    totalCartItems.innerText = updatedTotal
  } else {
    totalCartItems.innerText = updatedTotal;
  }
}

function updateTotalShoppingCartItems() {
  //get total number of items in the shopping cart  
  const totalShoppingCartItems = document.getElementsByClassName('shopping-cart-item');
  return totalShoppingCartItems
}

function addClickedItemToCart(event) {
  //update navbar cart icon and total cart items
  //get button clicked item name, image, and price
  //grab clicked item .shopping-cart-item, query classes inside it
  //see if item is already in the cart, alert message if so
  updateNavbarCartIconTotal()
  updateTotalShoppingCartItems()
  updateShoppingCartTotal()

  const clickedItemContainer = event.target.parentElement
  const itemImage = clickedItemContainer.getElementsByClassName(
    'item-img')[0].src
  const itemName = clickedItemContainer.getElementsByClassName(
    'item-name')[0].innerText;
  const itemPrice = clickedItemContainer.getElementsByClassName(
    'item-price')[0].innerText;
  const newItem = {
    image: itemImage,
    name: itemName,
    price: itemPrice
  }

  // Get localStorage items, JSON parse them, turn into array of item objects
  // localStorage.removeItem('shoppingCartItems')
  let shoppingCartItems = JSON.parse(localStorage.getItem('shoppingCartItems'))
  if (shoppingCartItems === null) {
    let shoppingCartItems = []
    shoppingCartItems.push(newItem)
    localStorage.setItem('shoppingCartItems', JSON.stringify(shoppingCartItems))
    addItemToCart(itemImage, itemName, itemPrice)
  } else if (shoppingCartItems.some(item => item.name === newItem.name)) {
    // See if item is already in local storage, no need to add it then
    alert("This item is already in your shopping cart");
    return
  } else {
    shoppingCartItems.push(newItem)
    localStorage.setItem('shoppingCartItems', JSON.stringify(shoppingCartItems))
    addItemToCart(itemImage, itemName, itemPrice)
  }
}

function addItemToCart(itemImage, itemName, itemPrice) {
  //create new cart item div to be added to the shopping cart
  //get shopping cart item div to append new cart item
  const newCartItemDiv = document.createElement('div');
  newCartItemDiv.classList.add('shopping-cart-item');
  document.getElementsByClassName('shopping-cart-items')[0].append(
    newCartItemDiv);
  const cartItemTemplate = `    
  <div class="cart-item-img">
    <img class="cart-item-img" src="${itemImage}">
  </div>
  <p class="cart-item-name">
  ${itemName}
  </p>
  <div class="qty-price-remove-container">
    <div class="cart-item-qty-container">
      <p class="cart-item-qty">Qty</p>
      <div class="qty-selector">
        <label for="qty"></label>
        <select class="qty" id="qty" name="quantity">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
    </div>
    <div class="cart-item-price-container">
      <p>Price</p>
      <p class="cart-item-price">${itemPrice}</p>
    </div>
    <div class="cart-item-remove">
      <i class="fas fa-trash"></i>
    </div>
  </div>`
  newCartItemDiv.innerHTML = cartItemTemplate

  updateTotalShoppingCartItems();
  updateNavbarCartIconTotal();
  updateShoppingCartTotal()

  newCartItemDiv.getElementsByClassName('fa-trash')[0].addEventListener(
    'click', removeShoppingCartItem);
  newCartItemDiv.getElementsByClassName('qty')[0].addEventListener(
    'change', updateShoppingCartTotal);
}

function removeShoppingCartItem(event) {
  // determine which item name was clicked
  let removeItemName = event.target.parentElement.parentElement.previousSibling.previousSibling.innerText

  //remove that item from local storage
  let shoppingCartItems = JSON.parse(localStorage.getItem('shoppingCartItems'))
  let newShoppingCartItems = shoppingCartItems.filter(item =>
    item.name !== removeItemName
  )
  localStorage.setItem('shoppingCartItems', JSON.stringify(newShoppingCartItems))
  console.log(localStorage.shoppingCartItems)

  // clear shopping cart
  const currentItems = document.getElementsByClassName(
    'shopping-cart-items')[0];

  if (updateTotalShoppingCartItems().length > 0) {
    while (currentItems.hasChildNodes()) {
      currentItems.removeChild(currentItems.firstChild)
    }
  }

  updateShoppingCart()
  updateTotalShoppingCartItems();
  updateNavbarCartIconTotal();
  updateShoppingCartTotal()
}

function updateShoppingCartTotal() {
  //loop through qty-price-remove-container, grab each item's price multiplied its quantity, sum all items
  const qtyPriceContainer = document.getElementsByClassName(
    'qty-price-remove-container');
  let newTotal = 0;

  for (let i = 0; i < qtyPriceContainer.length; i++) {
    //get item qty, get item price, multiply each, add to total array
    const cartItem = qtyPriceContainer[i]
    const quantity = cartItem.getElementsByClassName('qty')[0].value
    const price = cartItem.getElementsByClassName(
      'cart-item-price')[0].innerText.replace('$', '')
    newTotal = newTotal + (quantity * parseFloat(price))
  }

  // insert total into shopping cart total
  document.getElementById('cart-total-price').innerText = "$" + newTotal;
}

function clearCartAfterPurchase() {
  //get all shopping cart items, remove them
  const currentItems = document.getElementsByClassName(
    'shopping-cart-items')[0];

  if (updateTotalShoppingCartItems().length > 0) {
    alert('Thank you for your purchase!')
    while (currentItems.hasChildNodes()) {
      currentItems.removeChild(currentItems.firstChild)
    }
    updateNavbarCartIconTotal()
    updateShoppingCartTotal()
  } else {
    alert('Your shopping cart is empty. Please add items to the cart.')
  }
}