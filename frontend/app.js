const API_BASE = "http://localhost:3000/api";

let dashboardData = {
    customers: [],
    packages: [],
    bookings: [],
    payments: [],
    reviews: []
};

document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    setupNavigation();
    loadDashboardData();
});

/* =========================================================
   API
========================================================= */

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            `Request failed with status ${response.status}`
        );
    }

    return data;
}

function extractArray(response, key = null) {
    if (Array.isArray(response)) {
        return response;
    }

    if (key && Array.isArray(response[key])) {
        return response[key];
    }

    if (Array.isArray(response.data)) {
        return response.data;
    }

    if (Array.isArray(response.customers)) {
        return response.customers;
    }

    if (Array.isArray(response.packages)) {
        return response.packages;
    }

    if (Array.isArray(response.bookings)) {
        return response.bookings;
    }

    if (Array.isArray(response.payments)) {
        return response.payments;
    }

    if (Array.isArray(response.reviews)) {
        return response.reviews;
    }

    return [];
}

/* =========================================================
   LOAD ALL DATABASE DATA
========================================================= */

async function loadDashboardData() {
    try {
        showLoadingState();

        const [
            customersResponse,
            packagesResponse,
            bookingsResponse,
            paymentsResponse,
            reviewsResponse
        ] = await Promise.all([
            apiRequest("/customers"),
            apiRequest("/packages"),
            apiRequest("/bookings"),
            apiRequest("/payments"),
            apiRequest("/reviews")
        ]);

        dashboardData.customers =
            extractArray(customersResponse, "customers");

        dashboardData.packages =
            extractArray(packagesResponse, "packages");

        dashboardData.bookings =
            extractArray(bookingsResponse, "bookings");

        dashboardData.payments =
            extractArray(paymentsResponse, "payments");

        dashboardData.reviews =
            extractArray(reviewsResponse, "reviews");

        updateDashboard();
        populateBookingForm();

        hideLoadingState();

    } catch (error) {
        console.error("Dashboard loading error:", error);

        hideLoadingState();

        showDashboardError(
            `Unable to load dashboard data. ${error.message}`
        );
    }
}

/* =========================================================
   DASHBOARD UPDATE
========================================================= */

function updateDashboard() {
    updateMainStats();
    updateNavigationCounts();
    updateRevenue();
    updateRecentBookings();
    updatePaymentSummary();
    updatePopularDestinations();
    updateReviews();
    updateRightSidebar();
    updatePackageCards();
}

/* =========================================================
   MAIN STATISTICS
========================================================= */

function updateMainStats() {
    const totalBookings =
        dashboardData.bookings.length;

    const totalCustomers =
        dashboardData.customers.length;

    const totalPackages =
        dashboardData.packages.length;

    const totalRevenue =
        getPaidRevenue(dashboardData.payments);

    setText("#totalBookings", totalBookings);
    setText("#totalCustomers", totalCustomers);
    setText("#totalPackages", totalPackages);
    setText("#totalRevenue", formatCurrency(totalRevenue));

    /*
     * Fallback for existing HTML that does not yet
     * contain the IDs above.
     */

    const statCards =
        document.querySelectorAll(".stat-card");

    if (statCards.length >= 1) {
        const number =
            statCards[0].querySelector(".stat-number");

        if (number) {
            number.textContent = totalBookings;
        }
    }

    if (statCards.length >= 2) {
        const number =
            statCards[1].querySelector(".stat-number");

        if (number) {
            number.textContent = totalCustomers;
        }
    }

    if (statCards.length >= 3) {
        const number =
            statCards[2].querySelector(".stat-number");

        if (number) {
            number.textContent =
                formatCurrency(totalRevenue);
        }
    }

    if (statCards.length >= 4) {
        const number =
            statCards[3].querySelector(".stat-number");

        if (number) {
            number.textContent = totalPackages;
        }
    }
}

/* =========================================================
   NAVIGATION COUNTS
========================================================= */

