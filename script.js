const storeButton = document.getElementById("storeStatus");
const storeMessage = document.getElementById("storeMessage");
const orderTableBody = document.getElementById("orderTableBody");
const orderFilter = document.getElementById("orderFilter");

// DEMO DATA
const sampleOrders = [
    {
        id: "CRV1001",
        customer: "Rahul",
        item: "Chicken Biryani",
        amount: 220,
        status: "New"
    },
    {
        id: "CRV1002",
        customer: "Priya",
        item: "Veg Burger",
        amount: 120,
        status: "Preparing"
    },
    {
        id: "CRV1003",
        customer: "Arjun",
        item: "Paneer Pizza",
        amount: 250,
        status: "Ready"
    },
    {
        id: "CRV1004",
        customer: "Sneha",
        item: "French Fries",
        amount: 100,
        status: "Completed"
    }
];

// LOAD SAVED DATA
let orders = JSON.parse(
    localStorage.getItem("cravoraOrders") || "null"
) || sampleOrders;

let isOnline =
    localStorage.getItem("cravoraStoreOnline") === "true";

// SAVE DATA
function saveData() {
    localStorage.setItem(
        "cravoraOrders",
        JSON.stringify(orders)
    );
}

// RESTAURANT STATUS
function updateStoreStatus() {
    storeButton.textContent = isOnline
        ? "Store Online"
        : "Store Offline";

    storeButton.className = isOnline
        ? "online"
        : "offline";

    storeMessage.textContent = isOnline
        ? "Your restaurant is online and accepting orders."
        : "Your restaurant is currently offline.";

    localStorage.setItem(
        "cravoraStoreOnline",
        isOnline
    );
}

storeButton.addEventListener("click", function () {
    isOnline = !isOnline;
    updateStoreStatus();
});

// ORDER STATUS ACTIONS
function updateOrder(orderId, newStatus) {
    const order = orders.find(
        item => item.id === orderId
    );

    if (!order) return;

    order.status = newStatus;

    saveData();
    renderDashboard();
}

// ACTION BUTTONS
function getActionButtons(order) {
    if (order.status === "New") {
        return `
            <button class="action-btn"
                data-id="${order.id}"
                data-action="accept">
                Accept
            </button>
            <button class="action-btn reject"
                data-id="${order.id}"
                data-action="reject">
                Reject
            </button>
        `;
    }

    if (order.status === "Preparing") {
        return `
            <button class="action-btn"
                data-id="${order.id}"
                data-action="ready">
                Mark Ready
            </button>
        `;
    }

    if (order.status === "Ready") {
        return `
            <button class="action-btn"
                data-id="${order.id}"
                data-action="complete">
                Complete
            </button>
        `;
    }

    return `<span class="muted">No action</span>`;
}

// RENDER ORDERS
function renderOrders() {
    const selectedFilter = orderFilter.value;

    const filteredOrders = orders.filter(order =>
        selectedFilter === "All" ||
        order.status === selectedFilter
    );

    if (filteredOrders.length === 0) {
        orderTableBody.innerHTML = `
            <tr>
                <td colspan="6">No orders found.</td>
            </tr>
        `;
        return;
    }

    orderTableBody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.item}</td>
            <td>₹${order.amount}</td>
            <td>
                <span class="status ${order.status.toLowerCase()}">
                    ${order.status}
                </span>
            </td>
            <td>${getActionButtons(order)}</td>
        </tr>
    `).join("");
}

// DASHBOARD STATISTICS
function updateStatistics() {
    const newCount = orders.filter(
        order => order.status === "New"
    ).length;

    const preparingCount = orders.filter(
        order => order.status === "Preparing"
    ).length;

    const readyCount = orders.filter(
        order => order.status === "Ready"
    ).length;

    const sales = orders
        .filter(order => order.status === "Completed")
        .reduce((total, order) => total + order.amount, 0);

    document.getElementById("newOrders").textContent =
        newCount;

    document.getElementById("preparingOrders").textContent =
        preparingCount;

    document.getElementById("readyOrders").textContent =
        readyCount;

    document.getElementById("todaySales").textContent =
        "₹" + sales;

    document.getElementById("earningsTotal").textContent =
        "₹" + sales;
}

// COMPLETE DASHBOARD
function renderDashboard() {
    updateStatistics();
    renderOrders();
}

// ORDER BUTTON EVENTS
orderTableBody.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const orderId = button.dataset.id;
    const action = button.dataset.action;

    const nextStatus = {
        accept: "Preparing",
        reject: "Rejected",
        ready: "Ready",
        complete: "Completed"
    };

    const order = orders.find(item => item.id === orderId);

    if (!order) return;

    if (action === "reject") {
        if (!confirm("Are you sure you want to reject this order?")) {
            return;
        }
    }

    updateOrder(orderId, nextStatus[action]);
});

// FILTER
orderFilter.addEventListener("change", renderOrders);

// INITIALIZE
updateStoreStatus();
renderDashboard();
