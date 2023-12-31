const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const alive = e.target.querySelector('#domoAlive').checked;

    if (!name || !age) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, alive }, loadDomosFromServer);

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="DomoName" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="domoAlive">Alive: </label>
            <input id="domoAlive" type="checkbox" default="true" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
}

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const killDomo = (e, id) => {
        const parentElement = e.target.parentElement;
        const name = parentElement.querySelector(".domoName").innerText.split(" ")[1];
        const age = parentElement.querySelector(".domoAge").innerText.split(" ")[1];
        const alive = false;


        fetch('/updateDomo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, name, age, alive }),
        }).then(() => {
            parentElement.style.backgroundColor = '#ed5955';
            parentElement.style.borderColor = '#996260';
            parentElement.removeChild(e.target);
        });
    };

    const domoNodes = props.domos.map(domo => {
        return (
            <div key={domo._id} className="domo" style={{ backgroundColor: domo.alive ? '#55acee' : '#ed5955', borderColor: domo.alive ? '#338ace' : '#996260' }}>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                {domo.alive && <div id='domoDeath' onClick={(e) => killDomo(e, domo._id)}>X</div>}
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
}

const init = () => {
    ReactDOM.render(
        <DomoForm />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
}

window.onload = init;
