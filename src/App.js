import "./App.css";
import { useEffect, useState } from "react";
import moment from "moment";

function App() {
  const [selectedDate, setSelectedDate] = useState(
    moment().format("DD-MM-YYYY")
  );
  const [amount, setAmount] = useState(0);
  const [options1, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [selectedFromOption, setSelectedFromOption] = useState("");
  const [selectedToOption, setSelectedToOption] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const handleChnage1 = (event) => {
    setSelectedFromOption(event.target.value);
    let remianingoptions = options1.filter(
      (option) => option !== event.target.value
    );
    setOptions2(remianingoptions);
  };

  const convertAmount = () => {
    console.log(selectedToOption);
    const [year, month, day] = moment(selectedDate).format("YYYY-MM-DD")
      .split("-");

    const fromCurrency = selectedFromOption.split(" - ")[1];
    const toCurrency = selectedToOption.split(" - ")[1];

    fetch(
      `https://v6.exchangerate-api.com/v6/6f3cb20f0236db6389c6363e/pair/${fromCurrency}/${toCurrency}/${amount}`
    )
      .then((response) => response.json())
      .then((data) => {
        const convertedAmount =
          data.conversion_result;
        setConvertedAmount(convertedAmount);
      })
      .catch((error) => {
        setIsError(true);
        setError(error);
      });
  };

  const fetchOptions = () => {
    fetch("https://v6.exchangerate-api.com/v6/6f3cb20f0236db6389c6363e/codes")
      .then((response) => response.json())
      .then((data) => {
        let newOptions = data.supported_codes.map(
          (code) => code[1] + " - " + code[0]
        );
        setOptions(newOptions);
      });
  };

  useEffect(() => {
    setOptions2(options1.shift());
    fetchOptions();
  }, []);

  return (
    <div className="App">
      <div className="converter">
        <p>Currency Converter</p>
        <div className="inputs" style={{ width: "165px" }}>
          <label>Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="inputs">
          <label>Amount</label>
          <input type="text" onChange={(e) => setAmount(e.target.value)}/>
        </div>
        <div className="inputs">
          <label htmlFor="dropdown">From</label>
          <select
            className="dropdown"
            onChange={handleChnage1}
            value={selectedFromOption}
          >
            {options1.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <image src="https://cityexplorer.net/wp-content/uploads/2015/03/Convert-Icon.png" />
        <div className="inputs">
          <label htmlFor="dropdown">To</label>
          {options2?.length > 0 && <select
            className="dropdown"
            onChange={(e) => setSelectedToOption(e.target.value)}
            value={selectedToOption}
          >
            {options2.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>}
        </div>
        <button className="button" onClick={convertAmount}>
          Convert
        </button>
        {!isError && <p>Your Converted Amount is : {convertedAmount}</p>}
        {isError && <p>There was an issue with your request.Please Try Again Later</p>}
      </div>
    </div>
  );
}

export default App;
