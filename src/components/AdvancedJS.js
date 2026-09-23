//IMPORT
import React from 'react';

//FUNCTION COMPONENT
function AdvancedJS() {
    //States
   
    //Data
    const accordionItems = [
        {
            id: 'collapseOne',
            title: 'DEMO 1',
            heading: 'Javascript Demo 1',
            expanded: true, // first item open by default
        },
        {
            id: 'collapseTwo',
            title: 'DEMO 2',
            heading: 'Javascript Demo 2',
            expanded: false,
        },
        {
            id: 'collapseThree',
            title: 'DEMO 3',
            heading: 'Javascript Demo 3',
            expanded: false,
        },
        {
            id: 'collapseFour',
            title: 'DEMO 4',
            heading: 'Javascript Demo 4',
            expanded: false,
        },
        {
            id: 'collapseFive',
            title: 'DEMO 5',
            heading: 'Javascript Demo 5',
            expanded: false,
        },
    ];

    //Functions & Methods

    //UI Rendering
    return (
        <>
            <div style={{ minHeight: '60vh' }}>
                <div className="accordion row align-items-start p-2" id="accordionExample">
                    {/* Accordion Buttons */}
                    <div className="row col-12 col-lg-3">
                        {accordionItems.map((item) => (
                            <h2 className="accordion-header col-6 col-lg-12" key={item.id}>
                                <button
                                    className={`accordion-button ${item.expanded ? '' : 'collapsed'}`}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#${item.id}`}
                                    aria-expanded={item.expanded ? 'true' : 'false'}
                                    aria-controls={item.id}
                                >
                                    {item.title}
                                </button>
                            </h2>
                        ))}
                    </div>

                    {/* Accordion Bodies */}
                    <div className="col-12 col-lg-9">
                        {accordionItems.map((item) => (
                            <div className="accordion-item" key={item.id}>
                                <div
                                    id={item.id}
                                    className={`accordion-collapse collapse ${item.expanded ? 'show' : ''}`}
                                    data-bs-parent="#accordionExample"
                                >
                                    <div className="accordion-body" style={{ minHeight: '50vh' }}>
                                        <div className="row m-1">
                                            <h3 className="fw-bold">{item.heading}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdvancedJS;