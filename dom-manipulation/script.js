let quotes = [
  { text: "Life is short, live it happily", category: "Inspiratoin" },
  { text: "Knowledge is light", category: "Education" },
  { text: "Don't put off today's work until tomorrow", category: "Wisdom" },
  { text: "Smile, life is more beautiful if you smile", category: "Happiness" }
];

// دالة عرض اقتباس عشوائي
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `
    <p><strong>${quote.text}</strong></p>
    <small>Category: ${quote.category}</small>
  `;
}

// تشغيل عند الضغط على الزر
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// عرض اقتباس أولي عند تحميل الصفحة
showRandomQuote();