function updateNavigationCounts() {
    setText(
        "#customerNavCount",
        dashboardData.customers.length
    );

    setText(
        "#bookingNavCount",
        dashboardData.bookings.length
    );

    setText(
        "#packageNavCount",
        dashboardData.packages.length
    );

    document
        .querySelectorAll(".nav-link")
        .forEach(link => {
            const text =
                link.textContent
                    .trim()
                    .toLowerCase();

            const count =
                link.querySelector(".nav-count");

            if (!count) {
                return;
            }

            if (text.startsWith("customer")) {
                count.textContent =
                    dashboardData.customers.length;
            }

            if (text.startsWith("booking")) {
                count.textContent =
                    dashboardData.bookings.length;
            }

            if (text.startsWith("package")) {
                count.textContent =
                    dashboardData.packages.length;
            }
        });
}

/* =========================================================
   REVENUE
========================================================= */

function getPaidRevenue(payments) {
    return payments.reduce((total, payment) => {
        const status =
            String(
                payment.Payment_Status || ""
            ).toUpperCase();

        if (status === "PAID") {
            return total +
                Number(payment.Amount || 0);
        }

        return total;
    }, 0);
}

function getRevenueForPeriod(period) {
    const now = new Date();

    return dashboardData.payments
        .filter(payment => {
            const status =
                String(
                    payment.Payment_Status || ""
                ).toUpperCase();

            if (status !== "PAID") {
                return false;
            }

            if (!payment.Payment_Date) {
                return false;
            }

            const date =
                new Date(payment.Payment_Date);

            if (Number.isNaN(date.getTime())) {
                return false;
            }

            if (period === "month") {
                return (
                    date.getFullYear() ===
                        now.getFullYear() &&
                    date.getMonth() ===
                        now.getMonth()
                );
            }

            if (period === "lastYear") {
                return (
                    date.getFullYear() ===
                    now.getFullYear() - 1
                );
            }

            return (
                date.getFullYear() ===
                now.getFullYear()
            );
        })
        .reduce(
            (sum, payment) =>
                sum + Number(payment.Amount || 0),
            0
        );
}

function updateRevenue() {
    const select =
        document.querySelector("#revenuePeriod");

    const period =
        select?.value || "year";

    const revenue =
        getRevenueForPeriod(period);

    setText(
        "#revenueNumber",
        formatCurrency(revenue)
    );

    const oldRevenueNumber =
        document.querySelector(".revenue-number");

    if (oldRevenueNumber) {
        oldRevenueNumber.textContent =
            formatCurrency(revenue);
    }

    updateRevenueBreakdown(period);
}

function updateRevenueBreakdown(period) {
    const container =
        document.querySelector("#revenueBreakdown");

    if (!container) {
        return;
    }

    const now = new Date();

    const payments =
        dashboardData.payments.filter(payment => {
            if (
                String(
                    payment.Payment_Status || ""
                ).toUpperCase() !== "PAID"
            ) {
                return false;
            }

            if (!payment.Payment_Date) {
                return false;
            }

            const date =
                new Date(payment.Payment_Date);

            if (Number.isNaN(date.getTime())) {
                return false;
            }

            if (period === "month") {
                return (
                    date.getFullYear() ===
                        now.getFullYear() &&
                    date.getMonth() ===
                        now.getMonth()
                );
            }

            if (period === "lastYear") {
                return (
                    date.getFullYear() ===
                    now.getFullYear() - 1
                );
            }

            return (
                date.getFullYear() ===
                now.getFullYear()
            );
        });

    const total =
        payments.reduce(
            (sum, payment) =>
                sum + Number(payment.Amount || 0),
            0
        );

    container.innerHTML = `
        <div class="revenue-summary">
            <span>Total</span>
            <strong>${formatCurrency(total)}</strong>
        </div>

        <div class="revenue-summary">
            <span>Transactions</span>
            <strong>${payments.length}</strong>
        </div>
    `;
}

/* =========================================================
   RECENT BOOKINGS
========================================================= */

function getSortedBookings() {
    return [...dashboardData.bookings]
        .sort((a, b) => {
            const dateA =
                new Date(a.Booking_Date || 0);

            const dateB =
                new Date(b.Booking_Date || 0);

            return dateB - dateA;
        });
}

