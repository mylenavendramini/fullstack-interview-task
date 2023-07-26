const R = require("ramda")

function findHoldingNameById (companies, holdingId) {
  if (companies && holdingId) {
    const matchingCompany = R.find(R.propEq("id", holdingId), companies)
    return matchingCompany ? matchingCompany.name : ""
  } return ""
}

module.exports = { findHoldingNameById }