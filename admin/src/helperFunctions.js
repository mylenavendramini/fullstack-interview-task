const axios = require("axios")
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

function createCsvRows (userInvestments, companies) {
  const headers = "|User|First Name|Last Name|Date|Holding|Value|"
  if (userInvestments && companies && companies.length > 0) {
    const { userId, firstName, lastName, investmentTotal, date, holdings } = userInvestments
    const csvRows = R.concat([headers], R.map((holding) => {
      const { id, investmentPercentage } = holding
      return `|${userId}|${firstName}|${lastName}|${date}|${findHoldingNameById(companies, id)}|${calculateInvestmentValue(investmentTotal, investmentPercentage)}|`
    }, holdings))
    return { csv: R.join("\n", csvRows) }
  }
  return { csv: headers }
}

async function getRequest (url) {
  try {
    const response = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
    })
    return response.data
  } catch (e) {
    console.error("Error in getRequest: ", e.message)
  }
}

module.exports = { findHoldingNameById, calculateInvestmentValue, createCsvRows, getRequest }