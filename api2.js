// ================= 1. KHỞI TẠO =================
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    initApp();
});

// ================= 2. ĐIỀU HƯỚNG & CHẶN TRUY CẬP =================
function showPage(pageId) {
    const isLoggedIn = localStorage.getItem('token'); // Kiểm tra bằng Token

    if (pageId !== 'home' && !isLoggedIn) {
        alert('Vui lòng đăng nhập để xem nội dung!');
        showPage('home');
        return;
    }

    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById('page-' + pageId);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active', 'text-amber-400', 'text-gray-900');
        btn.classList.add('text-gray-300');
    });

    const activeBtn = document.getElementById('nav-' + pageId);
    if (activeBtn) {
        activeBtn.classList.add('active', 'text-amber-400');
        activeBtn.classList.remove('text-gray-300');
    }
}

// ================= 3. QUẢN LÝ TRẠNG THÁI APP =================
function initApp() {
    const token = localStorage.getItem('token');
    const userStatus = document.getElementById('user-status');
    const authTabs = document.getElementById('auth-tabs');
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');

    if (token) {
        // Đã đăng nhập: Ẩn tabs và forms
        if (authTabs) authTabs.classList.add('hidden');
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.add('hidden');
        
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (userStatus && user) {
            userStatus.classList.remove('hidden');
            userStatus.innerHTML = `
                <div class="flex items-center gap-2 mb-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p class="text-emerald-400 text-sm font-bold">ONLINE: ${user.email}</p>
                </div>
                <p class="text-[10px] text-amber-400 uppercase tracking-widest mb-4">Quyền hạn: ${user.role}</p>
                <button onclick="logout()" class="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition-all">
                    ĐĂNG XUẤT
                </button>
            `;
        }
        loadAllData(); // Tải API
    } else {
        // Chưa đăng nhập
        if (userStatus) userStatus.classList.add('hidden');
        if (authTabs) authTabs.classList.remove('hidden');
        showPage('home');
    }
}

// ================= 4. XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ (FAKE JWT) =================

function generateToken(user) {
    return btoa(JSON.stringify(user)) + "." + Date.now();
}

// REGISTER
document.getElementById('form-register')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const pass = document.getElementById('register-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
        alert('Email này đã được đăng ký!');
        return;
    }

    // Nếu email là admin@gmail.com thì cấp quyền admin
    const role = email === 'admin@gmail.com' ? 'admin' : 'user';
    const newUser = { email, password: pass, role };
    users.push(newUser);

    localStorage.setItem('users', JSON.stringify(users));
    alert('Đăng ký thành công! Hãy đăng nhập.');
    toggleAuth('login');
});

// LOGIN
document.getElementById('form-login')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === pass);

    if (!user) {
        alert('Tài khoản hoặc mật khẩu không chính xác!');
        return;
    }

    const token = generateToken(user);
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));

    alert('Đăng nhập thành công!');
    initApp();
    location.reload(); // Reload để icon Lucide render đúng
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    location.reload();
}

function toggleAuth(type) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const loginTab = document.getElementById('btn-login-tab');
    const regTab = document.getElementById('btn-reg-tab');

    if (type === 'login') {
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
        loginTab.classList.add('text-amber-400', 'border-b-2', 'border-amber-400');
        regTab.classList.remove('text-amber-400', 'border-b-2', 'border-amber-400');
    } else {
        registerForm?.classList.remove('hidden');
        loginForm?.classList.add('hidden');
        regTab.classList.add('text-amber-400', 'border-b-2', 'border-amber-400');
        loginTab.classList.remove('text-amber-400', 'border-b-2', 'border-amber-400');
    }
}

// ================= 5. TẢI DỮ LIỆU API =================
function loadAllData() {
    console.log("Hệ thống: Đang tải dữ liệu...");
    fetchYouTubePewPew();
    fetchYouTubeMixigaming();
    fetchYouTubeSpeed();
    fetchYouTubeTheFirstTake();
    fetchYouTubeDudePerfect();
    fetchHaNoi();
    fetchTokyo();
    fetchBeijing();
    fetchSeoul();
    fetchSingapore();
    fetchAllNews();
}

// --- GIỮ NGUYÊN CÁC HÀM UPDATE UI VÀ FETCH API CỦA BẠN DƯỚI ĐÂY ---
function updateUI(id, value, fallback = '--') {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value || fallback;
    }
}
// ... Các hàm fetchYouTube..., fetchAllNews... copy nối tiếp vào đây ...

