const R = require("ramda")

function findHoldingNameById (companies, holdingId) {
  if (companies && holdingId) {
    const matchingCompany = R.find(R.propEq("id", holdingId), companies)
    return matchingCompany ? matchingCompany.name : ""
  } return ""
}

function calculateInvestmentValue (investmentTotal, investmentPercentage) {
  if (typeof investmentTotal === "number" && typeof investmentPercentage === "number" && investmentTotal > 0 && investmentPercentage > 0) {
    return investmentTotal * investmentPercentage
  } return 0
}

module.exports = { findHoldingNameById, calculateInvestmentValue }