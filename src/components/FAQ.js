//IMPORT
import React from 'react';
import Questions from './faqs.json';
import { useState } from 'react';


//FUNCTION COMPONENT 
function FAQ () {
    //States
    const [enteredKeywords, setEnteredKeywords] = useState(''); 


    //Data
    let id=0;
    //Functions & Methods
    //UI Rendering

    return (
        <div className="p-4">
            <div style={{minHeight: '60vh'}}>
                <h1>Frequently Asked Questions</h1>
                
                {/*Add search box on top*/}
                    <div className='row'>
                        <input className='col-6 ms-4 m-3' type='text'
                        name='search' onChange={(e) => {setEnteredKeywords(e.target.value)} } placeholder='Search Frequently Asked Questions - Type Keywords'>
                        </input>
                    </div>

                {/*Loop through all questions and display them*/}
                <div>
                    {/*and extract “question” & “answer” */}
                    {Questions.filter(
                        question => question.question.toLowerCase().includes(enteredKeywords.toLowerCase())
                        || question.answer.toLowerCase().includes(enteredKeywords.toLowerCase())
                        ).map(question => {
                    return(
                    <div className='bg-warning p-3 m-2 rounded mb-3' key={id++}>
                        <h4>{question.question}</h4>
                        <p>{question.answer}</p>
                    </div>
                    );
                }
                )}
                </div>
            </div>  
        </div>
        
    );

}

//EXPORT
export default FAQ;