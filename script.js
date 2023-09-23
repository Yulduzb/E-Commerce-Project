const searchBtn = document.querySelector(".fa-magnifying-glass");
const searchInput = document.querySelector(".searchInput");
const categoryList = document.querySelector(".bottom-category");
const basketBtn = document.querySelector("#basketBtn");
const modalWrapper = document.querySelector(".modal-wrapper");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector("#close");
const main = document.querySelector("main");
const count = document.querySelector("#count");
const totalPrice = document.querySelector("#total-price");

let basket = [];
let total = 0;


const baseUrl = 'https://api.escuelajs.co/api/v1';

//responsive ekranda arama kismini açar ve kapatir
searchBtn.addEventListener("click", () => {
    searchInput.classList.toggle("active")
});


document.addEventListener("DOMContentLoaded", () => {
    fetchCategory();
    fetchProduct();
})

//Kategorileri Apidan çekme fonksiyonu
const fetchCategory = () => {
    fetch(`${baseUrl}/categories`)
        .then((res) => res.json())
        .then((data) => {

            renderCategory(data.slice(0, 5));
        })
}

//Ürünleri Apidan Çekme fonksiyonu
async function fetchProduct() {
    try {
        const response = await fetch(`${baseUrl}/products`)
        const data = await response.json()
        renderProduct(data.slice(0, 32))

    } catch (err) {
        console.log(err)
    }

}

// Kategorileri ekrana render etme
const renderCategory = (categories) => {
    categories.forEach((category) => {
        const categoryDiv = document.createElement("div")
        categoryDiv.classList.add("categories")
        categoryDiv.innerHTML = `<p>${category.name}</p>
    `

        categoryList.appendChild(categoryDiv)
    })
}


//Ürünleri ekrana render etme
const renderProduct = (products) => {
    const cardRow = document.createElement("div")
    cardRow.classList.add("card-row")
    const productsHtml = products.map((product) => `

   <div class="card-column">
     <div class="img-box">
        <img src="${product.images[0]}" alt=""/>
      </div>
      <div class="content">
          <div class="product-name">
            <h3>${product.title}</h3>
            <span>${product.category.name ? product.category.name : "Others"}</span>
          </div>
         <div class="price_rating">
            <span>${product.price} &#8378</span>
         </div>
         
     </div>
     <button onclick="addBasket({
        id: ${product.id},
        title: '${product.title}',
        price: ${product.price}, 
        img: '${product.images[0]}',
        amount: 1
    })">Sepete Ekle</button>
 </div>

   `

    ).join(' ')

    cardRow.innerHTML = productsHtml
    main.appendChild(cardRow)
}



//Sepete ekleme işlemi
function addBasket(product) {
    const existProduct = basket.find((item) => item.id === product.id)

    if (existProduct) {
        existProduct.amount++;
    } else {
        basket.push(product);
        console.log(basket);
    }
}


//sepete elemenleri listeleme
function renderBasket() {
    const cardHtml = basket
        .map(
            (product) =>
                `<div class="list">
            <div class="item">
                <div class="modal-image">
                    <img src="${product.img}"/>
                </div>
               <div class="content">
                <h3 class="title">${product.title}</h3>
                <h4 class="title">${product.price} &#8378</h4>
                <p>Miktar: ${product.amount} </p>
               </div>
               
               <div class="delete" onclick="deleteItem(${product.id})">
            <i class="fa-solid fa-trash"></i>
          </div>
            
            </div>
        </div>
       
    </div>


   
    `).join(' ')
    modal.innerHTML = cardHtml;
    calculateTotal()
}

const calculateTotal = () => {
    const sum = basket.reduce((sum, item) => sum + item.price * item.amount, 0);
    const amount = basket.reduce((sum, item) => sum + item.amount, 0);
    totalPrice.innerText = sum;
    count.innerText = amount + ' ' + 'Ürün';
}




//sepetten Ürünü silme
const deleteItem = (deleteID) => {
    basket = basket.filter((item) => item.id !== deleteID);
    renderBasket();
}






basketBtn.addEventListener("click", () => {
    console.log("merhaba")
    modalWrapper.classList.add("open")
    renderBasket();
});

closeBtn.addEventListener("click", () => {
    modalWrapper.classList.remove("open")

});
