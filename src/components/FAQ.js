// IMPORT
import { useState } from "react";
import faqs from "./data/faqs.json"; // question and answer list

// FUNCTION COMPONENT
function FAQ() {
  // STATE
  const [enteredKeywords, setEnteredKeywords] = useState("");

  // DERIVED VALUES - calculated once per render, not stored in state
  const keywords = enteredKeywords.trim().toLowerCase();

  // FILTER FAQ LIST
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(keywords) ||
      faq.answer.toLowerCase().includes(keywords),
  );

  // UI RENDERING
  return (
    <div className="p-4">
      <div style={{ minHeight: "60vh" }}>
        <h1>Frequently Asked Questions</h1>

        {/*Search box - no submit button needed*/}
        <div className="row">
          <div className="col-12 my-3">
            <label htmlFor="faqSearch" className="visually-hidden">
              Search FAQs
            </label>
            <input
              id="faqSearch"
              className="form-control"
              type="search"
              name="search"
              value={enteredKeywords}
              onChange={(e) => setEnteredKeywords(e.target.value)}
              placeholder="Search FAQ - type keywords"
            />
          </div>
        </div>

        {/*Display the matching questions and answers*/}
        <div>
          {filteredFaqs.length === 0 && (
            <p>No questions match "{enteredKeywords.trim()}".</p>
          )}

          {filteredFaqs.map((faq, index) => (
            <div className="bg-light  border rounded p-3 m-2 mb-3" key={index}>
              <h4>{faq.question}</h4>
              <p className="mb-0">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// EXPORT
export default FAQ;
