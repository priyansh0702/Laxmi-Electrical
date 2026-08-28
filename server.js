function saveAndPrintInvoice() {
        // 1. ફોર્મ વેલિડેશન
        const partyName = document.getElementById('partyName').value.trim();
        if (!partyName || currentItems.length === 0) {
            alert("Please fill party name and add items.");
            return;
        }

        // 2. પ્રિન્ટ ડેટા સેટઅપ
        document.getElementById('printDocType').innerText = docMode === 'bill' ? 'INVOICE' : 'QUOTATION';
        document.getElementById('printNoLabel').innerText = docMode === 'bill' ? 'Bill No' : 'Quotation No';
        document.getElementById('printBillNo').innerText = document.getElementById('billNo').value;
        document.getElementById('printBillDate').innerText = document.getElementById('billDate').value;
        document.getElementById('printPartyName').innerText = partyName;
        
        const printTbody = document.getElementById('printItemsList');
        const printTableHeader = document.getElementById('printTableHeader');
        printTbody.innerHTML = '';

        if (docMode === 'bill') {
            document.getElementById('printSummaryBox').style.display = 'block';
            document.getElementById('printGrandTotal').innerText = grandTotal.toFixed(2);
            document.getElementById('printTotalAdvance').innerText = totalAdvance.toFixed(2);
            document.getElementById('printBalanceDue').innerText = (grandTotal - totalAdvance).toFixed(2);

            printTableHeader.innerHTML = `<th>Item Description</th><th>Price</th><th>Qty</th><th>Total</th>`;
            currentItems.forEach(item => {
                printTbody.innerHTML += `<tr><td>${escapeHtml(item.name)}</td><td>₹${item.price}</td><td>${item.qty}</td><td>₹${item.total.toFixed(2)}</td></tr>`;
            });

            const advPrintTbody = document.getElementById('printAdvanceList');
            advPrintTbody.innerHTML = '';
            if (advancePayments.length > 0) {
                document.getElementById('printAdvanceContainer').style.display = 'block';
                advancePayments.forEach(adv => {
                    advPrintTbody.innerHTML += `<tr><td>${adv.date}</td><td>${adv.method}</td><td>₹${adv.amount.toFixed(2)}</td></tr>`;
                });
            } else {
                document.getElementById('printAdvanceContainer').style.display = 'none';
            }

            if (savedQrBase64) {
                document.getElementById('uploadedQrPreview').src = savedQrBase64;
                document.getElementById('qrContainer').style.display = 'flex';
            } else {
                document.getElementById('qrContainer').style.display = 'none';
            }
        } else {
            document.getElementById('printSummaryBox').style.display = 'none';
            document.getElementById('printAdvanceContainer').style.display = 'none';
            document.getElementById('qrContainer').style.display = 'none';
            printTableHeader.innerHTML = `<th>Item Description</th><th>Price</th><th>Qty</th>`;
            currentItems.forEach(item => {
                printTbody.innerHTML += `<tr><td>${escapeHtml(item.name)}</td><td>₹${item.price}</td><td>${item.qty}</td></tr>`;
            });
        }

        // 3. પહેલા પ્રિન્ટ ઓપન થશે
        window.print();

        // 4. પ્રિન્ટ થયા પછી સેવ થશે અને ફોર્મ રીસેટ થશે
        saveBillToStorage();
        resetForm();
    }