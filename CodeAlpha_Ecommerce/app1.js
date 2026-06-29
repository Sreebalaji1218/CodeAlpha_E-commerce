document.addEventListener("DOMContentLoaded", () => {
    const productsDiv = document.getElementById("productsDiv");
    const cartDiv = document.getElementById("cartDiv");
    const totalPriceDiv = document.getElementById("totalPriceDiv");
    const checkoutBtn = document.getElementById("checkoutBtn");

    async function loadProducts() {
        try {
            let response = await fetch("http://localhost:5002/get-products");
            let products = await response.json();
            let html = "";

            products.forEach(p => {
                html += `
                    <div class="product-card">
                        <h3>${p.productName}</h3>
                        <p>Price: ₹${p.productPrice}</p>
                        <button onclick="addToCart('${p._id}')">Add To Cart</button>
                    </div>
                `;
            });
            productsDiv.innerHTML = html;
        } catch (err) {
            productsDiv.innerHTML = "Backend server is not running on port 5002!";
        }
    }

    window.addToCart = async function(id) {
        await fetch("http://localhost:5002/add-to-cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: id })
        });
        loadCart();
    };

    async function loadCart() {
        let response = await fetch("http://localhost:5002/get-cart");
        let cartItems = await response.json();
        
        if (cartItems.length === 0) {
            cartDiv.innerHTML = "Your cart is empty, machi.";
            totalPriceDiv.innerHTML = "Total Price: ₹0";
            return;
        }

        let html = "<ul>";
        let total = 0;
        cartItems.forEach(item => {
            html += `<li>${item.productName} - ₹${item.productPrice}</li>`;
            total += item.productPrice;
        });
        html += "</ul>";
        
        cartDiv.innerHTML = html;
        totalPriceDiv.innerHTML = "Total Price: ₹" + total;
    }

    checkoutBtn.addEventListener("click", async () => {
        let response = await fetch("http://localhost:5002/checkout", { method: "POST" });
        let msg = await response.text();
        alert(msg);
        loadCart();
    });

    loadProducts();
    loadCart();
});