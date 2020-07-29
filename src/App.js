import React,{useState,useEffect} from 'react';
import{
  MenuItem,
  FormControl,
  Select,Card, CardContent,Typography,
}from "@material-ui/core";
 import './App.css';
 import InfoBox from './InfoBox';
 import Map from "./Map";
 import Table from "./Table";
import {  sortData,prettyPrintStat } from "./util";
import LineGraph from './LineGraph';
import  "leaflet/dist/leaflet.css";
 
 

function App() {
  
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState('worldwide');
  const [countryInfo, setCountryInfo]=useState({});
  const [tableData,setTableData ]=useState([]);
  const  [mapCenter,setMapCenter]=
  useState ({lat:34.80746 , lng:-40.4796});
  const[mapZoom,setMapZoom]=useState(3);
  const [mapCountries,setMapCountries]= useState([]);
  const[casesType,setCasesType]=useState("cases");



  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then((response) => response.json()).then((data)=>{
      setCountryInfo(data);
    })
    
  }, [ ])
  
  //STATE  is hoe =w to write variables in react
 // USEEFFECT = Runs a piece of code based on a given condition 

 useEffect(() => {
   //the code inside runs once when the compinent loads and not again
   //async -> send a request ,wait for it , do somthing with the data 
   const getCountriesData= async()=>{
     await fetch("https://disease.sh/v3/covid-19/countries").then((response ) => response.json())
     .then((data)=> {
       const countries = data.map((country)=>(
         {
           name: country.country, //United Sates , Albania
           value: country.countryInfo.iso2  //US,AL
         }));
         const sortedData=sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
         setCountries(countries);
     });
   };

   getCountriesData();
 }, []);

 const onCountryChange=async(event)=>{
   const countryCode=event.target.value;
 

   const url= countryCode==='worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
   `https://disease.sh/v3/covid-19/countries/${countryCode}`;

   await fetch(url).then((response) => response.json()).then((data) =>{
    setCountry(countryCode);
     setCountryInfo(data);
     setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
     setMapZoom(4);
   })  ;
 };
  return (
    <div className="app"> 
    
      <div className="app__left">

      

      <div className="app__header">
      <h1>COVID 19 :<h1 className="app__toplive"> TRACKING LIVE </h1></h1>
      
      <FormControl className="app__dropdown">
        <Select
           variant="outlined"
           onChange={onCountryChange}
           value= {country}
        >
          <MenuItem value ="worldwide">WorldWide</MenuItem>
          {
            countries.map((country)=>(
              <MenuItem value ={country.value}>{country.name}</MenuItem>

            ))
          }
          {/*<MenuItem value ="worldwide">Worldwide</MenuItem>
          <MenuItem value ="worldwide">2</MenuItem>
          <MenuItem value ="worldwide">3</MenuItem>
           <MenuItem value ="worldwide">4</MenuItem>*/}
       </Select>
      </FormControl>
     </div>
     
      {/*header*/}


{/*Title + Select input dropdown field */}
      <div className="app__stats">
        <InfoBox isRed active={casesType==="cases"} onClick={(e)=>setCasesType("cases")} title="CoronaVirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}  />
        < InfoBox active={casesType==="recovered"} onClick={(e)=>setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
        <InfoBox isRed active={casesType==="deaths"} onClick={(e)=>setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
    
       
      </div>

      <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>


      </div>

      <Card className="app__right">
        <CardContent>
        
      
        <h3 className="app__live">Live Cases</h3>
        <Table countries={tableData}/> 
        <h3 className="app__graphtitle">WorldWide New {casesType } </h3>
        <LineGraph className="app__graph" casesType={casesType } />
        
           
        </CardContent>
        
      
      
        
      </Card>

      

      

 

    </div>
  );
}

export default App;
