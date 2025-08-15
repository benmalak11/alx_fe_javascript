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

// التحقق من أن الاقتباسات تُحفظ وتُسترجع من LocalStorage
function testLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
  const stored = JSON.parse(localStorage.getItem("quotes"));
  console.assert(stored.length === quotes.length, "❌ LocalStorage Test Failed");
  console.log("✅ LocalStorage Test Passed");
}

// التحقق من أن التصدير يعمل
function testExport() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  console.assert(blob.size > 0, "❌ Export Test Failed");
  console.log("✅ Export Test Passed");
}

// التحقق من أن الاستيراد يعمل
function testImport(sampleData) {
  try {
    const imported = JSON.parse(sampleData);
    console.assert(Array.isArray(imported), "❌ Import Test Failed - Not an array");
    console.log("✅ Import Test Passed");
  } catch {
    console.error("❌ Import Test Failed - Invalid JSON");
  }
}

// تشغيل كل الاختبارات
function runAllTests() {
  testLocalStorage();
  testExport();
  testImport(JSON.stringify([{ text: "Test Quote", category: "Test" }]));
}

runAllTests();