function updateRecentBookings() {
    const container =
        document.querySelector(".booking-list");

    if (!container) {
        return;
    }

    const bookings =
        getSortedBookings().slice(0, 6);

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                No bookings found.
            </div>
        `;

        return;
    }

    container.innerHTML =
        bookings
            .map(renderBookingItem)
            .join("");
}

function renderBookingItem(booking) {
    const status =
        normalizeStatus(booking.Status);

    const amount =
        Number(booking.Amount || 0);

    return `
        <div class="booking-item">
            <div class="booking-info">

                <div class="booking-avatar">
                    ${getInitials(
                        booking.Customer_Name ||
                        "Customer"
                    )}
                </div>

                <div>
                    <h4>
                        ${escapeHTML(
                            booking.Customer_Name ||
                            "Unknown Customer"
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            booking.Package_Name ||
                            "Unknown Package"
                        )}
                    </p>
                </div>

            </div>

            <div class="booking-date">
                ${formatDate(
                    booking.Booking_Date
                )}
            </div>

            <div class="booking-amount">
                ${formatCurrency(amount)}
            </div>

            <div class="booking-status ${status}">
                ${escapeHTML(
                    booking.Status ||
                    "PENDING"
                )}
            </div>
        </div>
    `;
}

/* =========================================================
   PAYMENT SUMMARY
========================================================= */

function updatePaymentSummary() {
    const payments =
        dashboardData.payments;

    const paid =
        payments.filter(payment =>
            String(
                payment.Payment_Status || ""
            ).toUpperCase() === "PAID"
        );

    const pending =
        payments.filter(payment =>
            String(
                payment.Payment_Status || ""
            ).toUpperCase() !== "PAID"
        );

    const paidAmount =
        paid.reduce(
            (sum, payment) =>
                sum + Number(payment.Amount || 0),
            0
        );

    const pendingAmount =
        pending.reduce(
            (sum, payment) =>
                sum + Number(payment.Amount || 0),
            0
        );

    setText(
        "#paidPaymentsCount",
        paid.length
    );

    setText(
        "#pendingPaymentsCount",
        pending.length
    );

    setText(
        "#paidPaymentsAmount",
        formatCurrency(paidAmount)
    );

    setText(
        "#pendingPaymentsAmount",
        formatCurrency(pendingAmount)
    );

    setText(
        "#paymentTotal",
        formatCurrency(
            paidAmount + pendingAmount
        )
    );
}

/* =========================================================
   POPULAR DESTINATIONS
========================================================= */

function getDestinationCounts() {
    const counts = {};

    dashboardData.bookings.forEach(
        booking => {
            const packageData =
                dashboardData.packages.find(
                    pkg =>
                        Number(
                            pkg.Package_ID
                        ) ===
                        Number(
                            booking.Package_ID
                        )
                );

            if (
                !packageData ||
                !packageData.Destinations
            ) {
                return;
            }

            const destinations =
                String(
                    packageData.Destinations
                )
                    .split(",")
                    .map(item =>
                        item.trim()
                    )
                    .filter(Boolean);

            destinations.forEach(
                destination => {
                    counts[destination] =
                        (counts[destination] || 0) +
                        1;
                }
            );
        }
    );

    return counts;
}

function updatePopularDestinations() {
    const container =
        document.querySelector(
            "#popularDestinations"
        ) ||
        document.querySelector(
            ".destination-list"
        );

    if (!container) {
        return;
    }

    const counts =
        getDestinationCounts();

    const destinations =
        Object.entries(counts)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(0, 5);

    if (destinations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                No destination data available.
            </div>
        `;

        return;
    }

    const max =
        destinations[0][1];

    container.innerHTML =
        destinations
            .map(
                ([destination, count]) => {
                    const percentage =
                        max > 0
                            ? Math.round(
                                  (count / max) *
                                      100
                              )
                            : 0;

                    return `
                        <div class="destination-item">

                            <div class="destination-header">
                                <span>
                                    ${escapeHTML(
                                        destination
                                    )}
                                </span>

                                <strong>
                                    ${count}
                                    booking${count !== 1 ? "s" : ""}
                                </strong>
                            </div>

                            <div class="destination-bar">
                                <div
                                    class="destination-progress"
                                    style="width:${percentage}%"
                                ></div>
                            </div>

                        </div>
                    `;
                }
            )
            .join("");
}

