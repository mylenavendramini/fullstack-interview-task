const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const axios = require("axios")
const { createCsvRows, getRequest, postRequest } = require("./helperFunctions")

const app = express()

app.use(bodyParser.json({ limit: "10mb" }))

app.get("/investments/:id", async (req, res) => {
  const { id } = req.params
  try {
    const response = await axios.get(`${config.investmentsServiceUrl}/investments/${id}`)
    res.send(JSON.stringify(response.data))
  } catch (e) {
    console.error(e)
    res.send(500)
  }
})

app.get("/generate-csv-report/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!id || isNaN(id)) return res.status(400).send("Invalid investment id")

    const userInvestments = await getRequest(`${config.investmentsServiceUrl}/investments/${id}`)
    if (!userInvestments || userInvestments.length === 0) return res.status(404).send("Information not found")

    const companies = await getRequest(`${config.financialCompaniesUrl}/companies`)
    if (!companies || companies.length === 0) return res.status(404).send("Information not found")

    const csvReport = createCsvRows(userInvestments[0], companies)
    await postRequest(`${config.investmentsServiceUrl}/investments/export`, csvReport)
    res.type("text/csv")
    res.send(csvReport)
  } catch (e) {
    console.error("Error occurred while generating CSV report:", e)
    res.status(500).send("Internal Server Error")
  }
})

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})
