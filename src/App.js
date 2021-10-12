import './App.css';
import axios from "axios";
import React, { useState } from "react";
//import {LineChart,XAxis,Tooltip,CartesianGrid,Line} from 'recharts';
import { Line } from "react-chartjs-2";
import { DragDropContext,Droppable,Draggable } from 'react-beautiful-dnd';



let dimensionTextInput = React.createRef(); 
let measureTextInput = React.createRef(); 




function App() {
  const [column, setColumns]=useState([]);
  const getColumns= () =>{
    axios.get("https://plotter-task.herokuapp.com/columns").then((response) => {
      const columnResponse= response.data
      setColumns(columnResponse);
    }); 
  
  }
  const [chartData, setChartData] = useState({});
let onClickHandler = () => {
let data1;
  data1 = {
    dimension: dimensionTextInput.current.value,
    measures: [measureTextInput.current.value] 
  };
  console.log(data1);
      let dataName=[];
      let dataValue=[];
      axios
        .post('https://plotter-task.herokuapp.com/data', data1)
        .then(res => {
          console.log(res);
          for(let i=0; i<6; i++){
          dataName.push(res.data[0].values[i]);
          dataValue.push(res.data[1].values[i]);
          }
          setChartData({
            labels:  dataName,
            datasets: [
              {
                label: "Value",
                data:  dataValue,
                backgroundColor: ["rgba(75, 192, 192, 0.6)"],
                borderWidth: 4
              }
            ]
          });
        })
        .catch(err => {
          console.log(err);
        });
      console.log(dataName, dataValue);

};
React.useEffect(() => {
  onClickHandler();
}, []);
React.useEffect(() => getColumns(), []);

  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="columns col-3">
        <div className="columns-names">
          <h3 className="title">Columns</h3>    
          <DragDropContext>  
            <Droppable droppableId="droppable" >  
            {(provided, snapshot) => (  
            <ul  
                        {...provided.droppableProps}  
                        ref={provided.innerRef}  
                    >  
                        {column.map((columns, index) => (  
                            <Draggable key={columns.name} draggableId={columns.name} index={index}>  
                                {(provided, snapshot) => (  
                                    <li      
                                    ref={provided.innerRef}  
                                    {...provided.draggableProps}  
                                    {...provided.dragHandleProps}> {columns.name}</li>
                                )}  
                            </Draggable>  
                        ))}  
                       {provided.placeholder}
                    </ul>  
                    
                )}   
                </Droppable>   
            </DragDropContext>  
          </div>
        </div>
        <div className="col-9">
          <div>
            <div className="dimension-wrapper">
              <h6>Dimension</h6>
               <select ref={dimensionTextInput}>
            {
              column.slice(0, 3).map(columns => {
                return <option  key={columns.name} value={columns.name}>{columns.name}</option>;
              })}
          </select>
              {/* <button className="btn btn-danger">Clear</button> */}
            </div>
            <div className="measures-wrapper">
            <h6>Measures</h6>
            <select  ref={measureTextInput}>
            {
              column.slice(3, 6).map(columns => {
                return <option  key={columns.name} value={columns.name}>{columns.name}</option>;
              })}
          </select>
            {/* <button className="btn btn-danger">Clear</button> */}
            </div>
          </div>
          <button onClick={onClickHandler} className="btn btn-primary plot">Plot</button>
          <Line
          data={chartData}
          options={{
            responsive: true,
            title: { text: "Graph", display: true },
            scales: {
              yAxes: [
                {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: true
                  },
                  gridLines: {
                    display: false
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            }
          }}
        />
      </div>
      </div>
    </div>
  );
}

export default App;