/* =========================================================
   REVIEWS
========================================================= */

function updateReviews() {
    const container =
        document.querySelector(
            "#recentReviews"
        ) ||
        document.querySelector(
            ".review-list"
        );

    if (!container) {
        return;
    }

    const reviews =
        [...dashboardData.reviews]
            .sort(
                (a, b) =>
                    Number(
                        b.Review_ID || 0
                    ) -
                    Number(
                        a.Review_ID || 0
                    )
            )
            .slice(0, 5);

    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                No reviews available.
            </div>
        `;

        return;
    }

    container.innerHTML =
        reviews
            .map(review => {
                const rating =
                    Math.max(
                        0,
                        Math.min(
                            5,
                            Number(
                                review.Rating || 0
                            )
                        )
                    );

                return `
                    <div class="review-item">

                        <div class="review-avatar">
                            ${getInitials(
                                review.Customer_Name ||
                                "Customer"
                            )}
                        </div>

                        <div class="review-content">

                            <div class="review-header">

                                <strong>
                                    ${escapeHTML(
                                        review.Customer_Name ||
                                        "Customer"
                                    )}
                                </strong>

                                <span class="review-rating">
                                    ${"★".repeat(
                                        rating
                                    )}
                                    ${"☆".repeat(
                                        5 - rating
                                    )}
                                </span>

                            </div>

                            <p>
                                ${escapeHTML(
                                    review.Review_Text ||
                                    ""
                                )}
                            </p>

                            <small>
                                ${escapeHTML(
                                    review.Package_Name ||
                                    ""
                                )}
                            </small>

                        </div>

                    </div>
                `;
            })
            .join("");
}

/* =========================================================
   RIGHT SIDEBAR
========================================================= */

function updateRightSidebar() {
    const now =
        new Date();

    const monthBookings =
        dashboardData.bookings.filter(
            booking => {
                const date =
                    new Date(
                        booking.Booking_Date
                    );

                return (
                    !Number.isNaN(
                        date.getTime()
                    ) &&
                    date.getFullYear() ===
                        now.getFullYear() &&
                    date.getMonth() ===
                        now.getMonth()
                );
            }
        );

    const pendingPayments =
        dashboardData.payments.filter(
            payment =>
                String(
                    payment.Payment_Status ||
                    ""
                ).toUpperCase() !== "PAID"
        );

    const upcoming =
        dashboardData.bookings
            .filter(booking => {
                const date =
                    new Date(
                        booking.Booking_Date
                    );

                return (
                    !Number.isNaN(
                        date.getTime()
                    ) &&
                    date >= startOfToday()
                );
            })
            .sort(
                (a, b) =>
                    new Date(
                        a.Booking_Date
                    ) -
                    new Date(
                        b.Booking_Date
                    )
            );

    setText(
        "#todayBookings",
        monthBookings.length
    );

    setText(
        "#pendingPayments",
        pendingPayments.length
    );

    setText(
        "#totalCustomers",
        dashboardData.customers.length
    );

    setText(
        "#totalPackages",
        dashboardData.packages.length
    );

    setText(
        "#upcomingCount",
        upcoming.length
    );

    renderUpcomingBookings(upcoming);
}

/* =========================================================
   UPCOMING BOOKINGS
========================================================= */

function renderUpcomingBookings(
    bookings
) {
    const container =
        document.querySelector(
            "#upcomingBookings"
        );

    if (!container) {
        return;
    }

    const upcoming =
        bookings.slice(0, 5);

    if (upcoming.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                No upcoming bookings.
            </div>
        `;

        return;
    }

    container.innerHTML =
        upcoming
            .map(booking => `
                <div class="upcoming-booking">

                    <div>
                        <strong>
                            ${escapeHTML(
                                booking.Customer_Name ||
                                "Customer"
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                booking.Package_Name ||
                                "Package"
                            )}
                        </span>
                    </div>

                    <time>
                        ${formatDate(
                            booking.Booking_Date
                        )}
                    </time>

                </div>
            `)
            .join("");
}

