const express = require("express")
const bodyParser = require("body-parser")
const { describe, expect, test, afterAll } = require("@jest/globals")
const { mockCompanies, mockUserInvestment } = require("./mocks")
const { findHoldingNameById, calculateInvestmentValue } = require("../src/helperFunctions")
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
})