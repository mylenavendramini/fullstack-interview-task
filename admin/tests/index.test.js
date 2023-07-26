const express = require("express")
const bodyParser = require("body-parser")
const { describe, expect, test, afterAll } = require("@jest/globals")
const { mockCompanies, mockUserInvestment } = require("./mocks")
const { findHoldingNameById, calculateInvestmentValue, createCsvRows } = require("../src/helperFunctions")
const PORT = 8084

const app = express()
app.use(bodyParser.json({ limit: "10mb" }))
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${PORT}`)
})

describe("Admin service", () => {
  afterAll(() => {
    server.close()
  })
  describe("Find holding name by id function", () => {
    test("should return company name", async () => {
      const holdingId = "2"
      const result = await findHoldingNameById(mockCompanies, holdingId)
      expect(result).toBe("The Small Investment Company")
    })
    test("should return empty string for invalid holding id", async () => {
      const holdingId = 2
      const result = await findHoldingNameById(mockCompanies, holdingId)
      expect(result).toBe("")
    })
    test("should return empty string for empty companies array", async () => {
      const holdingId = "2"
      const result = await findHoldingNameById([], holdingId)
      expect(result).toBe("")
    })
  })
  describe("Calculate investment value function", () => {
    let investmentTotal = 150000
    let investmentPercentage = 0.2
    test("should return a number", () => {
      const result = calculateInvestmentValue(investmentTotal, investmentPercentage)
      expect(result).toBe(30000)
    })
    test("should return 0 when investmentTotal or investmentPercentage are 0", () => {
      investmentTotal = 0
      expect(calculateInvestmentValue(investmentTotal, investmentPercentage)).toBe(0)
      investmentTotal = 150000
      investmentPercentage = 0
      expect(calculateInvestmentValue(investmentTotal, investmentPercentage)).toBe(0)
    })
    test("should return 0 when both investmentTotal and investmentPercentage are 0", () => {
      investmentTotal = 0
      investmentPercentage = 0
      const result = calculateInvestmentValue(investmentTotal, investmentPercentage)
      expect(result).toBe(0)
    })
    test("should return correct value when investMentPercentage is 1, grater than 1 and less than 1", () => {
      investmentTotal = 150000
      investmentPercentage = 1
      expect(calculateInvestmentValue(investmentTotal, investmentPercentage)).toBe(150000)
      investmentPercentage = 1.5
      expect(calculateInvestmentValue(investmentTotal, investmentPercentage)).toBe(225000)
      investmentPercentage = 0.5
      expect(calculateInvestmentValue(investmentTotal, investmentPercentage)).toBe(75000)
    })
    test("should return 0 when investmentTotal or investmentPercentage are negative", () => {
      investmentTotal = -150000
      investmentPercentage = 0.2
      expect(calculateInvestmentValue(investmentTotal, investmentPercentage)).toBe(0)
      investmentTotal = 150000
      investmentPercentage = -0.2
      expect(calculateInvestmentValue(investmentTotal, investmentPercentage)).toBe(0)
    })
    test("should return 0 when investmentTotal or investmentPercentage are not a number", () => {
      investmentTotal = "150000"
      investmentPercentage = 0.2
      expect(calculateInvestmentValue(investmentTotal, investmentPercentage)).toBe(0)
      investmentTotal = 150000
      investmentPercentage = "0.2"
      expect(calculateInvestmentValue(investmentTotal, investmentPercentage)).toBe(0)
    })
  })
  describe("Create CSV Rows function", () => {
    test("should create CSV rows correctly", () => {
      const result = createCsvRows(mockUserInvestment, mockCompanies)
      const expected = { "csv": "|User|First Name|Last Name|Date|Holding|Value|\n|2|Sheila|Aussie|2020-03-01|The Big Investment Company|10750|\n|2|Sheila|Aussie|2020-03-01|The Small Investment Company|6450|\n|2|Sheila|Aussie|2020-03-01|Capital Investments|4300|" }
      expect(result).toEqual(expected)
    })
    test("should return empty CSV for empty or null userInvestments", () => {
      const expected = { "csv": "|User|First Name|Last Name|Date|Holding|Value|" }
      expect(createCsvRows("", mockCompanies)).toEqual(expected)
      expect(createCsvRows(null, mockCompanies)).toEqual(expected)
    })
    test("should return empty CSV for empty or null companies", () => {
      const expected = { "csv": "|User|First Name|Last Name|Date|Holding|Value|" }
      expect(createCsvRows(mockUserInvestment, [])).toEqual(expected)
      expect(createCsvRows(mockUserInvestment, null)).toEqual(expected)
    })
    test("should return empty CSV for both empty or null companies and userInvestments", () => {
      const expected = { "csv": "|User|First Name|Last Name|Date|Holding|Value|" }
      expect(createCsvRows("", [])).toEqual(expected)
      expect(createCsvRows(null, null)).toEqual(expected)
      expect(createCsvRows(null, [])).toEqual(expected)
      expect(createCsvRows("", null)).toEqual(expected)
    })
  })
})