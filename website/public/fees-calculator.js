

// ==========================================================
// ADMISSIONS FEES CALCULATOR
// ==========================================================
document.getElementById('calcBtn').addEventListener('click', function() {
    const program = document.getElementById('programType').value;
    const gender = document.getElementById('studentGender').value;
    
    let total = 0;
    
    if(program === 'boarding') {
        // 1300000 + 60000 + 70000 + 50000 + 20000 + 150000 + 150000
        let baseBoarding = 1300000 + 60000 + 70000 + 50000 + 20000 + 150000 + 150000;
        let uniform = (gender === 'girl') ? 470000 : 430000;
        total = baseBoarding + uniform;
    } else {
        // 800000 + 60000 + 70000 + 50000 + 100000 + 80000
        let baseDay = 800000 + 60000 + 70000 + 50000 + 100000 + 80000;
        let uniform = (gender === 'girl') ? 340000 : 310000;
        total = baseDay + uniform;
    }
    
    const resultBox = document.getElementById('calcResult');
    const totalSpan = document.getElementById('totalAmount');
    
    totalSpan.textContent = "UGX " + total.toLocaleString();
    resultBox.style.display = 'block';
});