/*---------------------------PewPew------------------------------------*/
async function fetchYouTubePewPew() {
    const API_KEY = 'AIzaSyCDnV0yn53OJLQVdNVg4Vj6G4jkGpCf-NU'; // Dán Key của bạn
    const CHANNEL_ID = 'UCsaMa3VD1I9G952DDlOX7aw'; // Dán ID kênh
    
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            const snippet = data.items[0].snippet;
            const now = new Date().toLocaleTimeString('vi-VN');

            // Đổ dữ liệu
            document.getElementById('yt-channel-name').innerText = snippet.title;
            
            // Dùng toLocaleString để có dấu phẩy ngăn cách hàng nghìn
            document.getElementById('yt-subs').innerText = Number(stats.subscriberCount).toLocaleString('en-US');
            document.getElementById('yt-views').innerText = Number(stats.viewCount).toLocaleString('en-US');
            
            document.getElementById('yt-time').innerText = now;

            // Render lại icon Lucide
            if (window.lucide) lucide.createIcons();
        }
    } catch (err) {
        console.error("Lỗi:", err);
        document.getElementById('yt-channel-name').innerText = "Lỗi kết nối API";
    }
}

// Chạy ngay khi mở trang
fetchYouTubePewPew();









/*---------------------------Mixigaming------------------------------------*/
async function fetchYouTubeMixigaming() {
    const API_KEY = 'AIzaSyCDnV0yn53OJLQVdNVg4Vj6G4jkGpCf-NU'; // Dán Key của bạn
    const CHANNEL_ID = 'UCA_23dkEYToAc37hjSsCnXA'; // Dán ID kênh
    
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            const snippet = data.items[0].snippet;
            const now = new Date().toLocaleTimeString('vi-VN');

            // Đổ dữ liệu
            document.getElementById('yt-channel-name-mixi').innerText = snippet.title;
            
            // Dùng toLocaleString để có dấu phẩy ngăn cách hàng nghìn
            document.getElementById('yt-subs-mixi').innerText = Number(stats.subscriberCount).toLocaleString('en-US');
            document.getElementById('yt-views-mixi').innerText = Number(stats.viewCount).toLocaleString('en-US');
            
            document.getElementById('yt-time-mixi').innerText = now;

            // Render lại icon Lucide
            if (window.lucide) lucide.createIcons();
        }
    } catch (err) {
        console.error("Lỗi:", err);
        document.getElementById('yt-channel-name-mixi').innerText = "Lỗi kết nối API";
    }
}

// Chạy ngay khi mở trang
fetchYouTubeMixigaming();





/*---------------------------Speed------------------------------------*/
async function fetchYouTubeSpeed() {
    const API_KEY = 'AIzaSyBRU5vEv3mAgCCrnPhbU6zLOH6glNNNQWs'; // Dán Key của bạn
    const CHANNEL_ID = 'UC2bW_AY9BlbYLGJSXAbjS4Q'; // Dán ID kênh
    
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            const snippet = data.items[0].snippet;
            const now = new Date().toLocaleTimeString('vi-VN');

            // Đổ dữ liệu
            document.getElementById('yt-channel-name-speed').innerText = snippet.title;
            
            // Dùng toLocaleString để có dấu phẩy ngăn cách hàng nghìn
            document.getElementById('yt-subs-speed').innerText = Number(stats.subscriberCount).toLocaleString('en-US');
            document.getElementById('yt-views-speed').innerText = Number(stats.viewCount).toLocaleString('en-US');
            
            document.getElementById('yt-time-speed').innerText = now;

            // Render lại icon Lucide
            if (window.lucide) lucide.createIcons();
        }
    } catch (err) {
        console.error("Lỗi:", err);
        document.getElementById('yt-channel-name-speed').innerText = "Lỗi kết nối API";
    }
}

// Chạy ngay khi mở trang
fetchYouTubeSpeed();