/* =========================================================
   PACKAGES
========================================================= */

function updatePackageCards() {
    const container =
        document.querySelector(
            "#packageList"
        );

    if (!container) {
        return;
    }

    if (
        dashboardData.packages.length === 0
    ) {
        container.innerHTML = `
            <div class="empty-state">
                No packages available.
            </div>
        `;

        return;
    }

    container.innerHTML =
        dashboardData.packages
            .map(pkg => `
                <div class="package-card">

                    <div class="package-card-content">

                        <h3>
                            ${escapeHTML(
                                pkg.Package_Name ||
                                "Package"
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                pkg.Destinations ||
                                "Destination unavailable"
                            )}
                        </p>

                        <div class="package-details">

                            <span>
                                ${escapeHTML(
                                    pkg.Duration ||
                                    "-"
                                )}
                            </span>

                            <strong>
                                ${formatCurrency(
                                    pkg.Price
                                )}
                            </strong>

                        </div>

                    </div>

                </div>
            `)
            .join("");
}

/* =========================================================
   BOOKING FORM
========================================================= */

function populateBookingForm() {
    const customerSelect =
        document.querySelector(
            "#customer"
        );

    const packageSelect =
        document.querySelector(
            "#package"
        );

    if (customerSelect) {
        customerSelect.innerHTML = `
            <option value="">
                Select customer
            </option>

            ${dashboardData.customers
                .map(customer => `
                    <option
                        value="${customer.Customer_ID}"
                    >
                        ${escapeHTML(
                            customer.Name
                        )}
                    </option>
                `)
                .join("")}
        `;
    }

    if (packageSelect) {
        packageSelect.innerHTML = `
            <option value="">
                Select package
            </option>

            ${dashboardData.packages
                .map(pkg => `
                    <option
                        value="${pkg.Package_ID}"
                        data-price="${Number(
                            pkg.Price || 0
                        )}"
                    >
                        ${escapeHTML(
                            pkg.Package_Name
                        )}
                        -
                        ${formatCurrency(
                            pkg.Price
                        )}
                    </option>
                `)
                .join("")}
        `;
    }
}

function setupBookingForm() {
    const customerSelect =
        document.querySelector(
            "#customer"
        );

    const packageSelect =
        document.querySelector(
            "#package"
        );

    const passengerName =
        document.querySelector(
            "#passengerName"
        );

    const amount =
        document.querySelector(
            "#amount"
        );

    if (
        customerSelect &&
        passengerName
    ) {
        customerSelect.addEventListener(
            "change",
            () => {
                const customer =
                    dashboardData.customers.find(
                        item =>
                            Number(
                                item.Customer_ID
                            ) ===
                            Number(
                                customerSelect.value
                            )
                    );

                if (customer) {
                    passengerName.value =
                        customer.Name || "";
                }
            }
        );
    }

    if (
        packageSelect &&
        amount
    ) {
        packageSelect.addEventListener(
            "change",
            () => {
                const option =
                    packageSelect.options[
                        packageSelect.selectedIndex
                    ];

                if (
                    option &&
                    option.dataset.price
                ) {
                    amount.value =
                        Number(
                            option.dataset.price
                        );
                }
            }
        );
    }
}

