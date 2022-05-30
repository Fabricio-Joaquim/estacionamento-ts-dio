"use strict";
(function () {
    var _a, _b;
    const $ = (query) => document.querySelector(query);
    function convertPeriod(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min} minutos e ${sec} segundos`;
    }
    ;
    function renderGarage() {
        const garage = getGarage();
        $("#garage").innerHTML = "";
        garage.forEach((car) => addCarToGarage(car));
    }
    ;
    function addCarToGarage(car) {
        var _a;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${car.name}</td>
            <td>${car.licence}</td>
            <td data-time="${car.time}">
                ${new Date(car.time)
            .toLocaleString('pt-BR', {
            hour: 'numeric', minute: 'numeric'
        })}
            </td>
            <td>
                <button class="delete">x</button>
            </td>
        `;
        (_a = $("#garage")) === null || _a === void 0 ? void 0 : _a.appendChild(row);
    }
    ;
    function checkOut(board) {
        let period = new Date().getTime() - new Date(board[2].dataset.time).getTime();
        console.log(board[2], board[2].dataset.time);
        let nperiod = convertPeriod(period);
        const licence = board[1].textContent;
        const msg = `O veículo ${board[0].textContent} de placa ${licence} permaneceu ${nperiod} estacionado. \n\n Deseja encerrar?`;
        if (!confirm(msg))
            return;
        const garage = getGarage().filter((car) => car.licence !== licence);
        localStorage.garage = JSON.stringify(garage);
        renderGarage();
    }
    ;
    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];
    renderGarage();
    (_a = $("#send")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", e => {
        var _a, _b;
        const name = (_a = $("#name")) === null || _a === void 0 ? void 0 : _a.value;
        const licence = (_b = $("#licence")) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !licence) {
            alert("Os campos são obrigatórios.");
            return;
        }
        const newCar = { name, licence, time: new Date() };
        const garage = getGarage();
        garage.push(newCar);
        localStorage.garage = JSON.stringify(garage);
        addCarToGarage(newCar);
        $("#name").value = "";
        $("#licence").value = "";
    });
    (_b = $("#garage")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
        if (e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
})();