/*---------------------------TheFirstTake------------------------------------*/
async function fetchYouTubeTheFirstTake() {
    const API_KEY = 'AIzaSyBRU5vEv3mAgCCrnPhbU6zLOH6glNNNQWs'; // Dán Key của bạn
    const CHANNEL_ID = 'UC9zY_E8mcAo_Oq772LEZq8Q'; // Dán ID kênh
    
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            const snippet = data.items[0].snippet;
            const now = new Date().toLocaleTimeString('vi-VN');

            // Đổ dữ liệu
            document.getElementById('yt-channel-name-thefirsttake').innerText = snippet.title;
            
            // Dùng toLocaleString để có dấu phẩy ngăn cách hàng nghìn
            document.getElementById('yt-subs-thefirsttake').innerText = Number(stats.subscriberCount).toLocaleString('en-US');
            document.getElementById('yt-views-thefirsttake').innerText = Number(stats.viewCount).toLocaleString('en-US');
            
            document.getElementById('yt-time-thefirsttake').innerText = now;

            // Render lại icon Lucide
            if (window.lucide) lucide.createIcons();
        }
    } catch (err) {
        console.error("Lỗi:", err);
        document.getElementById('yt-channel-name-thefirsttake').innerText = "Lỗi kết nối API";
    }
}

// Chạy ngay khi mở trang
fetchYouTubeTheFirstTake();





/*---------------------------DudePerfect------------------------------------*/
async function fetchYouTubeDudePerfect() {
    const API_KEY = 'AIzaSyDtaHm2NS1daIpQj9WuDBwBgaVAI_KDNiY'; // Dán Key của bạn
    const CHANNEL_ID = 'UCRijo3ddMTht_IHyNSNXpNQ'; // Dán ID kênh
    
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            const snippet = data.items[0].snippet;
            const now = new Date().toLocaleTimeString('vi-VN');

            // Đổ dữ liệu
            document.getElementById('yt-channel-dudeperfect').innerText = snippet.title;
            
            // Dùng toLocaleString để có dấu phẩy ngăn cách hàng nghìn
            document.getElementById('yt-subs-dudeperfect').innerText = Number(stats.subscriberCount).toLocaleString('en-US');
            document.getElementById('yt-views-dudeperfect').innerText = Number(stats.viewCount).toLocaleString('en-US');
            
            document.getElementById('yt-time-dudeperfect').innerText = now;

            // Render lại icon Lucide
            if (window.lucide) lucide.createIcons();
        }
    } catch (err) {
        console.error("Lỗi:", err);
        document.getElementById('yt-channel-name-dudeperfect').innerText = "Lỗi kết nối API";
    }
}

// Chạy ngay khi mở trang
fetchYouTubeDudePerfect();





/*---------------------------Thời tiết------------------------------------*/
async function fetchHaNoi() {
    const API_KEY = '3bc8c49d8686de0f7a767115fd965ce1';
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Hanoi&appid=${API_KEY}&units=metric&lang=vi`);
        const data = await res.json();
        
        updateUI('hn-temp', `${Math.round(data.main.temp)}°C`);
        updateUI('hn-desc', data.weather[0].description);
        
        // Cập nhật thời gian
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const timeString = `${hours}:${minutes}:${seconds}`;

// Cập nhật vào UI
updateUI('hn-time', timeString);
        updateUI('hn-time', timeString);
    } catch (err) {
        console.error("Lỗi fetch Hà Nội:", err);
    }
}


async function fetchTokyo() {
    const API_KEY = '3bc8c49d8686de0f7a767115fd965ce1';
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=${API_KEY}&units=metric&lang=vi`);
        const data = await res.json();
        
        // 1. Cập nhật các thông số thời tiết
        updateUI('jp-temp', `${Math.round(data.main.temp)}°C`);
        updateUI('jp-desc', data.weather[0].description);
        if (document.getElementById('jp-humidity')) {
            updateUI('jp-humidity', `${data.main.humidity}%`);
        }

        // 2. Lấy thời gian hiện tại và định dạng (HH:mm)
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        // 3. Đổ thời gian vào giao diện (ID 'jp-time' mà mình đã thêm ở file HTML trước đó)
        updateUI('jp-time', timeString);

    } catch (err) {
        console.warn("Weather API lỗi hoặc cần API Key hợp lệ:", err);
    }
}


