import React, { useState } from "react";
import { TextField, Button, Container, Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import "./App.css"; // Import your CSS file

import moment from "moment";

function App() {
  const [inputData, setInputData] = useState("");
  const [results, setResults] = useState([]);

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const calculateDateDifference = (matchDate) => {
    const [day, month] = matchDate.split("/");
    const currentDate = moment();
    const currentMonth = currentDate.month() + 1;
    const parsedDate = moment(
      `${month.length === 1 ? "0" + month : month}-${
        day.length === 1 ? "0" + day : day
      }`,
      "MM-DD"
    );

    let yearDifference = 0;
    if (parsedDate.month() + 1 < currentMonth) {
      yearDifference = 1;
    }

    parsedDate.add(yearDifference, "year");
    const dayDifference = parsedDate.diff(currentDate, "days") + 1;

    return dayDifference;
  };

  const generateResults = () => {
    const lines = inputData.split("\n");
    const regexProfit = /(\d+)\s*กำไร\s*(\d+)/;
    const regexDate = /\b\d{1,2}\/\d{1,2}\b/;

    const newResults = lines
      .map((line, index) => {
        const match = line.match(regexProfit);
        if (match) {
          const matchDate = line.match(regexDate);
          let dayDifference = 1;
          if (matchDate) {
            dayDifference = calculateDateDifference(matchDate[0]);
          }
          const beforeProfit = parseFloat(match[1]);
          const afterProfit = parseFloat(match[2]);
          const percentage = ((afterProfit / beforeProfit) * 100).toFixed(2);
          return {
            key: index,
            text: (
              <span>
                {line} = <strong> {percentage}</strong> %
                {matchDate && (
                  <>
                    {` | กำไร/วัน = ${(
                      10000 /
                      percentage /
                      dayDifference
                    ).toFixed(0)}฿/${dayDifference}วัน`}{" "}
                  </>
                )}
              </span>
            ),
            value: percentage,
            line: line,
            profit: (10000 / percentage / dayDifference).toFixed(0),
          };
        }
        return null;
      })
      .filter((result) => result !== null);

    setResults(newResults.sort((a, b) => b.profit - a.profit));
  };

  return (
    <Box className="background" width={"100%"}>
      <Box className="content">
        <Container>
          <Box display={"flex"} justifyContent={"center"}>
            <h1>Best-Profit</h1>
          </Box>
          <Box mb={1}>
            <TextField
              label="Enter Your Bag List."
              multiline
              rows={6}
              variant="outlined"
              fullWidth
              value={inputData}
              onChange={handleInputChange}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={generateResults}>
            Generate Best Profit!!
          </Button>
          <div>
            {results.length > 0 && <h3>Generated Results</h3>}
            {results.length > 0 && <h4>เงินตั้งต้น คำนวน/ต่อวัน 10,000฿</h4>}
            {results.map((result, index) => (
              <Box
                mb={1}
                sx={{
                  color:
                    index === 0
                      ? "lightgreen"
                      : index === 1
                      ? "yellow"
                      : "auto",
                }}
                display={"flex"}
                key={result.key}
              >
                <Box mr={1}>{result.text}</Box>
                <Box>
                  <IconButton aria-label="delete" size="small">
                    <CopyAllIcon
                      fontSize="inherit"
                      color="default"
                      onClick={() => {
                        navigator.clipboard.writeText(result.line);
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </div>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
