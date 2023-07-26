const express = require("express")
const bodyParser = require("body-parser")
const { describe, expect, test, afterAll } = require("@jest/globals")
const { mockCompanies, mockUserInvestment } = require("./mocks")
const { findHoldingNameById } = require("../src/helperFunctions")
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
})