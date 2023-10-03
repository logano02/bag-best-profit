import React, { useState } from "react";
import { TextField, Button, Container, Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CopyAllIcon from "@mui/icons-material/CopyAll";

function App() {
  const [inputData, setInputData] = useState("");
  const [results, setResults] = useState([]);

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const generateResults = () => {
    const lines = inputData.split("\n");
    const regex = /(\d+)\s*กำไร\s*(\d+)/;

    const newResults = lines
      .map((line, index) => {
        const match = line.match(regex);
        if (match) {
          const beforeProfit = parseFloat(match[1]);
          const afterProfit = parseFloat(match[2]);
          const percentage = ((afterProfit / beforeProfit) * 100).toFixed(2);
          return {
            key: index,
            text: (
              <span>
                {line} : = <strong> {percentage}</strong> %
              </span>
            ),
            value: percentage,
            line: line,
          };
        }
        return null; // Return null for lines that don't match the pattern
      })
      .filter((result) => result !== null);

    setResults(newResults.sort((a, b) => b.value - a.value));
  };

  return (
    <Container>
      <Box display={"flex"}>
        <h2>Best-Profit</h2>
      </Box>
      <Box mb={1}>
        <TextField
          label="Enter Text"
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
        {results.length > 0 && <h2>Generated Results:</h2>}
        {results.map((result, index) => (
          <Box
            mb={1}
            sx={{
              color:
                index === 0 ? "green" : index === 1 ? "dodgerblue" : "auto",
            }}
            display={"flex"}
            key={result.key}
          >
            <Box mr={1}>{result.text}</Box>
            <Box>
              <IconButton aria-label="delete" size="small">
                <CopyAllIcon
                  fontSize="inherit"
                  color="primary"
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
  );
}

export default App;