/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {
    setupBookingForm();

    const bookingForm =
        document.querySelector(
            "#bookingForm"
        );

    if (bookingForm) {
        bookingForm.addEventListener(
            "submit",
            handleBookingSubmit
        );
    }

    const cancelButton =
        document.querySelector(
            "#cancelBooking"
        );

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closeBookingModal
        );
    }

    const revenuePeriod =
        document.querySelector(
            "#revenuePeriod"
        );

    if (revenuePeriod) {
        revenuePeriod.addEventListener(
            "change",
            updateRevenue
        );
    }

    const searchInput =
        document.querySelector(
            "#searchBookings"
        );

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            event => {
                filterBookings(
                    event.target.value
                );
            }
        );
    }

    const bookingModal =
        document.querySelector(
            "#bookingModal"
        );

    if (bookingModal) {
        bookingModal.addEventListener(
            "click",
            event => {
                if (
                    event.target ===
                    bookingModal
                ) {
                    closeBookingModal();
                }
            }
        );
    }

    const refreshButton =
        document.querySelector(
            "#refreshDashboard"
        );

    if (refreshButton) {
        refreshButton.addEventListener(
            "click",
            loadDashboardData
        );
    }
}

/* =========================================================
   CREATE BOOKING
========================================================= */

async function handleBookingSubmit(
    event
) {
    event.preventDefault();

    const customerId =
        document.querySelector(
            "#customer"
        )?.value;

    const packageId =
        document.querySelector(
            "#package"
        )?.value;

    const bookingDate =
        document.querySelector(
            "#travelDate"
        )?.value;

    const passengerName =
        document.querySelector(
            "#passengerName"
        )?.value.trim();

    const amount =
        Number(
            document.querySelector(
                "#amount"
            )?.value || 0
        );

    const paymentStatus =
        document.querySelector(
            "#paymentStatus"
        )?.value || "PENDING";

    if (!customerId) {
        alert(
            "Please select a customer."
        );
        return;
    }

    if (!packageId) {
        alert(
            "Please select a package."
        );
        return;
    }

    if (!bookingDate) {
        alert(
            "Please select a travel date."
        );
        return;
    }

    if (!passengerName) {
        alert(
            "Please enter the passenger name."
        );
        return;
    }

    if (amount < 0) {
        alert(
            "Payment amount cannot be negative."
        );
        return;
    }

    try {
        const bookingResponse =
            await apiRequest(
                "/bookings",
                {
                    method: "POST",

                    body: JSON.stringify({
                        Customer_ID:
                            Number(
                                customerId
                            ),

                        Package_ID:
                            Number(
                                packageId
                            ),

                        Agent_ID:
                            null,

                        Booking_Date:
                            bookingDate,

                        Status:
                            paymentStatus ===
                            "PAID"
                                ? "CONFIRMED"
                                : "PENDING",

                        Passenger_Name:
                            passengerName
                    })
                }
            );

        if (
            !bookingResponse.success
        ) {
            throw new Error(
                bookingResponse.message ||
                "Booking could not be created."
            );
        }

        const bookingId =
            bookingResponse.Booking_ID;

        /*
         * The backend stores payments separately.
         */

        if (amount > 0) {
            await apiRequest(
                "/payments",
                {
                    method: "POST",

                    body: JSON.stringify({
                        Booking_ID:
                            bookingId,

                        Amount:
                            amount,

                        Payment_Date:
                            getTodayISO(),

                        Payment_Status:
                            paymentStatus
                    })
                }
            );
        }

        alert(
            "Booking created successfully."
        );

        closeBookingModal();

        event.target.reset();

        await loadDashboardData();

    } catch (error) {
        console.error(error);

        alert(
            error.message ||
            "Unable to create booking."
        );
    }
}

/* =========================================================
   SEARCH BOOKINGS
========================================================= */

