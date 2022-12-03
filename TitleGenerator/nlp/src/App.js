import React from 'react';
import './App.css';
import Footer from './components/Footer';
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';


function App() {
  const [form, setForm] = React.useState({
    abstract: '',
    title: '',
  });

  const [model_pred, set_model_pred] = React.useState({});
  const [PredictionBar, setPredictionBar] = React.useState(true)

  const handleForm = (e) => {
    setForm((formProps) => ({ ...formProps, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e) =>{
    e.preventDefault()
    setPredictionBar(false)
    const url = "http://localhost:8000/model_predict"
    const predictions = await axios.post(url, {
      abstract: form.abstract,
      title: form.title
    })
    const data = JSON.parse(predictions.data);
    set_model_pred(data)
    setPredictionBar(true)
  }

  return (
    <>
      <section className="form-section">
        <h1 className="heading">Research Paper Title Generator 📚</h1>
        <form
        >
          <div className="input-block">
            <label className="label">
              Abstract <span className="requiredLabel">*</span>
            </label>
            <textarea
              className={`input ${
                form.abstract.length < 50 ? 'wrong-input' : 'correct-input'
              }`}
              type="textarea"
              name="abstract"
              rows={8}
              value={form.abstract}
              onChange={handleForm}
              placeholder="Type your abstract here"
              tabIndex={-1}
              required
            />
          </div>
          <div>
            {form.abstract.length < 50 ? (
              <p className="warning-message">
                Abstract should be more than 50 characters
              </p>
            ) : (
              ''
            )}
          </div>
          <div className="input-block">
            <label className="label">
              Title <span className="requiredLabel">*</span>
            </label>
            <input
              className={`input correct-input`}
              type="text"
              name="title"
              value={form.title}
              onChange={handleForm}
              tabIndex={-1}
              placeholder="Enter any title you have in your mind"
            />
          </div>
          {PredictionBar ? 
            (<button
              tabIndex={-1}
              className={`submit-button ${
                form.abstract.length > 50 ? 'button-success' : ''
              }`}
              onClick={handleSubmit}
            >
              Submit
            </button>) :
            (<div style={{marginTop:"20px"}}>
            <CircularProgress />
            </div>)
          }
        </form>
        {[model_pred].map((ele)=>{
          return Object.keys(ele).length ? (
          <>
          <h1 style={{paddingTop:"1rem"}}>
              Predictions: 
            </h1>
          <div key={ele} style={{lineHeight:'2.5rem', fontSize: '1.3rem', paddingTop:"1rem"}}>
            <p><h3>BART: </h3> {ele["bart"]}</p>
            <p><h3>MARIAN: </h3> {ele["marian"]}</p>
            <p><h3>T5: </h3> {ele["t5"]}</p>
          </div></>) : ''
        })}
      </section>
      <br /><br />
      <Footer />
    </>
  );
}

export default App;