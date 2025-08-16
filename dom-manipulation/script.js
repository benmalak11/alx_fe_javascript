let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Life is short, live it happily", category: "Inspiratoin" },
  { text: "Knowledge is light", category: "Education" },
  { text: "Don't put off today's work until tomorrow", category: "Wisdom" },
  { text: "Smile, life is more beautiful if you smile", category: "Happiness" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// دالة عرض اقتباس عشوائي
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `
    <p><strong>${quote.text}</strong></p>
    <small>الفئة: ${quote.category}</small>
  `;
}

function createAddQuoteForm() {
  let formContainer = document.createElement("div");

  let textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "أدخل نص الاقتباس";

  let categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "أدخل الفئة";

  let addButton = document.createElement("button");
  addButton.textContent = "إضافة اقتباس";

  addButton.addEventListener("click", function () {
    let newQuote = {
      text: textInput.value,
      category: categoryInput.value
    };
    if (newQuote.text && newQuote.category) {
      quotes.push(newQuote);
      saveQuotes(); // نحفظ المصفوفة في localStorage // إضافة للمصفوفة
      showRandomQuote(); // عرض الاقتباس الجديد
      textInput.value = "";
      categoryInput.value = "";
    }
  });

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// تفعيل زر عرض اقتباس جديد
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// عند تحميل الصفحة
showRandomQuote();
createAddQuoteForm();

document.getElementById("exportQuotes").addEventListener("click", function() {
    const data = JSON.stringify(quotes, null, 2); // Pretty JSON
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
});

function importFromJsonFile(event) {
  const file = event.target.files[0]; // الحصول على الملف المختار
  if (!file) return;

  const reader = new FileReader(); // إنشاء FileReader
  reader.onload = function(e) {
    const content = e.target.result; // نص الملف
    try {
      const importedQuotes = JSON.parse(content); // تحويل النص إلى JSON
      quotes = quotes.concat(importedQuotes); // إضافة الاقتباسات للمصفوفة
      showRandomQuote(); // عرض اقتباس جديد
      localStorage.setItem('quotes', JSON.stringify(quotes)); // تحديث التخزين المحلي
    } catch (err) {
      alert("Invalid JSON file!");
    }
  };
  reader.readAsText(file); // قراءة الملف كنص
}
function populateCategories() {
  const categorySelect = document.getElementById('categoryFilter');

  // Remove old options except "All"
  [...categorySelect.querySelectorAll('option:not([value="all"])')].forEach(opt => opt.remove());

  // Get unique categories
  const categories = new Set(quotes.map(q => q.category));

  // Add them to the select
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

const categoryFilter = document.getElementById("categoryFilter");
const quoteDisplay = document.getElementById("quoteDisplay");

// دالة لتصفية الاقتباسات
function filterQuotes() {
  let selectedCategory = categoryFilter.value;
  localStorage.setItem("lastCategory", selectedCategory); // حفظ آخر فئة مختارة

  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
  } else {
    let random = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.innerText = filteredQuotes[random].text;
  }
}

// استرجاع آخر فئة مختارة عند تحميل الصفحة
window.addEventListener("load", () => {
  let savedCategory = localStorage.getItem("lastCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
  filterQuotes();
});

const notification = document.getElementById("notification");
const syncButton = document.getElementById("syncNow");

// ✅ جلب البيانات من سيرفر وهمي (JSONPlaceholder)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const data = await response.json();

    // نحول بيانات JSONPlaceholder لصيغة اقتباسات
    return data.map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    showNotification("❌ Failed to fetch from server");
    return [];
  }
}

// ✅ إرسال بيانات جديدة للسيرفر (POST)
async function postQuoteToServer(newQuote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuote)
    });
    const data = await response.json();
    console.log("Posted to server:", data);
    return data;
  } catch (error) {
    showNotification("❌ Failed to post to server");
  }
}

// ✅ المزامنة
async function syncQuotes() {
  let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  let serverQuotes = await fetchQuotesFromServer();

  // دمج مع أولوية للسيرفر
  let merged = [...serverQuotes];
  localQuotes.forEach(local => {
    if (!serverQuotes.some(srv => srv.text === local.text)) {
      merged.push(local);
      postQuoteToServer(local); // أي اقتباس محلي يترفع للسيرفر
    }
  });

  localStorage.setItem("quotes", JSON.stringify(merged));
  showNotification("✅ Synced with server (JSONPlaceholder).");
}

// ✅ إشعارات
function showNotification(msg) {
  notification.innerText = msg;
  notification.style.color = "blue";
  setTimeout(() => (notification.innerText = ""), 4000);
}

// ✅ إشعارات مزامنة
function showNotification(msg) {
  const notification = document.getElementById("notification");
  notification.innerText = msg;
  notification.style.color = "green";
  setTimeout(() => (notification.innerText = ""), 4000);
}

// ✅ مثال عند المزامنة الناجحة
async function syncQuotes() {
  // ... (الكود اللي يعمل جلب ودمج البيانات)
  showNotification("Quotes synced with server!");
}


// ✅ مزامنة دورية كل 10 ثواني
setInterval(syncQuotes, 10000);

// ✅ زر لمزامنة يدوية
syncButton.addEventListener("click", syncQuotes);



// حدث عند تغيير الفئة
categoryFilter.addEventListener("change", filterQuotes);
// Call this once when the page loads
populateCategories();

// ربط الحدث بزر الاستيراد
document.getElementById('importQuotes').addEventListener('change', importFromJsonFile);