function filterBookings(
    searchTerm
) {
    const container =
        document.querySelector(
            ".booking-list"
        );

    if (!container) {
        return;
    }

    const term =
        String(
            searchTerm || ""
        )
            .trim()
            .toLowerCase();

    if (!term) {
        updateRecentBookings();
        return;
    }

    const bookings =
        dashboardData.bookings.filter(
            booking =>
                [
                    booking.Customer_Name,
                    booking.Package_Name,
                    booking.Status,
                    booking.Booking_ID
                ]
                    .filter(Boolean)
                    .some(value =>
                        String(value)
                            .toLowerCase()
                            .includes(term)
                    )
        );

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                No matching bookings found.
            </div>
        `;

        return;
    }

    container.innerHTML =
        bookings
            .slice(0, 20)
            .map(renderBookingItem)
            .join("");
}

/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

async function updateBookingStatus(
    bookingId,
    status
) {
    try {
        await apiRequest(
            `/bookings/${bookingId}/status`,
            {
                method: "PUT",

                body: JSON.stringify({
                    Status: status
                })
            }
        );

        await loadDashboardData();

        alert(
            "Booking status updated."
        );

    } catch (error) {
        console.error(error);

        alert(
            error.message ||
            "Unable to update booking status."
        );
    }
}

/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {
    document
        .querySelectorAll(
            ".nav-link"
        )
        .forEach(link => {
            link.addEventListener(
                "click",
                event => {
                    event.preventDefault();

                    const section =
                        link.dataset.section ||
                        getNavigationSection(
                            link
                        );

                    handleNavigation(
                        section
                    );
                }
            );
        });
}

function getNavigationSection(
    link
) {
    const text =
        link.textContent
            .trim()
            .toLowerCase();

    if (
        text.includes("dashboard")
    ) {
        return "dashboard";
    }

    if (
        text.includes("booking")
    ) {
        return "bookings";
    }

    if (
        text.includes("customer")
    ) {
        return "customers";
    }

    if (
        text.includes("package")
    ) {
        return "packages";
    }

    if (
        text.includes("payment")
    ) {
        return "payments";
    }

    if (
        text.includes("review")
    ) {
        return "reviews";
    }

    if (
        text.includes("destination")
    ) {
        return "destinations";
    }

    return "";
}

function handleNavigation(
    section
) {
    switch (section) {
        case "dashboard":
            showDashboard();
            break;

        case "bookings":
            showDataPanel(
                "Bookings",
                dashboardData.bookings
            );
            break;

        case "customers":
            showDataPanel(
                "Customers",
                dashboardData.customers
            );
            break;

        case "packages":
            showDataPanel(
                "Packages",
                dashboardData.packages
            );
            break;

        case "payments":
            showDataPanel(
                "Payments",
                dashboardData.payments
            );
            break;

        case "reviews":
            showDataPanel(
                "Reviews",
                dashboardData.reviews
            );
            break;

        case "destinations":
            showDestinationsPanel();
            break;

        default:
            console.log(
                "No section:",
                section
            );
    }
}

/* =========================================================
   DATA PANEL
========================================================= */

function showDataPanel(
    title,
    data
) {
    const existing =
        document.querySelector(
            "#dataPanel"
        );

    if (existing) {
        existing.remove();
    }

    const panel =
        document.createElement(
            "div"
        );

    panel.id = "dataPanel";

    panel.innerHTML = `
        <div class="data-panel-overlay">

            <div class="data-panel">

                <div class="data-panel-header">

                    <h2>
                        ${escapeHTML(
                            title
                        )}
                    </h2>

                    <button
                        type="button"
                        class="data-panel-close"
                        id="closeDataPanel"
                    >
                        ×
                    </button>

                </div>

                <div class="data-panel-body">
                    ${renderDataTable(
                        data
                    )}
                </div>

            </div>

        </div>
    `;

    document.body.appendChild(
        panel
    );

    document
        .querySelector(
            "#closeDataPanel"
        )
        ?.addEventListener(
            "click",
            () => panel.remove()
        );
}

function renderDataTable(
    data
) {
    if (
        !data ||
        data.length === 0
    ) {
        return `
            <div class="empty-state">
                No records found.
            </div>
        `;
    }

    const keys =
        Object.keys(
            data[0]
        );

    return `
        <div class="table-wrapper">

            <table class="data-table">

                <thead>
                    <tr>
                        ${keys
                            .map(
                                key => `
                                    <th>
                                        ${escapeHTML(
                                            key.replace(
                                                /_/g,
                                                " "
                                            )
                                        )}
                                    </th>
                                `
                            )
                            .join("")}
                    </tr>
                </thead>

                <tbody>
                    ${data
                        .map(
                            row => `
                                <tr>
                                    ${keys
                                        .map(
                                            key => `
                                                <td>
                                                    ${escapeHTML(
                                                        formatTableValue(
                                                            row[
                                                                key
                                                            ]
                                                        )
                                                    )}
                                                </td>
                                            `
                                        )
                                        .join("")}
                                </tr>
                            `
                        )
                        .join("")}
                </tbody>

            </table>

        </div>
    `;
}

function showDestinationsPanel() {
    const counts =
        getDestinationCounts();

    const data =
        Object.entries(
            counts
        ).map(
            ([destination, count]) => ({
                Destination:
                    destination,

                Booking_Count:
                    count
            })
        );

    showDataPanel(
        "Destinations",
        data
    );
}

/* =========================================================
   BOOKING MODAL
========================================================= */

function openBookingModal() {
    const modal =
        document.querySelector(
            "#bookingModal"
        );

    if (!modal) {
        return;
    }

    populateBookingForm();

    modal.style.display =
        "flex";

    const date =
        document.querySelector(
            "#travelDate"
        );

    if (
        date &&
        !date.value
    ) {
        date.value =
            getTodayISO();
    }

    const amount =
        document.querySelector(
            "#amount"
        );

    if (
        amount &&
        !amount.value
    ) {
        amount.value = 0;
    }
}

function closeBookingModal() {
    const modal =
        document.querySelector(
            "#bookingModal"
        );

    if (modal) {
        modal.style.display =
            "none";
    }
}

/* =========================================================
   LOGIN
========================================================= */

async function login(
    username,
    password
) {
    try {
        const response =
            await apiRequest(
                "/auth/login",
                {
                    method: "POST",

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

        if (
            !response.success
        ) {
            throw new Error(
                response.message ||
                "Login failed."
            );
        }

        localStorage.setItem(
            "travelAgencyUser",
            JSON.stringify(
                response.user
            )
        );

        return response.user;

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        throw error;
    }
}

/* =========================================================
   UI HELPERS
========================================================= */

function showLoadingState() {
    const indicator =
        document.querySelector(
            "#dashboardLoading"
        );

    if (indicator) {
        indicator.style.display =
            "block";
    }
}

function hideLoadingState() {
    const indicator =
        document.querySelector(
            "#dashboardLoading"
        );

    if (indicator) {
        indicator.style.display =
            "none";
    }
}

function showDashboardError(
    message
) {
    const errorElement =
        document.querySelector(
            "#dashboardError"
        );

    if (errorElement) {
        errorElement.textContent =
            message;

        errorElement.style.display =
            "block";
    } else {
        console.error(
            message
        );
    }
}

function showDashboard() {
    const panel =
        document.querySelector(
            "#dataPanel"
        );

    if (panel) {
        panel.remove();
    }

    loadDashboardData();
}

/* =========================================================
   FORMATTING
========================================================= */

function formatCurrency(
    value
) {
    const number =
        Number(value || 0);

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(number);
}

function formatDate(
    value
) {
    if (!value) {
        return "-";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "-";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}

function getTodayISO() {
    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function startOfToday() {
    const date =
        new Date();

    date.setHours(
        0,
        0,
        0,
        0
    );

    return date;
}

function normalizeStatus(
    status
) {
    return String(
        status || "pending"
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );
}

function getInitials(
    name
) {
    return String(
        name || "Customer"
    )
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word
                    .charAt(0)
                    .toUpperCase()
        )
        .join("");
}

function formatTableValue(
    value
) {
    if (
        value === null ||
        value === undefined
    ) {
        return "-";
    }

    if (
        typeof value ===
        "object"
    ) {
        return JSON.stringify(
            value
        );
    }

    return String(value);
}

function setText(
    selector,
    value
) {
    const element =
        document.querySelector(
            selector
        );

    if (element) {
        element.textContent =
            value;
    }
}

function escapeHTML(
    value
) {
    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}

/* =========================================================
   GLOBAL FUNCTIONS FOR HTML
========================================================= */

window.openBookingModal =
    openBookingModal;

window.closeBookingModal =
    closeBookingModal;

window.updateBookingStatus =
    updateBookingStatus;

window.login =
    login;

window.loadDashboardData =
    loadDashboardData;