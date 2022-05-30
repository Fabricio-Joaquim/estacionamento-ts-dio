interface ICar {
    name: string;
    licence: string;
    time: Date | string;

}
(function(){
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function convertPeriod(mil:number):string {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min} minutos e ${sec} segundos`;
    };

    function renderGarage () {
        const garage = getGarage();
        $("#garage")!.innerHTML = "";
        garage.forEach((car:ICar) => addCarToGarage(car))
    };

    function addCarToGarage (car:ICar) {
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

        $("#garage")?.appendChild(row);
    };

    function checkOut(board: [HTMLElement, HTMLElement, any]) {
        let period:number = new Date().getTime() - new Date(board[2].dataset.time).getTime();

        let nperiod = convertPeriod(period);

        const licence = board[1].textContent;
        const msg = `O veículo ${board[0].textContent} de placa ${licence} permaneceu ${nperiod} estacionado. \n\n Deseja encerrar?`;

        if(!confirm(msg)) return;
        
        const garage = getGarage().filter((car:ICar) => car.licence !== licence);
        localStorage.garage = JSON.stringify(garage);
        
        renderGarage();
    };

    const getGarage = ():ICar[] => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    renderGarage();
    $("#send")?.addEventListener("click", e => {
        const name = $("#name")?.value;
        const licence = $("#licence")?.value;

        if(!name || !licence){
            alert("Os campos são obrigatórios.");
            return;
        }   

        const newCar = { name, licence, time: new Date() };

        const garage = getGarage();
        garage.push(newCar);

        localStorage.garage = JSON.stringify(garage);

        addCarToGarage(newCar);
        $("#name")!.value = "";
        $("#licence")!.value = "";
    });

    $("#garage")?.addEventListener("click", (e:any) => {
        if((e.target as Element).className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
})()