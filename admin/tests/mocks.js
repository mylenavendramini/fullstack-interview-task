const mockCompanies = [{
  "id": "1",
  "name": "The Big Investment Company",
  "address": "14 Square Place",
  "postcode": "SW18UU",
  "frn": "234165",
}, {
  "id": "2",
  "name": "The Small Investment Company",
  "address": "12 Circle Square",
  "postcode": "SW18UD",
  "frn": "773388",
}, {
  "id": "3",
  "name": "Capital Investments",
  "address": "1 Capital Road",
  "postcode": "SW18UT",
  "frn": "078592",
}]

const mockUserInvestment = {
  "id": "6",
  "userId": "2",
  "firstName": "Sheila",
  "lastName": "Aussie",
  "investmentTotal": 21500,
  "date": "2020-03-01",
  "holdings": [{ "id": "1", "investmentPercentage": 0.5 }, { "id": "2", "investmentPercentage": 0.3 }, { "id": "3", "investmentPercentage": 0.2 }],
}

module.exports = { mockCompanies, mockUserInvestment }