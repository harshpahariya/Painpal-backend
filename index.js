const express = require("express");
const sql = require("mssql");

const app = express();

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

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        console.log('ERROR', err)
        throw err;
    }
    console.log("Connection Successful!");
});

const query = `EXEC GetShoulderData
@ques1= 'Pain location in shoulder',
@choices1 ='Outside of the shoulder (Side), Front of the shoulder',
@ques2 ='Did you have / Involved in',
@choices2= 'Repetitive overhead movements, Repetitive activities or overuse of specific muscle, Lifting heavy objects, Falling onto an outstretched hand',
@ques3= 'Feel pain when',
@choices3 ='Stretching the affected arm or shoulder',
@ques4= 'Affected area feels',
@choices4= 'Pins and needles',
@ques5= 'feel when you move',
@choices5= 'Hear clicking noice',
@ques6= 'Pain from sport',
@choices6 ='Swinging injury (Cricket, Tennis, Hockey, Golf, Baseball, Softball pitching, Basket ball, Badminton)',
@ques7= 'Pain radiating into other parts',
@choices7= 'Neck',
@sex = 'M',
@age_min =15,
@age_max= 50,
@YouConsiderYourself='Overweight',
@Smoking= 'yes',
@DiabetesThyroidHeartStroke ='yes';`

// Define route for fetching data from SQL Server
app.post("/insert", (request, response) => {
    // Execute a SELECT query
    new sql.Request().query(query, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
        } else {
            response.send(result.recordset); // Send query result as response
            console.dir(result.recordset);
        }
    });
});


app.get("/", (req, res) => {
    res.send("Hello, Worlds!");
  });

const PORT = process.env.PORT || 8080

// Start the server on port 8080
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
