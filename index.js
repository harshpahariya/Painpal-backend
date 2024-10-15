const express = require("express");
const sql = require("mssql");
const cors = require('cors')
const combineDuplicates = require("./utils/combineDuplicates");

const app = express();

app.use(cors());
app.use(express.json());

// SQL Server configuration
var config = {
    "user": "dev", // Database username
    "password": "Qwer@1234", // Database password
    "server": "painquestionnaire.database.windows.net", // Server IP address
    "database": "dev_db", // Database name
    "options": {
        "encrypt": true // Disable encryption
    }
}

async function insertShoulderData(payload) {
    try {
      // Connect to the database
      await sql.connect(config);
  
      // Create a request object
      const request = new sql.Request();
  
      // Prepare the SQL command
      const insertQuery = `
        EXEC GetShoulderData
          @ques1 = @ques1,
          @choices1 = @choices1,
          @ques2 = @ques2,
          @choices2 = @choices2,
          @ques3 = @ques3,
          @choices3 = @choices3,
          @ques4 = @ques4,
          @choices4 = @choices4,
          @ques5 = @ques5,
          @choices5 = @choices5,
          @ques6 = @ques6,
          @choices6 = @choices6,
          @ques7 = @ques7,
          @choices7 = @choices7,
          @sex = @sex,
          @age_min = @age_min,
          @age_max = @age_max,
          @YouConsiderYourself = @YouConsiderYourself,
          @Smoking = @Smoking,
          @DiabetesThyroidHeartStroke = @DiabetesThyroidHeartStroke;
      `;
  
      // Bind parameters, adjusting based on the new payload structure
      request.input('ques1', sql.VarChar, 'Pain location in shoulder');
      request.input('choices1', sql.VarChar, payload["Pain location in shoulder"].join(', '));
  
      request.input('ques2', sql.VarChar, 'Did you have / Involved in');
      request.input('choices2', sql.VarChar, payload["Did you have / Involved in "].join(', '));
  
      request.input('ques3', sql.VarChar, 'Feel pain when');
      request.input('choices3', sql.VarChar, payload["Feel pain when"].join(', '));
  
      request.input('ques4', sql.VarChar, 'Affected area feels');
      request.input('choices4', sql.VarChar, payload["Affected area feels"].join(', '));
  
      request.input('ques5', sql.VarChar, 'Feel when you move');
      request.input('choices5', sql.VarChar, payload["Feel when you move"].join(', '));
  
      request.input('ques6', sql.VarChar, 'Pain from sport');
      request.input('choices6', sql.VarChar, payload["Pain from sport"].join(', '));
  
      request.input('ques7', sql.VarChar, 'Pain radiating into other parts');
      request.input('choices7', sql.VarChar, payload["Pain radiating into other parts"].join(', '));
  
      request.input('sex', sql.VarChar, payload.gender);
      
      // Extract age range and convert to min/max values
      const ageRange = payload.ageRange.split('-');
      const age_min = parseInt(ageRange[0]);
      const age_max = parseInt(ageRange[1]);
      request.input('age_min', sql.Int, age_min);
      request.input('age_max', sql.Int, age_max);
      
      request.input('YouConsiderYourself', sql.VarChar, payload.weightType);
      request.input('Smoking', sql.VarChar, payload.Smoking[0]); // Assuming it is still an array
      request.input('DiabetesThyroidHeartStroke', sql.VarChar, payload["Do you have any of these - Diabetes, thyroid problems, heart disease, or stroke"][0]); // Assuming it is also an array
  
      // Execute the query and get the result
      const result = await request.query(insertQuery);
      
      // Assuming the stored procedure returns the JSON object
      const returnedData = result.recordset; // This will be an array of returned rows
  
      // Send the returned data back to the frontend
      return returnedData;
    } catch (err) {
      console.error('Error inserting data:', err);
      throw err; // Rethrow error for further handling
    } finally {
      // Close the database connection
      await sql.close();
    }
  }
  

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        console.log('ERROR', err)
        throw err;
    }
    console.log("Connection Successful!");
});



const fetchQuery = `EXEC GetChoices`

// Define route for fetching data from SQL Server
app.post("/insert", async (req, res) => {
    try {
        const responseData = await insertShoulderData(req.body);
        res.json(responseData); // Send back the JSON object
      } catch (err) {
        res.status(500).json({ error: 'An error occurred while inserting data' });
      }
});

app.get('/fetch', (req, res) => {
    new sql.Request().query(fetchQuery, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
        } else {
            const data = result.recordset;
            const updatedData = combineDuplicates(data)
            res.send(updatedData); 
        }
    });
})


app.get("/", (req, res) => {
    res.send("Hello, Worlds!");
  });

const PORT = process.env.PORT || 8080

// Start the server on port 8080
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