async function fetchBeijing() {
    const API_KEY = '3bc8c49d8686de0f7a767115fd965ce1';
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Beijing&appid=${API_KEY}&units=metric&lang=vi`);
        const data = await res.json();
        
        // 1. Cập nhật các thông số thời tiết
        updateUI('bj-temp', `${Math.round(data.main.temp)}°C`);
        updateUI('bj-desc', data.weather[0].description);
        if (document.getElementById('bj-humidity')) {
            updateUI('bj-humidity', `${data.main.humidity}%`);
        }

        // 2. Lấy thời gian hiện tại và định dạng (HH:mm)
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        // 3. Đổ thời gian vào giao diện (ID 'bj-time' mà mình đã thêm ở file HTML trước đó)
        updateUI('bj-time', timeString);

    } catch (err) {
        console.warn("Weather API lỗi hoặc cần API Key hợp lệ:", err);
    }
}



async function fetchSeoul() {
    const API_KEY = '3bc8c49d8686de0f7a767115fd965ce1';
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${API_KEY}&units=metric&lang=vi`);
        const data = await res.json();
        
        // 1. Cập nhật các thông số thời tiết
        updateUI('sel-temp', `${Math.round(data.main.temp)}°C`);
        updateUI('sel-desc', data.weather[0].description);
        if (document.getElementById('sel-humidity')) {
            updateUI('sel-humidity', `${data.main.humidity}%`);
        }

        // 2. Lấy thời gian hiện tại và định dạng (HH:mm)
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        // 3. Đổ thời gian vào giao diện (ID 'sel-time' mà mình đã thêm ở file HTML trước đó)
        updateUI('sel-time', timeString);

    } catch (err) {
        console.warn("Weather API lỗi hoặc cần API Key hợp lệ:", err);
    }
}



async function fetchSingapore() {
    const API_KEY = '3bc8c49d8686de0f7a767115fd965ce1';
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Singapore&appid=${API_KEY}&units=metric&lang=vi`);
        const data = await res.json();
        
        // 1. Cập nhật các thông số thời tiết
        updateUI('sg-temp', `${Math.round(data.main.temp)}°C`);
        updateUI('sg-desc', data.weather[0].description);
        if (document.getElementById('sg-humidity')) {
            updateUI('sg-humidity', `${data.main.humidity}%`);
        }

        // 2. Lấy thời gian hiện tại và định dạng (HH:mm)
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        // 3. Đổ thời gian vào giao diện (ID 'sg-time' mà mình đã thêm ở file HTML trước đó)
        updateUI('sg-time', timeString);

    } catch (err) {
        console.warn("Weather API lỗi hoặc cần API Key hợp lệ:", err);
    }
}





/*---------------------------Tin tức------------------------------------*/
async function fetchAllNews() {
    const NEWS_API_KEY = '4967ba93ef9449a5a6f7c87a732a9328';
    
    // SỬA: Bỏ tham số 'from' cố định để API tự lấy tin mới nhất. 
    // Thêm 'language=en' hoặc 'language=vi' (nếu nguồn hỗ trợ) để lọc tin chất lượng.
    const url = `https://newsapi.org/v2/everything?q=tesla OR technology&sortBy=publishedAt&pageSize=12&apiKey=${NEWS_API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        // Kiểm tra lỗi từ phía API (ví dụ: sai Key, quá giới hạn lượt gọi)
        if (data.status !== "ok") {
            console.error("News API Error:", data.message);
            const grid = document.getElementById('news-grid');
            if (grid) grid.innerHTML = `<p class="col-span-full text-center py-10 text-red-400">Không thể tải tin tức: ${data.message}</p>`;
            return;
        }

        const articles = data.articles ? data.articles.slice(0, 10) : [];
        const grid = document.getElementById('news-grid');
        const template = document.getElementById('news-item-template');

        if (!grid || !template) return;

        grid.innerHTML = ''; // Xóa thông báo "Đang tải" hoặc nội dung cũ

        if (articles.length === 0) {
            grid.innerHTML = '<p class="col-span-full text-center py-10 opacity-50">Hiện không có tin tức mới nào.</p>';
            return;
        }

        articles.forEach(article => {
            // Loại bỏ bài bị xóa hoặc thiếu thông tin quan trọng
            if (article.title === "[Removed]" || !article.title || !article.url) return;

            const clone = template.content.cloneNode(true);
            
            // Đổ dữ liệu vào template
            clone.querySelector('.news-title').textContent = article.title;
            clone.querySelector('.news-source').textContent = article.source.name || "Nguồn tin";
            clone.querySelector('.news-link').href = article.url;
            
            // Định dạng ngày tháng cho đẹp
            const date = new Date(article.publishedAt);
            clone.querySelector('.news-date').textContent = date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            grid.appendChild(clone);
        });

        // Vẽ lại các icon Lucide cho các tin mới thêm vào
        if (window.lucide) lucide.createIcons();

    } catch (error) {
        console.error("Lỗi kết nối mạng:", error);
        const grid = document.getElementById('news-grid');
        if (grid) grid.innerHTML = '<p class="col-span-full text-center py-10 text-red-400">Lỗi kết nối. Vui lòng thử lại sau.</p>';
    }
}

// Gọi hàm
fetchAllNews();