const storeButton = document.getElementById("storeStatus");

let isOnline = false;

storeButton.addEventListener("click", function () {
    isOnline = !isOnline;

    if (isOnline) {
        storeButton.textContent = "Store Online";
        storeButton.style.background = "#087f5b";
        alert("Your restaurant is now ONLINE!");
    } else {
        storeButton.textContent = "Store Offline";
        storeButton.style.background = "#e74c3c";
        alert("Your restaurant is now OFFLINE!");
    }
});
