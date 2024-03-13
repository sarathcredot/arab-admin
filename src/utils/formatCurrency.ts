export const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) {
        amount = 0;
    }

    const formattedAmount = amount.toFixed(2);

    const [wholeNumber, decimal] = formattedAmount.split('.');

    const formattedWholeNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const formattedCurrency = `${formattedWholeNumber}.${decimal}`;

    const formattedCurrencyWithSymbol = `OMR ${formattedCurrency}`;

    return formattedCurrencyWithSymbol;
}
